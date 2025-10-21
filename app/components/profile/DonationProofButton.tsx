'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface MetadataAttributes {
  trait_type: string;
  value: string | number;
}

interface DynamicMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: MetadataAttributes[];
}

interface DonationProofButtonProps {
  address: string;
  userBasename?: string;
}

export function DonationProofButton({
  address,
  userBasename,
}: DonationProofButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!address) return;

    setIsGenerating(true);

    try {
      // Fetch metadata
      const response = await fetch(`/api/metadata/${address}`);

      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }

      const metadata: DynamicMetadata = await response.json();

      // Get attribute values
      const getAttributeValue = (traitType: string) => {
        return metadata.attributes.find(attr => attr.trait_type === traitType)
          ?.value;
      };

      const totalDonated =
        Number(getAttributeValue('Total Donated (USDC)')) || 0;
      const totalDonations = Number(getAttributeValue('Total Donations')) || 0;
      const lastDonation = getAttributeValue('Last Donation') as string;
      const tokenId = getAttributeValue('Token ID') || 'N/A';

      // Create PDF content (placeholder for future PDF generation)
      const _pdfContent = {
        content: [
          {
            text: 'HopeChain - Verified Donor Certificate',
            style: 'header',
            alignment: 'center',
            margin: [0, 0, 0, 20],
          },
          {
            text: 'This document certifies that the following address has made verified donations to HopeChain, an onchain cancer aid platform.',
            style: 'subheader',
            alignment: 'center',
            margin: [0, 0, 0, 30],
          },
          {
            table: {
              widths: ['30%', '70%'],
              body: [
                [
                  { text: 'Donor Address:', style: 'label' },
                  { text: address, style: 'value' },
                ],
                [
                  { text: 'Display Name:', style: 'label' },
                  { text: userBasename || 'Anonymous', style: 'value' },
                ],
                [
                  { text: 'NFT Token ID:', style: 'label' },
                  { text: tokenId.toString(), style: 'value' },
                ],
                [
                  { text: 'Total Donated:', style: 'label' },
                  { text: `$${totalDonated.toFixed(2)} USDC`, style: 'value' },
                ],
                [
                  { text: 'Number of Donations:', style: 'label' },
                  { text: totalDonations.toString(), style: 'value' },
                ],
                [
                  { text: 'Last Donation:', style: 'label' },
                  { text: lastDonation || 'N/A', style: 'value' },
                ],
                [
                  { text: 'Verification Date:', style: 'label' },
                  { text: new Date().toLocaleDateString(), style: 'value' },
                ],
              ],
            },
            margin: [0, 0, 0, 30],
          },
          {
            text: 'This certificate is generated from on-chain data and can be verified at any time using the donor address and token ID.',
            style: 'footer',
            alignment: 'center',
            margin: [0, 20, 0, 0],
          },
          {
            text: 'HopeChain - Onchain Cancer Aid Platform',
            style: 'footer',
            alignment: 'center',
            margin: [0, 10, 0, 0],
          },
        ],
        styles: {
          header: {
            fontSize: 24,
            bold: true,
            color: '#2563eb',
          },
          subheader: {
            fontSize: 12,
            color: '#6b7280',
          },
          label: {
            fontSize: 12,
            bold: true,
            color: '#374151',
          },
          value: {
            fontSize: 12,
            color: '#111827',
          },
          footer: {
            fontSize: 10,
            color: '#6b7280',
          },
        },
        defaultStyle: {
          font: 'Helvetica',
        },
      };

      // For now, we'll create a simple text-based proof
      // In a real implementation, you'd use a PDF library like jsPDF or pdfmake
      const proofText = `
HOPECHAIN - VERIFIED DONOR CERTIFICATE
=====================================

This document certifies that the following address has made verified donations to HopeChain, an onchain cancer aid platform.

Donor Address: ${address}
Display Name: ${userBasename || 'Anonymous'}
NFT Token ID: ${tokenId}
Total Donated: $${totalDonated.toFixed(2)} USDC
Number of Donations: ${totalDonations}
Last Donation: ${lastDonation || 'N/A'}
Verification Date: ${new Date().toLocaleDateString()}

This certificate is generated from on-chain data and can be verified at any time using the donor address and token ID.

HopeChain - Onchain Cancer Aid Platform
Generated on: ${new Date().toISOString()}
      `.trim();

      // Create and download the file
      const blob = new Blob([proofText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `HopeChain-Donor-Proof-${address.slice(0, 8)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating proof:', error);
      alert('Failed to generate donation proof. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating || !address}
      variant='outline'
      className='w-full'
    >
      {isGenerating ? (
        <>
          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2'></div>
          Generating...
        </>
      ) : (
        <>
          <Download className='w-4 h-4 mr-2' />
          Download Proof of Donation
        </>
      )}
    </Button>
  );
}
