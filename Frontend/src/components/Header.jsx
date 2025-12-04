import { useContext, useState } from "react";
import { CgMenuMotion } from "react-icons/cg";
import { RiMenuAddLine } from "react-icons/ri";
import { FiChevronDown } from "react-icons/fi";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../providers/AuthProvider";

const Header = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menu = [
    { name: "Home", path: "/" },
    { name: "Search", path: "/search" },
    { name: "Request", path: "/request" },
    { name: "Blog", path: "/blog" },
    { name: "Help Center", path: "/help-center" },
  ];

  const handleNavLinkClick = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-nav shadow-nav border-b border-border">
      {/* Main Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent tracking-tight group-hover:scale-105 transform transition-transform duration-200">
              BloodBridge
            </span>
            <span className="text-2xl group-hover:rotate-180 transform transition-transform duration-200">
              🩸
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium text-sm xl:text-base transition-all duration-200 ${
                    isActive
                      ? "bg-rose-100 text-highlighted shadow-sm"
                      : "text-text hover:text-highlighted hover:bg-rose-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {user && user.email ? (
              <div className="relative">
                <div className="flex items-center space-x-3">
                  {user.photoURL && (
                    <button
                      onClick={() => setIsMenuOpen((prev) => !prev)}
                      className="relative focus:outline-none"
                      aria-haspopup="menu"
                      aria-expanded={isMenuOpen}
                    >
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-border shadow-sm hover:border-rose-500 transition-colors duration-200"
                        title={user.displayName}
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cardBg border border-border shadow-sm flex items-center justify-center pointer-events-none">
                        <FiChevronDown
                          className={`w-3 h-3 text-gray-600 transition-transform duration-200 ${
                            isMenuOpen ? "rotate-180" : "rotate-0"
                          }`}
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                  )}
                </div>

                {isMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-cardBg border border-border rounded-lg shadow-lg py-1 z-50"
                    role="menu"
                  >
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm ${
                          isActive
                            ? "text-highlighted bg-rose-50"
                            : "text-text hover:text-highlighted hover:bg-rose-50"
                        }`
                      }
                      role="menuitem"
                    >
                      Dashboard
                    </NavLink>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-highlighted hover:text-highlighted hover:bg-red-50"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-text hover:text-highlighted hover:bg-rose-50 rounded-lg transition-all duration-200"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/registration"
                  className="px-4 py-2 text-sm font-medium bg-cta text-btn-text rounded-lg hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            {user && user.photoURL && (
              <div className="relative">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-border shadow-sm"
                  title={user.displayName}
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-red-700 hover:bg-rose-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <CgMenuMotion className="w-6 h-6" />
              ) : (
                <RiMenuAddLine className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 border-t border-border">
            <div className="space-y-1">
              {menu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-rose-100 text-highlighted border-l-4 border-red-500"
                        : "text-text hover:text-highlighted hover:bg-rose-50"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              {/* Mobile Auth Actions */}
              <div className="pt-4 mt-4 border-t border-border space-y-2">
                {user && user.email ? (
                  <>
                    <NavLink
                      to="/dashboard"
                      onClick={handleNavLinkClick}
                      className="block px-4 py-3 text-base font-medium text-text hover:text-highlighted hover:bg-rose-50 rounded-lg transition-all duration-200"
                    >
                      Dashboard
                    </NavLink>
                    <button
                      onClick={() => {
                        logOut();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-base font-medium text-highlighted hover:text-highlighted hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <NavLink
                      to="/login"
                      onClick={handleNavLinkClick}
                      className="block px-4 py-3 text-base font-medium text-text hover:text-highlighted hover:bg-rose-50 rounded-lg transition-all duration-200"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/registration"
                      onClick={handleNavLinkClick}
                      className="block px-4 py-3 text-base font-medium bg-cta text-btn-text rounded-lg text-center transition-all duration-200"
                    >
                      Register
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
