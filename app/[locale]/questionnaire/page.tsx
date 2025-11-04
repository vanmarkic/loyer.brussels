import { Link } from '@/i18n/routing';

export default function QuestionnairePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/calculator"
            className="text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-2"
          >
            ← Back to calculator
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Detailed Questionnaire</h1>
          <p className="text-xl text-gray-600">5-minute questionnaire for personalized support</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Questionnaire Coming Soon</h2>
          <p className="text-gray-700 mb-4">
            The detailed 5-section questionnaire is being implemented to collect:
          </p>
          <ul className="text-left max-w-2xl mx-auto space-y-2 mb-6">
            <li>✓ Section 1: Collected Information Summary</li>
            <li>✓ Section 2: Personal Situation (lease type, income, household)</li>
            <li>✓ Section 3: Housing Problems (health issues, defects)</li>
            <li>✓ Section 4: Positive Aspects</li>
            <li>✓ Section 5: Personalized Results & Next Steps</li>
          </ul>
          <Link href="/calculator">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Return to Calculator
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
