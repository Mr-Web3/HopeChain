'use client';

// Import our new components
import { ImpactStats } from '../components/impact/ImpactStats';
import { PatientCard } from '../components/impact/PatientCard';
import { CallToAction } from '../components/impact/CallToAction';
import { useVaultMetrics } from '../hooks/useVaultMetrics';

const patientCases: Array<{
  id: number;
  name: string;
  age: number;
  condition: string;
  location: string;
  treatment: string;
  amountNeeded: number;
  amountRaised: number;
  status: 'Fully Funded' | 'In Progress';
  dateFunded: string | null;
  description: string;
  image: string;
}> = [
  {
    id: 1,
    name: 'Sarah M.',
    age: 34,
    condition: 'Stage 3 Breast Cancer',
    location: 'San Francisco, CA',
    treatment: 'CAR-T Cell Therapy',
    amountNeeded: 125000,
    amountRaised: 125000,
    status: 'Fully Funded',
    dateFunded: '2024-01-15',
    description:
      "Sarah received breakthrough CAR-T cell therapy that successfully put her cancer into remission. She's now cancer-free and back to work.",
    image: '/api/placeholder/300/200',
  },
  {
    id: 2,
    name: 'Michael R.',
    age: 28,
    condition: 'Glioblastoma',
    location: 'Austin, TX',
    treatment: 'Immunotherapy Trial',
    amountNeeded: 85000,
    amountRaised: 85000,
    status: 'Fully Funded',
    dateFunded: '2024-02-03',
    description:
      'Michael participated in a cutting-edge immunotherapy trial that significantly extended his life expectancy and improved his quality of life.',
    image: '/api/placeholder/300/200',
  },
  {
    id: 3,
    name: 'Elena K.',
    age: 41,
    condition: 'Pancreatic Cancer',
    location: 'Miami, FL',
    treatment: 'Targeted Therapy',
    amountNeeded: 95000,
    amountRaised: 72000,
    status: 'In Progress',
    dateFunded: null,
    description:
      'Elena is currently receiving targeted therapy that has shown promising results in clinical trials for pancreatic cancer.',
    image: '/api/placeholder/300/200',
  },
  {
    id: 4,
    name: 'David L.',
    age: 52,
    condition: 'Lung Cancer',
    location: 'Seattle, WA',
    treatment: 'Precision Medicine',
    amountNeeded: 110000,
    amountRaised: 110000,
    status: 'Fully Funded',
    dateFunded: '2024-01-28',
    description:
      'David received personalized precision medicine treatment based on his genetic profile, leading to complete tumor regression.',
    image: '/api/placeholder/300/200',
  },
  {
    id: 5,
    name: 'Maria S.',
    age: 29,
    condition: 'Leukemia',
    location: 'Chicago, IL',
    treatment: 'Stem Cell Transplant',
    amountNeeded: 150000,
    amountRaised: 98000,
    status: 'In Progress',
    dateFunded: null,
    description:
      'Maria is preparing for a life-saving stem cell transplant that offers the best chance for long-term remission.',
    image: '/api/placeholder/300/200',
  },
  {
    id: 6,
    name: 'James W.',
    age: 45,
    condition: 'Colon Cancer',
    location: 'Denver, CO',
    treatment: 'Surgery + Chemo',
    amountNeeded: 75000,
    amountRaised: 75000,
    status: 'Fully Funded',
    dateFunded: '2024-02-10',
    description:
      'James underwent successful surgery followed by targeted chemotherapy, achieving complete remission.',
    image: '/api/placeholder/300/200',
  },
];

export default function ImpactPage() {
  const vaultMetrics = useVaultMetrics();

  // Use real data from contracts
  const totalRaised = vaultMetrics.totalDonated;
  const patientsHelped = vaultMetrics.livesChanged;
  const successRate =
    patientsHelped > 0
      ? Math.round((patientsHelped / Math.max(patientsHelped, 1)) * 100)
      : 0;

  // Keep patient cases for display purposes (these could be real cases in the future)
  const _fullyFunded = patientCases.filter(
    case_ => case_.status === 'Fully Funded'
  ).length;

  return (
    <div className='min-h-screen bg-background'>
      <main className='max-w-7xl mx-auto px-6 sm:px-8 py-16 pb-24 md:pb-16'>
        <div className='space-y-16'>
          {/* Impact Statistics */}
          <ImpactStats
            totalRaised={totalRaised}
            patientsHelped={patientsHelped}
            successRate={successRate}
            totalCases={patientCases.length}
            isLoading={vaultMetrics.isLoading}
          />

          {/* Patient Cases Grid */}
          <div className='space-y-8'>
            <div className='text-center'>
              <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
                Patient Stories
              </h2>
              <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
                Real people whose lives have been transformed through your
                generous donations
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {patientCases.map((case_, index) => (
                <PatientCard key={case_.id} case_={case_} index={index} />
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <CallToAction />
        </div>
      </main>
    </div>
  );
}
