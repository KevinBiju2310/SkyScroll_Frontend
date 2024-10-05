import { Plane, Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-sky-400 to-blue-500 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Company Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Plane className="text-sky-600" size={24} />
              </div>
              <span className="font-semibold text-xl">SkyScroll</span>
            </div>
            <p className="text-sm text-center md:text-left">
              Your trusted partner for hassle-free flight bookings.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center md:text-left">
              Quick Links
            </h3>
            <ul className="space-y-2 text-center md:text-left">
              <li>
                <a
                  href="#"
                  className="hover:text-sky-100 transition duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-sky-100 transition duration-300"
                >
                  Flights
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-sky-100 transition duration-300"
                >
                  Deals
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-sky-100 transition duration-300"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center md:text-left">
              Support
            </h3>
            <ul className="space-y-2 text-center md:text-left">
              <li>
                <a
                  href="#"
                  className="hover:text-sky-100 transition duration-300"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-sky-100 transition duration-300"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-sky-100 transition duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-sky-100 transition duration-300"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center md:text-left">
              Contact Us
            </h3>
            <ul className="space-y-2 text-center md:text-left">
              <li className="flex items-center justify-center md:justify-start">
                <Mail size={18} className="mr-2" />
                <a
                  href="mailto:info@skybooker.com"
                  className="hover:text-sky-100 transition duration-300"
                >
                  info@skybooker.com
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Phone size={18} className="mr-2" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-sky-100 transition duration-300"
                >
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4 justify-center md:justify-start">
              <a
                href="#"
                className="hover:text-sky-100 transition duration-300"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="hover:text-sky-100 transition duration-300"
              >
                <Twitter size={24} />
              </a>
              <a
                href="#"
                className="hover:text-sky-100 transition duration-300"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-sky-300 pt-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} SkyBooker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
