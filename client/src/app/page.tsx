import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-6xl font-extrabold text-blue-600 tracking-tight">
          TaskFlow <span className="text-gray-900">🚀</span>
        </h1>
        <p className="text-xl text-gray-600">
          The real-time collaborative task manager for modern teams.
          Manage projects, track priorities, and stay in sync instantly.
        </p>
        
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/login">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl">
              Get Started →
            </button>
          </Link>
          
          <Link href="/register">
            <button className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}