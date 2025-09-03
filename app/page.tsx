export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-white">Route</div>
        <div className="flex gap-4">
          <a 
            href="https://accounts.tellroute.com/sign-in?redirect_url=https://tellroute.com/dashboard" 
            className="px-6 py-2 text-gray-300 hover:text-white transition"
          >
            Dashboard Login
          </a>
          <a 
            href="mailto:contact@tellroute.com" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Contact Sales
          </a>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            AI Voice Assistant for Your Business
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Never miss a customer call again. Our AI handles appointments, inquiries, and support 24/7 for any business.
          </p>
          <a 
            href="mailto:contact@tellroute.com" 
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition inline-block shadow-lg hover:shadow-xl"
          >
            Get Started
          </a>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-slate-700/50 backdrop-blur p-8 rounded-xl shadow-xl border border-slate-600">
            <h3 className="text-2xl font-bold mb-4 text-white">Restaurants</h3>
            <p className="text-gray-300">Handle reservations, takeout orders, hours inquiries, and menu questions automatically</p>
          </div>
          <div className="bg-slate-700/50 backdrop-blur p-8 rounded-xl shadow-xl border border-slate-600">
            <h3 className="text-2xl font-bold mb-4 text-white">Real Estate</h3>
            <p className="text-gray-300">Schedule property viewings, answer listing questions, and qualify leads 24/7</p>
          </div>
          <div className="bg-slate-700/50 backdrop-blur p-8 rounded-xl shadow-xl border border-slate-600">
            <h3 className="text-2xl font-bold mb-4 text-white">Service Businesses</h3>
            <p className="text-gray-300">Book appointments, provide instant quotes, and handle customer support calls</p>
          </div>
        </div>

        <div className="text-center mt-20 py-12 border-t border-slate-700">
          <p className="text-3xl font-bold text-white">Over 1 Million Calls Answered Monthly</p>
          <p className="text-xl text-gray-400 mt-2">Trusted by 2,000+ businesses worldwide</p>
        </div>
      </main>
    </div>
  );
}