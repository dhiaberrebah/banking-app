"use client"

import React from "react"
import { Link } from "react-router-dom"
import { Users, Award, Target, Heart, Clock, ChevronRight, Building, TrendingUp, Shield, Globe, MapPin, Phone, Mail, Menu, X } from 'lucide-react'
import { useAuthStore } from "../../store/auth-store"

const AboutPage: React.FC = () => {
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
                  scrolled ? "text-blue-700 hover:text-blue-900" : "text-blue-700 hover:text-blue-900"
                } transition-colors`}
              >
                About
              </Link>
              <Link
                to="/services"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-blue-700" : "text-gray-700 hover:text-blue-700"
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
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/services"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50"
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
                <h1 className="text-white font-semibold text-5xl">About AMEN Bank</h1>
                <p className="mt-4 text-lg text-white">
                  A trusted financial institution with a rich history of excellence, innovation, and commitment to our
                  customers and communities.
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

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
              <div className="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-blue-100">
                <Clock className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-3xl mb-2 font-semibold leading-normal">Our Story</h3>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700">
                Founded in 1971, AMEN Bank has grown from a small local bank to one of Tunisia's leading financial
                institutions. For over five decades, we have been at the forefront of banking innovation while
                maintaining our commitment to personalized service.
              </p>
              <p className="text-lg font-light leading-relaxed mt-0 mb-4 text-gray-700">
                Through economic changes and technological advancements, we have consistently adapted to meet the
                evolving needs of our customers while staying true to our core values of integrity, excellence, and
                community focus.
              </p>
              <p className="text-lg font-light leading-relaxed mt-0 mb-4 text-gray-700">
                Today, AMEN Bank serves hundreds of thousands of customers across Tunisia with a comprehensive range of
                financial products and services designed to help individuals and businesses achieve their financial
                goals.
              </p>
            </div>

            <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg">
                <img
                  alt="AMEN Bank Headquarters"
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
                  <h4 className="text-xl font-bold text-gray-800">AMEN Bank Headquarters</h4>
                  <p className="text-md font-light mt-2 text-gray-600">
                    Our headquarters in Tunis stands as a symbol of our stability and commitment to serving the Tunisian
                    community for generations to come.
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="pt-20 pb-48 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center mb-24">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-semibold">Our Mission, Vision & Values</h2>
              <p className="text-lg leading-relaxed m-4 text-gray-600">
                The guiding principles that drive everything we do at AMEN Bank.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                    <Target className="w-6 h-6" />
                  </div>
                  <h6 className="text-xl font-semibold">Our Mission</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    To provide innovative, secure, and accessible financial solutions that empower our customers to
                    achieve their goals and contribute to the economic development of Tunisia.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h6 className="text-xl font-semibold">Our Vision</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    To be the most trusted and preferred financial partner in Tunisia, recognized for excellence,
                    innovation, and positive impact on the communities we serve.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-700">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h6 className="text-xl font-semibold">Our Values</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    Integrity, Excellence, Innovation, Customer Focus, and Community Responsibility guide our decisions
                    and actions every day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="pt-20 pb-48 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center mb-24">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-semibold">Our Leadership Team</h2>
              <p className="text-lg leading-relaxed m-4 text-gray-600">
                Meet the experienced professionals guiding AMEN Bank toward continued success.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full md:w-3/12 lg:mb-0 mb-12 px-4">
              <div className="px-6">
                <img
                  alt="CEO"
                  src="/placeholder.svg?height=300&width=300"
                  className="shadow-lg rounded-full max-w-full mx-auto"
                  style={{ maxWidth: "120px" }}
                />
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">Ahmed Ben Ali</h5>
                  <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">Chief Executive Officer</p>
                  <div className="mt-6">
                    <button
                      className="bg-blue-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                    >
                      <i className="fab fa-linkedin"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-3/12 lg:mb-0 mb-12 px-4">
              <div className="px-6">
                <img
                  alt="CFO"
                  src="/placeholder.svg?height=300&width=300"
                  className="shadow-lg rounded-full max-w-full mx-auto"
                  style={{ maxWidth: "120px" }}
                />
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">Leila Trabelsi</h5>
                  <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">Chief Financial Officer</p>
                  <div className="mt-6">
                    <button
                      className="bg-blue-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                    >
                      <i className="fab fa-linkedin"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-3/12 lg:mb-0 mb-12 px-4">
              <div className="px-6">
                <img
                  alt="CTO"
                  src="/placeholder.svg?height=300&width=300"
                  className="shadow-lg rounded-full max-w-full mx-auto"
                  style={{ maxWidth: "120px" }}
                />
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">Mohamed Khelifi</h5>
                  <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">Chief Technology Officer</p>
                  <div className="mt-6">
                    <button
                      className="bg-blue-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                    >
                      <i className="fab fa-linkedin"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-3/12 lg:mb-0 mb-12 px-4">
              <div className="px-6">
                <img
                  alt="COO"
                  src="/placeholder.svg?height=300&width=300"
                  className="shadow-lg rounded-full max-w-full mx-auto"
                  style={{ maxWidth: "120px" }}
                />
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">Sophia Mansour</h5>
                  <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">Chief Operations Officer</p>
                  <div className="mt-6">
                    <button
                      className="bg-blue-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                    >
                      <i className="fab fa-linkedin"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="relative py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="items-center flex flex-wrap">
            <div className="w-full md:w-6/12 ml-auto mr-auto px-4">
              <div className="md:pr-12">
                <div className="text-blue-700 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-blue-100">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-semibold">Achievements & Recognition</h3>
                <p className="mt-4 text-lg leading-relaxed text-gray-600">
                  Over the years, AMEN Bank has been recognized for its excellence in banking services, innovation, and
                  corporate responsibility.
                </p>
                <ul className="list-none mt-6">
                  <li className="py-2">
                    <div className="flex items-center">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-700 bg-blue-100 mr-3">
                          <i className="fas fa-trophy"></i>
                        </span>
                      </div>
                      <div>
                        <h4 className="text-gray-800">Best Digital Banking Experience - 2023</h4>
                      </div>
                    </div>
                  </li>
                  <li className="py-2">
                    <div className="flex items-center">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-700 bg-blue-100 mr-3">
                          <i className="fas fa-trophy"></i>
                        </span>
                      </div>
                      <div>
                        <h4 className="text-gray-800">Most Innovative Bank in North Africa - 2022</h4>
                      </div>
                    </div>
                  </li>
                  <li className="py-2">
                    <div className="flex items-center">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-700 bg-blue-100 mr-3">
                          <i className="fas fa-trophy"></i>
                        </span>
                      </div>
                      <div>
                        <h4 className="text-gray-800">Excellence in Customer Service - 2021</h4>
                      </div>
                    </div>
                  </li>
                  <li className="py-2">
                    <div className="flex items-center">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-700 bg-blue-100 mr-3">
                          <i className="fas fa-trophy"></i>
                        </span>
                      </div>
                      <div>
                        <h4 className="text-gray-800">Best Corporate Social Responsibility Program - 2020</h4>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full md:w-4/12 ml-auto mr-auto px-4">
              <div className="md:pr-12">
                <img
                  alt="Awards"
                  className="max-w-full rounded-lg shadow-lg"
                  src="/placeholder.svg?height=400&width=300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Social Responsibility Section */}
      <section className="pb-20 relative block bg-gray-900">
        <div
          className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
          style={{ height: "80px" }}
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
            <polygon className="text-gray-900 fill-current" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>

        <div className="container mx-auto px-4 lg:pt-24 lg:pb-24">
          <div className="flex flex-wrap text-center justify-center">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-semibold text-white">Corporate Social Responsibility</h2>
              <p className="text-lg leading-relaxed mt-4 mb-4 text-gray-400">
                At AMEN Bank, we believe in giving back to the communities we serve and making a positive impact on
                society.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap mt-12 justify-center">
            <div className="w-full lg:w-3/12 px-4 text-center">
              <div className="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h6 className="text-xl mt-5 font-semibold text-white">Community Development</h6>
              <p className="mt-2 mb-4 text-gray-400">
                Supporting local initiatives that improve education, healthcare, and economic opportunities in
                underserved communities.
              </p>
            </div>
            <div className="w-full lg:w-3/12 px-4 text-center">
              <div className="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h5 className="text-xl mt-5 font-semibold text-white">Environmental Sustainability</h5>
              <p className="mt-2 mb-4 text-gray-400">
                Implementing eco-friendly practices in our operations and financing projects that promote environmental
                conservation.
              </p>
            </div>
            <div className="w-full lg:w-3/12 px-4 text-center">
              <div className="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h5 className="text-xl mt-5 font-semibold text-white">Financial Education</h5>
              <p className="mt-2 mb-4 text-gray-400">
                Providing resources and programs to improve financial literacy and empower individuals to make informed
                financial decisions.
              </p>
            </div>
            <div className="w-full lg:w-3/12 px-4 text-center">
              <div className="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h5 className="text-xl mt-5 font-semibold text-white">Ethical Business Practices</h5>
              <p className="mt-2 mb-4 text-gray-400">
                Maintaining the highest standards of integrity, transparency, and accountability in all our business
                operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative block py-24 lg:pt-0 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
            <div className="w-full lg:w-6/12 px-4">
              <div className="bg-white text-center rounded-lg p-8 shadow-lg">
                <h4 className="text-2xl font-semibold">Join Our Team</h4>
                <p className="mt-4 text-gray-600">
                  Interested in a career at AMEN Bank? We're always looking for talented individuals to join our team.
                </p>
                <div className="mt-6">
                  <Link
                    to="/careers"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 transition-colors"
                  >
                    View Open Positions
                    <ChevronRight className="ml-2 h-5 w-5" />
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

export default AboutPage
