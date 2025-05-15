"use client"

import React from "react"
import { Target, Heart, Clock, Globe, MapPin, Phone, Mail, Menu, X } from "lucide-react"

const AboutPage: React.FC = () => {
  const [currentUser, setCurrentUser] = React.useState<any>(null)
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
                <a href="/">
                  <img src="/images/amen-bank-logo.png" alt="AMEN BANK" className="h-10 w-auto" />
                </a>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-green-700" : "text-gray-700 hover:text-green-700"
                } transition-colors`}
              >
                Home
              </a>
              <a
                href="/about"
                className={`font-medium ${
                  scrolled ? "text-green-700 hover:text-green-900" : "text-green-700 hover:text-green-900"
                } transition-colors`}
              >
                About
              </a>
              <a
                href="/services"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-green-700" : "text-gray-700 hover:text-green-700"
                } transition-colors`}
              >
                Services
              </a>
              <a
                href="/contact"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-green-700" : "text-gray-700 hover:text-green-700"
                } transition-colors`}
              >
                Contact
              </a>

              {!currentUser ? (
                <div className="flex items-center space-x-4">
                  <a
                    href="/login"
                    className={`font-medium ${
                      scrolled ? "text-green-700 hover:text-green-800" : "text-green-700 hover:text-green-800"
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
                  href={currentUser.role === "admin" ? "/admin" : "/dashboard"}
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
              <a
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-green-700 hover:text-green-900 hover:bg-green-50"
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
                    href={currentUser.role === "admin" ? "/admin" : "/dashboard"}
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
      <div className="relative pt-16 pb-32 flex content-center items-center justify-center">
        <div
          className="absolute top-0 w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: "url('https://via.placeholder.com/1200x600')",
          }}
        >
          <span className="w-full h-full absolute opacity-75 bg-gradient-to-r from-green-900 to-green-700"></span>
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
              <div className="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-green-100">
                <Clock className="w-8 h-8 text-green-700" />
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
                  src="https://via.placeholder.com/600x400"
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
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-700">
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
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-700">
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
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-700">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h6 className="text-xl font-semibold">Our Values</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    Integrity, collaboration, accountability, and a relentless focus on customer satisfaction. These
                    values guide our decisions and actions every day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 pt-8 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap">
            <div className="w-full md:w-4/12 px-4">
              <h4 className="text-3xl font-semibold">AMEN Bank</h4>
              <div className="mt-6">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2 p-2"
                >
                  <i className="fab fa-facebook-square"></i>
                </a>
                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2 p-2"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-pink-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2 p-2"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            <div className="w-full md:w-4/12 px-4">
              <h5 className="font-semibold text-xl mb-2">Useful Links</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="/" className="text-gray-700 hover:text-green-700 font-medium block pb-2 text-sm">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-700 hover:text-green-700 font-medium block pb-2 text-sm">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/services" className="text-gray-700 hover:text-green-700 font-medium block pb-2 text-sm">
                    Services
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-700 hover:text-green-700 font-medium block pb-2 text-sm">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-4/12 px-4">
              <h5 className="font-semibold text-xl mb-2">Contact Info</h5>
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-gray-700 mr-2" />
                <span className="text-gray-700 text-sm">123 Main Street, Tunis, Tunisia</span>
              </div>
              <div className="flex items-center mb-2">
                <Phone className="h-5 w-5 text-gray-700 mr-2" />
                <span className="text-gray-700 text-sm">+216 12 345 678</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-700 mr-2" />
                <span className="text-gray-700 text-sm">info@amenbank.tn</span>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-300" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4 mx-auto text-center">
              <div className="text-sm text-gray-600 font-semibold py-1">
                Copyright © {new Date().getFullYear()} AMEN Bank. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AboutPage
