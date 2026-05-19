import React from 'react';

const LoginForm = ({ 
  initialView, 
  onBack, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  error, 
  handleLogin 
}) => {
  return (
    <div className="fixed inset-0 z-[200] bg-[#f8f9fa] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 md:p-12 border-l-4 border-[#c5a059] relative shadow-2xl rounded-r-sm">
        <button
          onClick={onBack}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-10">
          <span className="text-[#c5a059] font-headline text-[10px] tracking-[0.5em] uppercase opacity-80 font-bold">
            {initialView === 'admin' ? 'Admin Portal' : initialView === 'member' ? 'Member Portal' : 'Authentication'}
          </span>
          <h2 className="text-3xl md:text-4xl font-headline mt-4 text-gray-900">
            {initialView === 'admin' ? 'Admin Login' : initialView === 'member' ? 'Member Login' : 'Secure Login'}
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 text-gray-900 focus:border-[#c5a059] outline-none transition-all font-body"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 text-gray-900 focus:border-[#c5a059] outline-none transition-all font-body"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs font-body tracking-wider font-bold">{error}</p>}
          <button
            type="submit"
            className="w-full py-4 bg-[#c5a059] text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#b08d4a] transition-all duration-300 shadow-xl shadow-[#c5a059]/20"
          >
            Access Portal
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
