import type React from "react"
import { Link } from "react-router-dom"
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">AMEN BANK</h2>
            <p className="text-blue-200 mb-4">
              Your trusted banking partner for secure and innovative financial services.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/amenbank" className="text-blue-200 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/amenbank" className="text-blue-200 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/amenbank" className="text-blue-200 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/amenbank" className="text-blue-200 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-200 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-200 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-blue-200 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-blue-200 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Banking Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/accounts" className="text-blue-200 hover:text-white">
                  Accounts
                </Link>
              </li>
              <li>
                <Link to="/services/loans" className="text-blue-200 hover:text-white">
                  Loans
                </Link>
              </li>
              <li>
                <Link to="/services/investments" className="text-blue-200 hover:text-white">
                  Investments
                </Link>
              </li>
              <li>
                <Link to="/services/insurance" className="text-blue-200 hover:text-white">
                  Insurance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-blue-200" />
                <span className="text-blue-200">Avenue Mohamed V, Tunis, Tunisia</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-200" />
                <span className="text-blue-200">+216 71 123 456</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-200" />
                <span className="text-blue-200">contact@amenbank.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-blue-800 text-center text-blue-200">
          <p>&copy; {new Date().getFullYear()} AMEN BANK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

