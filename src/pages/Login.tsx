import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('user@gmail.com');
  const [password, setPassword] = useState<string>('test123');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('https://ecommerce-backend-fawn-eight.vercel.app/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const token = await response.text();
      localStorage.setItem('token', token);
      navigate('/');
    } catch (error: any) {
      setError('Your email or password is incorrect. Please try again.');
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleGoogleSignIn = () => {
    window.location.href = 'https://myaccount.google.com';
  };

  const handleFacebookSignIn = () => {
    window.location.href = 'https://www.facebook.com';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Log in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>

          <div className="flex items-center justify-between space-x-4">
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm hover:bg-gray-50"
            >
              <FaGoogle className="mr-2 text-xl" />
              Sign in with Google
            </button>
            <button
              onClick={handleFacebookSignIn}
              type="button"
              className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm hover:bg-gray-50"
            >
              <FaFacebook className="mr-2 text-xl" />
              Sign in with Facebook
            </button>
          </div>

          <div className="text-sm text-center mt-4">
            <p className="text-gray-600">Don't have an account? <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Register here</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;