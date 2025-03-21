"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { Shield, CreditCard, PiggyBank, TrendingUp, ChevronRight, CheckCircle, Users } from "lucide-react"

const HomePage: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-blue-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-blue-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-blue-900 transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <div className="pt-10 sm:pt-16 lg:pt-8 xl:pt-16">
              <div className="sm:text-center lg:text-left px-4 sm:px-8 xl:pl-0">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Modern Banking for a</span>
                  <span className="block text-blue-200">Better Future</span>
                </h1>
                <p className="mt-3 text-base text-blue-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Experience secure, innovative, and user-friendly banking services designed to meet all your financial
                  needs.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {!isAuthenticated ? (
                    <>
                      <div className="rounded-md shadow">
                        <Link
                          to="/register"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
                        >
                          Open an Account
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link
                          to="/login"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                        >
                          Login
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-md shadow">
                      <Link
                        to={currentUser?.role === "admin" ? "/admin" : "/dashboard"}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
                      >
                        Go to Dashboard
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="/placeholder.svg?height=600&width=800"
            alt="Banking app interface"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-900 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to manage your finances
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              AMEN Bank provides you with the tools and services you need to take control of your financial life.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-900 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure Banking</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  State-of-the-art security measures to protect your accounts and personal information.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-900 text-white">
                  <CreditCard className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Multiple Account Types</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Choose from a variety of account types to suit your financial needs and goals.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-900 text-white">
                  <PiggyBank className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Competitive Loans</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Access personal, home, and business loans with competitive rates and flexible terms.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-900 text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Financial Insights</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Track your spending, monitor your accounts, and gain insights into your financial habits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Open an account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-blue-50"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-900 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by thousands of customers
            </p>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-900" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Sarah Johnson</h3>
                    <p className="text-sm text-gray-500">Small Business Owner</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "AMEN Bank's business loan helped me expand my store. The process was smooth and the staff was
                  incredibly helpful."
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-900" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Mohammed Ali</h3>
                    <p className="text-sm text-gray-500">Homeowner</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The mortgage team at AMEN Bank made buying our first home a breeze. They explained everything clearly
                  and got us a great rate."
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-900" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Leila Ben Salah</h3>
                    <p className="text-sm text-gray-500">Student</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The student account at AMEN Bank has no fees and their mobile app makes it easy to manage my finances
                  while studying."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-900 font-semibold tracking-wide uppercase">Why Choose Us</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Banking that puts you first
            </p>
          </div>

          <div className="mt-10">
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <p className="ml-3 text-base text-gray-700">
                  <span className="font-medium text-gray-900">Established Trust:</span> Over 30 years of banking
                  excellence in Tunisia
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <p className="ml-3 text-base text-gray-700">
                  <span className="font-medium text-gray-900">Customer-Centric:</span> Personalized service tailored to
                  your unique needs
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <p className="ml-3 text-base text-gray-700">
                  <span className="font-medium text-gray-900">Digital Innovation:</span> Cutting-edge online and mobile
                  banking solutions
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <p className="ml-3 text-base text-gray-700">
                  <span className="font-medium text-gray-900">Community Focused:</span> Investing in local communities
                  and sustainable initiatives
                </p>
              </li>
            </ul>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800"
            >
              Join AMEN Bank Today
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

