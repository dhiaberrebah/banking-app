import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';

const HomePage: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Modern Banking for a Better Future</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience secure, innovative, and user-friendly banking services designed to meet all your financial needs.
          </p>
          {!isAuthenticated && (
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="px-6 py-3 bg-blue-900 text-white font-medium rounded-md hover:bg-blue-800"
              >
                Open an Account
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;