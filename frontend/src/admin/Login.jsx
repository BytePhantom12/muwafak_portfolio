import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiLockClosed, HiUser, HiEye, HiEyeSlash, HiHome } from 'react-icons/hi2';
import { authAPI } from '../services/api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent duplicate submissions

    setError('');
    setIsLoading(true);

    try {
      await authAPI.login(username, password);
      onLogin();
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8E6DE] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Home Button */}
      <a
        href="/"
        className="absolute top-4 right-4 p-2 sm:px-4 sm:py-2 rounded-xl glass-card text-[#626058] hover:text-[#185FA5] hover:border-[#185FA5]/30 hover:shadow-[0_0_15px_rgba(24,95,165,0.15)] transition-all duration-300 flex items-center gap-2 z-20"
        title="Go to Homepage"
      >
        <HiHome className="w-4 h-4" />
        <span className="hidden sm:inline text-sm font-medium">Home</span>
      </a>

      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="blob w-[500px] h-[500px] bg-[#185FA5] top-[-100px] right-[-100px] opacity-10" />
        <div className="blob w-[600px] h-[600px] bg-[#C2C0B8] bottom-[-150px] left-[-150px] opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.05)]">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#185FA5] to-[#C2C0B8] flex items-center justify-center shadow-neon-both"
            >
              <HiLockClosed className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold font-display text-gradient mb-2">Admin Panel</h1>
            <p className="text-[#626058] text-sm">Sign in to manage your portfolio</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-[#1C1B19] mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="Enter username"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#1C1B19] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pr-12"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#185FA5] transition-colors"
                >
                  {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#626058]">
              Default: admin / admin123456
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
