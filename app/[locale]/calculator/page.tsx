import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function CalculatorPage() {
  const t = useTranslations('calculator');

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <div className="max-w-4xl w-full">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-center mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          {t('subtitle')}
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Calculator Coming Soon</h2>
          <p className="text-gray-700 mb-4">
            The multi-step rent calculator is currently being built based on the comprehensive agency brief.
          </p>
          <p className="text-gray-700 mb-4">
            This calculator will guide you through 6 steps to calculate your reference rent:
          </p>
          <ul className="text-left max-w-2xl mx-auto space-y-2 mb-6">
            <li>✓ Step 1: Housing Type Selector</li>
            <li>✓ Step 2: Property Type</li>
            <li>✓ Step 3: Property Details (size, rooms)</li>
            <li>✓ Step 4: Features & Amenities</li>
            <li>✓ Step 5: Energy Rating (PEB)</li>
            <li>✓ Step 6: Address & Location</li>
            <li>✓ Step 7: Results with PDF Export</li>
          </ul>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm">
            <p className="font-semibold mb-2">Project Scope:</p>
            <p className="text-gray-700">
              This is a comprehensive application with 7 calculator steps, detailed questionnaire (5 sections),
              contact form, PDF export, email integration, database storage, and full internationalization (FR/NL/EN).
              Implementation is in progress.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">What's Implemented:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✅ Next.js 15 with App Router</li>
              <li>✅ Internationalization (FR/NL/EN)</li>
              <li>✅ Supabase integration ready</li>
              <li>✅ Resend email integration ready</li>
              <li>✅ Radix UI components installed</li>
              <li>✅ Tailwind CSS configured</li>
              <li>✅ Project structure and routing</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">Next Steps:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>⏳ Build calculator state management</li>
              <li>⏳ Implement 7 calculator steps</li>
              <li>⏳ Add rent calculation formula</li>
              <li>⏳ Create PDF export feature</li>
              <li>⏳ Build questionnaire (5 sections)</li>
              <li>⏳ Add database schema</li>
              <li>⏳ Implement email notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
