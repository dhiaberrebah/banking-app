import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from "../contexts/auth-context";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { currentUser, logout, isAdmin } = useAuth();

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = (): void => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = (): void => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold text-xl">
              AMEN BANK
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
                  Home
                </Link>
                {!currentUser && (
                  <>
                    <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
                      Login
                    </Link>
                    <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
                      Register
                    </Link>
                  </>
                )}
                {currentUser && currentUser.role === "user" && (
                  <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
                    Dashboard
                  </Link>
                )}
                {currentUser && currentUser.role === "admin" && (
                  <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
                    Admin
                  </Link>
                )}
              </div>
            </div>
          </div>

          {currentUser && (
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
                  >
                    <span className="mr-2">{currentUser.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {dropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium text-gray-900">{currentUser.name}</p>
                        <p>{currentUser.email}</p>
                      </div>
                      {isAdmin ? (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              onClick={toggleMenu}
            >
              Home
            </Link>
            {!currentUser && (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </>
            )}
            {currentUser && currentUser.role === "user" && (
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
            )}
            {currentUser && currentUser.role === "admin" && (
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                onClick={toggleMenu}
              >
                Admin
              </Link>
            )}
          </div>

          {currentUser && (
            <div className="pt-4 pb-3 border-t border-blue-800">
              <div className="flex items-center px-5">
                <div className="ml-3">
                  <div className="text-base font-medium">{currentUser.name}</div>
                  <div className="text-sm font-medium text-blue-300">{currentUser.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;