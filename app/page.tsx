export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full items-center justify-between">
        <h1 className="text-4xl font-bold text-center mb-8">
          Loyer Brussels
        </h1>
        <p className="text-xl text-center mb-4">
          Brussels Rent Calculator - Fresh Start
        </p>
        <p className="text-center text-gray-600">
          A political organizing tool using rent calculation as an entry point for tenant rights advocacy.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Calculate Rent</h2>
            <p className="text-gray-600">Coming soon: Multi-step calculator to determine fair rent based on Brussels regulations.</p>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Know Your Rights</h2>
            <p className="text-gray-600">Coming soon: Comprehensive questionnaire and tenant rights information.</p>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Join Community</h2>
            <p className="text-gray-600">Coming soon: Connect with WUUNE and other tenants fighting for fair housing.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
