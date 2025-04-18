"use client"

import React from "react"
import { Link } from "react-router-dom"
import { CreditCard, PiggyBank, TrendingUp, Shield, Home, Briefcase, Smartphone, DollarSign, Globe, MapPin, Phone, Mail, Menu, X, ChevronRight, ArrowRight, Users, Building, Clock, Landmark } from 'lucide-react'
import { useAuthStore } from "../../store/auth-store"

const ServicesPage: React.FC = () => {
  const { currentUser } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  // Handle scroll effect for navbar
  React.useEffect(() => {
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
                <Link to="/">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                </Link>
              </div>
              <div className="ml-3">
                <Link to="/">
                  <h1 className={`text-xl font-bold ${scrolled ? "text-blue-900" : "text-blue-900"}`}>AMEN BANK</h1>
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-blue-700" : "text-gray-700 hover:text-blue-700"
                } transition-colors`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-blue-700" : "text-gray-700 hover:text-blue-700"
                } transition-colors`}
              >
                About
              </Link>
              <Link
                to="/services"
                className={`font-medium ${
                  scrolled ? "text-blue-700 hover:text-blue-900" : "text-blue-700 hover:text-blue-900"
                } transition-colors`}
              >
                Services
              </Link>
              <Link
                to="/contact"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-blue-700" : "text-gray-700 hover:text-blue-700"
                } transition-colors`}
              >
                Contact
              </Link>

              {!currentUser ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className={`font-medium ${
                      scrolled ? "text-blue-700 hover:text-blue-800" : "text-blue-700 hover:text-blue-800"
                    } transition-colors`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <Link
                  to={currentUser.role === "admin" ? "/admin" : "/dashboard"}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md ${
                  scrolled ? "text-gray-700 hover:bg-gray-100" : "text-gray-700 hover:bg-gray-100"
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
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/services"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {!currentUser ? (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-200">
                  <Link
                    to={currentUser.role === "admin" ? "/admin" : "/dashboard"}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16 pb-32 flex content-center items-center justify-center">
        <div
          className="absolute top-0 w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: "url('/placeholder.svg?height=600&width=1200')",
          }}
        >
          <span className="w-full h-full absolute opacity-75 bg-gradient-to-r from-blue-900 to-blue-700"></span>
        </div>
        <div className="container relative mx-auto">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <div className="pr-12">
                <h1 className="text-white font-semibold text-5xl">Our Services</h1>
                <p className="mt-4 text-lg text-white">
                  Comprehensive financial solutions designed to meet your personal and business banking needs.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
          style={{ height: "70px" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon className="text-gray-50 fill-current" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>
      </div>

      {/* Service Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center mb-24">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-semibold">Banking Solutions for Every Need</h2>
              <p className="text-lg leading-relaxed m-4 text-gray-600">
                Explore our comprehensive range of financial products and services designed to help you achieve your
                goals.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap">
            <div className="w-full md:w-6/12 lg:w-3/12 mb-12 px-4">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="px-6 py-8 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                    <Users className="w-6 h-6" />
                  </div>
                  <h6 className="text-xl font-semibold">Personal Banking</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    Everyday banking solutions for individuals and families to manage finances effectively.
                  </p>
                  <Link
                    to="/services/personal"
                    className="mt-2 inline-flex items-center text-blue-700 hover:text-blue-800"
                  >
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full md:w-6/12 lg:w-3/12 mb-12 px-4">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="px-6 py-8 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h6 className="text-xl font-semibold">Business Banking</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    Specialized services for businesses of all sizes to optimize operations and growth.
                  </p>
                  <Link
                    to="/services/business"
                    className="mt-2 inline-flex items-center text-blue-700 hover:text-blue-800"
                  >
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full md:w-6/12 lg:w-3/12 mb-12 px-4">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="px-6 py-8 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h6 className="text-xl font-semibold">Investment Services</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    Expert guidance and diverse investment options to help grow and protect your wealth.
                  </p>
                  <Link
                    to="/services/investments"
                    className="mt-2 inline-flex items-center text-blue-700 hover:text-blue-800"
                  >
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full md:w-6/12 lg:w-3/12 mb-12 px-4">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="px-6 py-8 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h6 className="text-xl font-semibold">Digital Banking</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    Convenient online and mobile banking solutions for secure, on-the-go financial management.
                  </p>
                  <Link
                    to="/services/digital"
                    className="mt-2 inline-flex items-center text-blue-700 hover:text-blue-800"
                  >
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Banking Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
              <div className="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-blue-100">
                <Users className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-3xl mb-2 font-semibold leading-normal">Personal Banking</h3>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700">
                Our personal banking services are designed to help you manage your day-to-day finances, save for the
                future, and achieve your financial goals.
              </p>
              <div className="mt-6">
                <div className="mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <CreditCard className="h-5 w-5 text-blue-700" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">Accounts & Cards</h4>
                  </div>
                  <p className="pl-12 mt-2 text-gray-600">
                    Choose from a variety of checking and savings accounts, plus credit and debit cards with competitive
                    rates and rewards.
                  </p>
                </div>
                <div className="mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Home className="h-5 w-5 text-blue-700" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">Mortgages & Loans</h4>
                  </div>
                  <p className="pl-12 mt-2 text-gray-600">
                    Competitive mortgage rates, personal loans, and home equity lines of credit to help you achieve your
                    dreams.
                  </p>
                </div>
                <div className="mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <PiggyBank className="h-5 w-5 text-blue-700" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">Savings & Investments</h4>
                  </div>
                  <p className="pl-12 mt-2 text-gray-600">
                    From basic savings accounts to retirement planning, we offer solutions to help you build and grow
                    your wealth.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  to="/services/personal"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 transition-colors"
                >
                  Explore Personal Banking
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="w-full md:w-4/12 px-4 mr-auto ml-auto mt-16 md:mt-0">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg">
                <img
                  alt="Personal Banking"
                  src="/placeholder.svg?height=400&width=600"
                  className="w-full align-middle rounded-t-lg"
                />
                <blockquote className="relative p-8 mb-4">
                  <svg
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 583 95"
                    className="absolute left-0 w-full block"
                    style={{
                      height: "95px",
                      top: "-94px",
                    }}
                  >
                    <polygon points="0,52 583,95 0,95" className="text-white fill-current"></polygon>
                  </svg>
                  <h4 className="text-xl font-bold text-gray-800">Customer Story</h4>
                  <p className="text-md font-light mt-2 text-gray-600">
                    "AMEN Bank helped me buy my first home with a mortgage that fit my budget perfectly. Their personal
                    banking team made the process simple and stress-free."
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-700" />
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-semibold">Sarah Johnson</h5>
                      <p className="text-xs text-gray-500">Homeowner</p>
                    </div>
                  </div>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Banking Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg">
                <img
                  alt="Business Banking"
                  src="/placeholder.svg?height=400&width=600"
                  className="w-full align-middle rounded-t-lg"
                />
                <blockquote className="relative p-8 mb-4">
                  <svg
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 583 95"
                    className="absolute left-0 w-full block"
                    style={{
                      height: "95px",
                      top: "-94px",
                    }}
                  >
                    <polygon points="0,52 583,95 0,95" className="text-white fill-current"></polygon>
                  </svg>
                  <h4 className="text-xl font-bold text-gray-800">Business Success</h4>
                  <p className="text-md font-light mt-2 text-gray-600">
                    "The business loan from AMEN Bank allowed us to expand our operations and hire more staff. Their
                    business banking team understood our needs and provided tailored solutions."
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-blue-700" />
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-semibold">Mohammed Ali</h5>
                      <p className="text-xs text-gray-500">Business Owner</p>
                    </div>
                  </div>
                </blockquote>
              </div>
            </div>

            <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
              <div className="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-blue-100">
                <Briefcase className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-3xl mb-2 font-semibold leading-normal">Business Banking</h3>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700">
                Our business banking services are designed to support businesses of all sizes, from startups to
                established enterprises, with solutions that optimize operations and drive growth.
              </p>
              <div className="mt-6">
                <div className="mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Building className="h-5 w-5 text-blue-700" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">Business Accounts</h4>
                  </div>
                  <p className="pl-12 mt-2 text-gray-600">
                    Checking and savings accounts designed specifically for businesses, with features like cash
                    management and merchant services.
                  </p>
                </div>
                <div className="mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <DollarSign className="h-5 w-5 text-blue-700" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">Business Loans & Financing</h4>
                  </div>
                  <p className="pl-12 mt-2 text-gray-600">
                    From startup capital to expansion financing, we offer flexible loan options to meet your business
                    needs.
                  </p>
                </div>
                <div className="mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Globe className="h-5 w-5 text-blue-700" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">International Banking</h4>
                  </div>
                  <p className="pl-12 mt-2 text-gray-600">
                    Support for international trade, foreign exchange, and global payments to help your business operate
                    worldwide.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  to="/services/business"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 transition-colors"
                >
                  Explore Business Banking
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
              <div className="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-blue-100">
                <TrendingUp className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-3xl mb-2 font-semibold leading-normal">Investment Services</h3>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700">
                Our investment services provide expert guidance and diverse options to help you grow and protect your
                wealth, whether you're saving for retirement or building a legacy.
              </p>
              <div className="mt-6">
                <div className="mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Landmark className="h-5 w-5 text-blue-700" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">Wealth Management</h4>
                  </div>
                  <p className="pl-12 mt-2 text-gray-600">
                    Personalized wealth management strategies tailored to your financial goals, risk tolerance, and time
                    horizon.
                  </p>
                </div>
                <div className="mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Clock className="h-5 w-5 text-blue-700" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">Retirement Planning</h4>
                  </div>
                  <p className="pl-12 mt-2 text-gray-600">
                    Comprehensive retirement planning services to help you prepare for a secure and comfortable future.
                  </p>
                </div>
                <div className="mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Shield className="h-5 w-5 text-blue-700" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">Investment Products</h4>
                  </div>
                  <p className="pl-12 mt-2 text-gray-600">
                    Access to a wide range of investment products, including mutual funds, stocks, bonds, and more.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  to="/services/investments"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 transition-colors"
                >
                  Explore Investment Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="w-full md:w-4/12 px-4 mr-auto ml-auto mt-16 md:mt-0">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg">
                <img
                  alt="Investment Services"
                  src="/placeholder.svg?height=400&width=600"
                  className="w-full align-middle rounded-t-lg"
                />
                <blockquote className="relative p-8 mb-4">
                  <svg
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 583 95"
                    className="absolute left-0 w-full block"
                    style={{
                      height: "95px",
                      top: "-94px",
                    }}
                  >
                    <polygon points="0,52 583,95 0,95" className="text-white fill-current"></polygon>
                  </svg>
                  <h4 className="text-xl font-bold text-gray-800">Investment Success</h4>
                  <p className="text-md font-light mt-2 text-gray-600">
                    "The investment advisors at AMEN Bank helped me create a diversified portfolio that has consistently
                    outperformed my expectations. Their expertise has been invaluable."
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-700" />
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-semibold">Leila Ben Salah</h5>
                      <p className="text-xs text-gray-500">Investor</p>
                    </div>
                  </div>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Banking Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg">
                <img
                  alt="Digital Banking"
                  src="/placeholder.svg?height=400&width=600"
                  className="w-full align-middle rounded-t-lg"
                />
                <blockquote className="relative p-8 mb-4">
                  <svg
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 583 95"
                    className="absolute left-0 w-full block"
                    style={{
                      height: "95px",
                      top: "-94px",
                    }}
                  >
                    <polygon points="0,52 583,95 0,95" className="text-white fill-current"></polygon>
                  </svg>
                  <h4 className="text-xl font-bold text-gray-800">Digital Experience</h4>
                  <p className="text-md font-light mt-2 text-gray-600">
                    "The AMEN Bank mobile app has transformed how I manage my finances. I can do everything from
                    checking balances to paying bills with just a few taps."
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-700" />
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-semibold">Ahmed Kaddour</h5>
                      <p className="text-xs text-gray-500">Mobile Banking User</p>
                    </div>
                  </div>
                </blockquote>
              </div>
            </div>

            <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
              <div className="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-blue-100">
                <Smartphone className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-3xl mb-2 font-semibold leading-normal">Digital Banking</h3>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700">
                Our digital banking solutions provide secure, convenient access to your accounts anytime, anywhere,
                allowing you to manage your finances with ease.
              </p>
              <div className="mt-6">
                <div className="mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Smartphone className="h-5 w-5 text-blue-700" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">Mobile Banking</h4>
                  </div>
                  <p className="pl-12 mt-2 text-gray-600">
                    Our user-friendly mobile app lets you bank on the go, with features like mobile check deposit, bill
                    pay, and account transfers.
                  </p>
                </div>
                <div className="mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Globe className="h-5 w-5 text-blue-700" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">Online Banking</h4>
                  </div>
                  <p className="pl-12 mt-2 text-gray-600">
                    Secure online banking platform with comprehensive features for managing your accounts from your
                    computer.
                  </p>
                </div>
                <div className="mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Shield className="h-5 w-5 text-blue-700" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">Security Features</h4>
                  </div>
                  <p className="pl-12 mt-2 text-gray-600">
                    Advanced security measures, including biometric authentication and encryption, to protect your
                    financial information.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  to="/services/digital"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 transition-colors"
                >
                  Explore Digital Banking
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative block py-24 lg:pt-0 bg-blue-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
            <div className="w-full lg:w-6/12 px-4">
              <div className="bg-white text-center rounded-lg p-8 shadow-lg">
                <h4 className="text-2xl font-semibold">Ready to get started?</h4>
                <p className="mt-4 text-gray-600">
                  Open an account today and experience the AMEN Bank difference. Our team is ready to help you find the
                  right financial solutions for your needs.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors"
                  >
                    Open an Account
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <h2 className="ml-3 text-xl font-bold">AMEN BANK</h2>
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
                    <Link to="/accounts" className="text-base text-gray-400 hover:text-white">
                      Accounts
                    </Link>
                  </li>
                  <li>
                    <Link to="/cards" className="text-base text-gray-400 hover:text-white">
                      Cards
                    </Link>
                  </li>
                  <li>
                    <Link to="/loans" className="text-base text-gray-400 hover:text-white">
                      Loans
                    </Link>
                  </li>
                  <li>
                    <Link to="/investments" className="text-base text-gray-400 hover:text-white">
                      Investments
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/help" className="text-base text-gray-400 hover:text-white">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-base text-gray-400 hover:text-white">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-base text-gray-400 hover:text-white">
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link to="/security" className="text-base text-gray-400 hover:text-white">
                      Security
                    </Link>
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
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-sm text-gray-400 hover:text-white">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ServicesPage
