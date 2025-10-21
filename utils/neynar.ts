// Neynar API integration for fetching Farcaster user data
const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

export interface NeynarUserProfile {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  profile: {
    bio: {
      text: string;
    };
  };
  follower_count: number;
  following_count: number;
  verified_addresses: {
    eth_addresses: string[];
  };
  social_verifications: {
    twitter: string;
    github: string;
  };
  location: {
    place_id: string;
    description: string;
  };
}

// Rate limiting protection
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

// Cache to prevent duplicate requests
const profileCache = new Map<number, NeynarUserProfile | null>();

export async function fetchNeynarUserProfile(
  fid: number
): Promise<NeynarUserProfile | null> {
  if (!NEYNAR_API_KEY) {
    console.warn('Neynar API key not found');
    return null;
  }

  // Check cache first
  if (profileCache.has(fid)) {
    return profileCache.get(fid) || null;
  }

  // Rate limiting protection
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    console.log('Rate limiting: waiting before next request');
    await new Promise(resolve =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  lastRequestTime = Date.now();

  try {
    // Use the correct Neynar API v2 endpoint
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      {
        headers: {
          api_key: NEYNAR_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Rate limit exceeded, skipping Neynar request');
        return null;
      }
      const errorText = await response.text();
      console.error('Neynar API error response:', errorText);
      return null; // Don't throw, just return null
    }

    const data = await response.json();
    // v2 API returns users array, get first user
    const userProfile = data.users?.[0] || null;

    // Cache the result
    profileCache.set(fid, userProfile);

    return userProfile;
  } catch (error) {
    console.error('Error fetching Neynar user profile:', error);
    // Cache null result to prevent retries
    profileCache.set(fid, null);
    return null;
  }
}
