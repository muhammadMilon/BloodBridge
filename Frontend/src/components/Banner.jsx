import { Link } from "react-router";
import animation from "../assets/blood donner.json";
import Lottie from "lottie-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosPublic from "../hooks/axiosPublic";

const Banner = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [activeDonors, setActiveDonors] = useState(0);

  useEffect(() => {
    axiosPublic
      .get("/get-donors")
      .then((res) => {
        const active = res.data.filter(
          (donor) => donor.role === "donor" && donor.status === "active"
        ).length;
        setActiveDonors(active);
      })
      .catch((err) => console.error("Error fetching donors:", err));
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-red-50"></div>

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-rose-400 to-red-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-r from-red-400 to-rose-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-300 to-rose-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-block">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-rose-100 to-red-100 rounded-full text-xs sm:text-sm font-semibold text-highlighted backdrop-blur-sm border border-rose-200">
                🩸 Save Lives Today
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Be Someone's
              </span>
              <br />
              <span className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 bg-clip-text text-transparent">
                Hope & Hero
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Join our community of lifesavers. Your single donation can save up
              to three lives. Every drop makes a difference.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-4">
              <Link
                to="/search"
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Find a Donor
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              {!user && (
                <Link
                  to="/registration"
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-rose-600 text-rose-600 font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl hover:bg-rose-50 transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Register as Donor
                  </span>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left p-3 sm:p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-rose-100">
                <div className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                  {activeDonors}+
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium mt-1">
                  Active Donors
                </div>
              </div>
              <div className="text-center lg:text-left p-3 sm:p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-rose-100">
                <div className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                  5000+
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium mt-1">
                  Lives Saved
                </div>
              </div>
              <div className="text-center lg:text-left p-3 sm:p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-rose-100">
                <div className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium mt-1">
                  Support
                </div>
              </div>
            </div>
          </div>

          {/* Right animation */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[300px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[550px]">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-red-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <Lottie
                animationData={animation}
                loop={true}
                className="relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
