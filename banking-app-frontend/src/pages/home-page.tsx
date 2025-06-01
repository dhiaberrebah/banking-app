"use client"

import { useState, useEffect } from "react"
import {
  Shield,
  CreditCard,
  PiggyBank,
  TrendingUp,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  Globe,
  Phone,
  Mail,
  Clock,
  Lock,
  Smartphone,
  MapPin,
} from "lucide-react"

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img src="/images/amen-bank-logo.png" alt="AMEN BANK" className="h-10 w-auto" />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-green-700" : "text-white hover:text-green-200"
                } transition-colors`}
              >
                Home
              </a>
              <a
                href="/about"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-green-700" : "text-white hover:text-green-200"
                } transition-colors`}
              >
                About
              </a>
              <a
                href="/services"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-green-700" : "text-white hover:text-green-200"
                } transition-colors`}
              >
                Services
              </a>
              <a
                href="/contact"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-green-700" : "text-white hover:text-green-200"
                } transition-colors`}
              >
                Contact
              </a>

              {!currentUser ? (
                <div className="flex items-center space-x-4">
                  <a
                    href="/login"
                    className={`font-medium ${
                      scrolled ? "text-green-700 hover:text-green-800" : "text-white hover:text-green-200"
                    } transition-colors`}
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-sm"
                  >
                    Register
                  </a>
                </div>
              ) : (
                <a
                  href={currentUser?.role === "admin" ? "/admin" : "/dashboard"}
                  className="px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-sm"
                >
                  Dashboard
                </a>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md ${
                  scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-green-800"
                }`}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a
                href="/services"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </a>
              <a
                href="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>

              {!currentUser ? (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <a
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-green-700 hover:text-green-800 hover:bg-green-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </a>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-200">
                  <a
                    href={currentUser?.role === "admin" ? "/admin" : "/dashboard"}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-900 to-green-700 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-green-700 transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <div className="pt-16 sm:pt-24 lg:pt-32 xl:pt-40">
              <div className="sm:text-center lg:text-left px-4 sm:px-8 xl:pl-0">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Modern Banking for a</span>
                  <span className="block text-green-200">Better Future</span>
                </h1>
                <p className="mt-3 text-base text-green-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Experience secure, innovative, and user-friendly banking services designed to meet all your financial
                  needs.
                </p>
                <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                  {!currentUser ? (
                    <>
                      <div className="rounded-md shadow">
                        <a
                          href="/register"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-900 bg-white hover:bg-gray-100 transition-colors md:py-4 md:text-lg md:px-10"
                        >
                          Open an Account
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </a>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <a
                          href="/login"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-500 transition-colors md:py-4 md:text-lg md:px-10"
                        >
                          Login
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-md shadow">
                      <a
                        href={currentUser?.role === "admin" ? "/admin" : "/dashboard"}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-900 bg-white hover:bg-gray-100 transition-colors md:py-4 md:text-lg md:px-10"
                      >
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 -mt-10">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <TrendingUp className="h-6 w-6 text-green-700" />
                </div>
                <h3 className="ml-4 text-lg font-medium text-gray-900">Economiser de l&apos;argent</h3>
              </div>
              <p className="mt-4 text-base text-gray-600">
                Découvrez nos solutions d&apos;épargne les plus adaptées à vos besoins.
              </p>
              <div className="mt-6">
                <a href="/personal-banking" className="inline-flex items-center text-green-700 hover:text-green-800">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <PiggyBank className="h-6 w-6 text-green-700" />
                </div>
                <h3 className="ml-4 text-lg font-medium text-gray-900">Emprunter de l&apos;argent</h3>
              </div>
              <p className="mt-4 text-base text-gray-600">
                Découvrez nos solutions de financement pour vous aider à concrétiser tous vos projets.
              </p>
              <div className="mt-6">
                <a href="/business-banking" className="inline-flex items-center text-green-700 hover:text-green-800">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <CreditCard className="h-6 w-6 text-green-700" />
                </div>
                <h3 className="ml-4 text-lg font-medium text-gray-900">Acheter une voiture</h3>
              </div>
              <p className="mt-4 text-base text-gray-600">
                Profitez d&apos;un crédit adapté pour financer tout type de véhicule (voiture neuve ou d&apos;occasion).
              </p>
              <div className="mt-6">
                <a href="/investments" className="inline-flex items-center text-green-700 hover:text-green-800">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <Lock className="h-6 w-6 text-green-700" />
                </div>
                <h3 className="ml-4 text-lg font-medium text-gray-900">Acheter un bien immobilier</h3>
              </div>
              <p className="mt-4 text-base text-gray-600">
                Découvrez nos solutions dédiées pour financer tous vos projets immobiliers (achat d&apos;un terrain ou
                d&apos;un appartement, construction,...).
              </p>
              <div className="mt-6">
                <a href="/investments" className="inline-flex items-center text-green-700 hover:text-green-800">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-700 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to manage your finances
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              AMEN Bank provides you with the tools and services you need to take control of your financial life.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-14 w-14 rounded-md bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg">
                  <Shield className="h-7 w-7" />
                </div>
                <div className="ml-20">
                  <h3 className="text-xl font-medium text-gray-900">Secure Banking</h3>
                  <p className="mt-2 text-base text-gray-500">
                    State-of-the-art security measures to protect your accounts and personal information with advanced
                    encryption and multi-factor authentication.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-14 w-14 rounded-md bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg">
                  <CreditCard className="h-7 w-7" />
                </div>
                <div className="ml-20">
                  <h3 className="text-xl font-medium text-gray-900">Multiple Account Types</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Choose from a variety of account types to suit your financial needs and goals, including checking,
                    savings, and investment accounts.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-14 w-14 rounded-md bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg">
                  <PiggyBank className="h-7 w-7" />
                </div>
                <div className="ml-20">
                  <h3 className="text-xl font-medium text-gray-900">Competitive Loans</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Access personal, home, and business loans with competitive rates and flexible terms tailored to your
                    specific financial situation.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-14 w-14 rounded-md bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg">
                  <TrendingUp className="h-7 w-7" />
                </div>
                <div className="ml-20">
                  <h3 className="text-xl font-medium text-gray-900">Financial Insights</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Track your spending, monitor your accounts, and gain insights into your financial habits with our
                    advanced analytics tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Banking Section */}
      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Banking at your fingertips</h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Our mobile app gives you the freedom to bank anytime, anywhere. Manage your accounts, make payments, and
                track your finances on the go.
              </p>
              <div className="mt-8 space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-700">
                      <Smartphone className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Easy Account Management</h3>
                    <p className="mt-2 text-base text-gray-500">
                      View balances, transaction history, and statements with just a few taps.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-700">
                      <Lock className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Secure Transactions</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Transfer money, pay bills, and make deposits securely from your mobile device.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-700">
                      <Clock className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">24/7 Access</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Bank on your schedule with round-the-clock access to your accounts.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <a
                  href="/mobile-banking"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 transition-colors"
                >
                  Learn more about mobile banking
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:relative">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img
                    className="w-full"
                    src="https://via.placeholder.com/400x300"
                    alt="Mobile banking app interface"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white bg-opacity-75 rounded-full p-4">
                      <svg className="h-12 w-12 text-green-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-800 to-green-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-green-200">Open an account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-900 bg-white hover:bg-green-50 transition-colors"
              >
                Get started
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-500 transition-colors"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center">
                <img src="/images/amen-bank-logo.png" alt="AMEN BANK" className="h-10 w-auto" />
              </div>
              <p className="mt-4 text-sm text-gray-400">
                Your trusted banking partner for over 30 years, providing innovative financial solutions for individuals
                and businesses.
              </p>
              <div className="mt-6 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Products</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="/accounts" className="text-base text-gray-400 hover:text-white">
                      Accounts
                    </a>
                  </li>
                  <li>
                    <a href="/cards" className="text-base text-gray-400 hover:text-white">
                      Cards
                    </a>
                  </li>
                  <li>
                    <a href="/loans" className="text-base text-gray-400 hover:text-white">
                      Loans
                    </a>
                  </li>
                  <li>
                    <a href="/investments" className="text-base text-gray-400 hover:text-white">
                      Investments
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="/help" className="text-base text-gray-400 hover:text-white">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-base text-gray-400 hover:text-white">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="/faq" className="text-base text-gray-400 hover:text-white">
                      FAQs
                    </a>
                  </li>
                  <li>
                    <a href="/security" className="text-base text-gray-400 hover:text-white">
                      Security
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Contact</h3>
                <ul className="mt-4 space-y-4">
                  <li className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-400">+216 71 123 456</span>
                  </li>
                  <li className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-400">contact@amenbank.com</span>
                  </li>
                  <li className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-400">www.amenbank.com</span>
                  </li>
                  <li className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-400">Avenue Mohamed V, Tunis</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} AMEN Bank. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="/terms" className="text-sm text-gray-400 hover:text-white">
                Terms of Service
              </a>
              <a href="/privacy" className="text-sm text-gray-400 hover:text-white">
                Privacy Policy
              </a>
              <a href="/cookies" className="text-sm text-gray-400 hover:text-white">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
