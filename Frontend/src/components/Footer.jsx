import { Link } from "react-router";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiHeart,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Search Donors", path: "/search" },
    { name: "Blood Requests", path: "/request" },
    { name: "Blog", path: "/blog" },
  ];

  const resources = [
    { name: "Blood Helper", path: "/blood-helper" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "About Donation", path: "/blood-helper" },
    { name: "Contact Us", path: "/" },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-red-50 border-t-4 border-rose-200">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-rose-300 to-red-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-r from-red-300 to-rose-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-black bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent tracking-tight">
                BloodBridge
              </span>
              <span className="text-3xl">🩸</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Connecting donors with those in need. Every drop counts, every
              donor matters. Join us in saving lives.
            </p>
            <div className="flex items-center gap-2">
              <FiHeart className="text-rose-600 w-5 h-5" />
              <span className="text-sm font-semibold text-gray-700">
                Making a difference, one donation at a time
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-rose-600 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-rose-600 rounded-full group-hover:scale-150 transition-transform"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-rose-600 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-rose-600 rounded-full group-hover:scale-150 transition-transform"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-600 text-sm">
                <FiMapPin className="text-rose-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 text-sm">
                <FiPhone className="text-rose-600 w-5 h-5 flex-shrink-0" />
                <span className="break-all">+8801731681426</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 text-sm">
                <FiMail className="text-rose-600 w-5 h-5 flex-shrink-0" />
                <span className="break-all">munsy.foysal613@gmail.com</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Follow Us
              </h4>
              <div className="flex gap-3">
                {[
                  { icon: <FiFacebook />, link: "#" },
                  { icon: <FiTwitter />, link: "#" },
                  { icon: <FiInstagram />, link: "#" },
                  { icon: <FiLinkedin />, link: "#" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    className="w-9 h-9 rounded-full bg-gradient-to-r from-rose-600 to-red-600 flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="glass border-2 border-rose-200 rounded-2xl p-6 sm:p-8 mb-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-3">
              Stay Updated
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Subscribe to our newsletter for blood donation tips and urgent
              requests
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-rose-200 focus:border-rose-400 focus:outline-none bg-white text-gray-800 text-sm"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-2 border-rose-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm text-center sm:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="font-bold text-rose-600">BloodBridge</span>. All
              rights reserved. Made with{" "}
              <FiHeart className="inline text-rose-600 animate-pulse" /> for
              humanity.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="/"
                className="text-gray-600 hover:text-rose-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/"
                className="text-gray-600 hover:text-rose-600 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
