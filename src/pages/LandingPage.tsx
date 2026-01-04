import { Link } from 'react-router-dom';
import { School, UserPlus, LogIn, CheckCircle, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* --- Navigation --- */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <School className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">BrightHub</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600">How it Works</a>
          <Link to="/login" className="flex items-center gap-2 px-5 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition">
            <LogIn size={18} /> Login
          </Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="px-8 py-20 bg-gradient-to-b from-blue-50 to-white text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Modern Management for <br />
          <span className="text-blue-600">Modern Schools.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10">
          The all-in-one platform for school administrators, teachers, parents, and students. 
          Keep your school data clean, secure, and flowing smoothly.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {/* Path A Entry */}
          <Link to="/register-school" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
            <School size={20} /> Register Your School
          </Link>
          {/* Path B Entry */}
          <Link to="/signup" className="flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg border border-gray-200 hover:border-blue-600 transition">
            <UserPlus size={20} /> Individual Signup
          </Link>
        </div>
      </header>

      {/* --- Entry Models Models Section --- */}
      <section id="features" className="px-8 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Choose Your Entry Path</h2>
          <p className="text-gray-500 mt-2">Designed for both institutions and individuals.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Path A Details */}
          <div className="p-8 border border-gray-100 rounded-3xl bg-gray-50">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 text-left">School-First Registration</h3>
            <p className="text-gray-600 text-left mb-6">
              Best for institutions. Create your school profile, then securely invite your teachers and students.
            </p>
            <ul className="space-y-3 text-left">
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle size={16} className="text-green-500" /> Centralized school data</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle size={16} className="text-green-500" /> Secure Admin Dashboard</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle size={16} className="text-green-500" /> Role-based invitation system</li>
            </ul>
          </div>

          {/* Path B Details */}
          <div className="p-8 border border-gray-100 rounded-3xl bg-white shadow-sm">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 text-left">Individual Signup</h3>
            <p className="text-gray-600 text-left mb-6">
              Perfect for demos and trials. Explore the platform before joining or creating an institution.
            </p>
            <ul className="space-y-3 text-left">
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle size={16} className="text-purple-500" /> Instant access</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle size={16} className="text-purple-500" /> Feature exploration</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle size={16} className="text-purple-500" /> Join a school later via code</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-white">
            <School size={20} />
            <span className="font-bold">BrightHub</span>
          </div>
          <p className="text-sm">© 2026 Bright School Hub. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/login" className="hover:text-white transition">Admin Portal</Link>
            <Link to="/register-school" className="hover:text-white transition">Partner with Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}