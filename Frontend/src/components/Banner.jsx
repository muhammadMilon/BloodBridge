import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosPublic from "../hooks/axiosPublic";
import { AuthContext } from "../providers/AuthProvider";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

  const pages = [
    {
      title1: "Be Someone’s",
      title2: "Hope & Hero",
      text: "Donate blood and save lives today.",
      link: "/search",
      btn: "Find a Donor",
    },
    {
      title1: "Know the",
      title2: "Donation Process",
      text: "Learn step-by-step how blood donation works.",
      link: "/donation-process",
      btn: "Learn More",
    },
    {
      title1: "Discover",
      title2: "Blood Groups",
      text: "Find compatibility rules for safe transfusion.",
      link: "/blood-groups",
      btn: "Explore Groups",
    },
    {
      title1: "Become a",
      title2: "Life Saver",
      text: "Join our donor community today!",
      link: "/donor-registration",
      btn: "Register Now",
    },
  ];

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-red-50" />

      {/* Animated blobs */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-rose-400 to-red-400 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop={true}
        className="w-full"
      >
        {pages.map((page, i) => (
          <SwiperSlide key={i}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left text */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6 sm:space-y-8 text-center lg:text-left"
                >
                  <h1 className="text-4xl md:text-5xl font-black">
                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {page.title1}
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 bg-clip-text text-transparent">
                      {page.title2}
                    </span>
                  </h1>

                  <p className="text-lg text-gray-600">
                    {page.text}
                  </p>

                  <Link
                    to={page.link}
                    className="px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold rounded-xl shadow-lg"
                  >
                    {page.btn}
                  </Link>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-8 max-w-lg mx-auto lg:mx-0">
                    <div className="text-center p-3 bg-white/50 rounded-xl border">
                      <div className="text-3xl font-black text-rose-600">
                        {activeDonors}+
                      </div>
                      <div className="text-sm text-gray-600">
                        Active Donors
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white/50 rounded-xl border">
                      <div className="text-3xl font-black text-rose-600">
                        5000+
                      </div>
                      <div className="text-sm text-gray-600">
                        Lives Saved
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white/50 rounded-xl border">
                      <div className="text-3xl font-black text-rose-600">
                        24/7
                      </div>
                      <div className="text-sm text-gray-600">
                        Support
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right animation */}
                <div className="flex justify-center lg:justify-end">
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className="text-[150px]">🩸</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Banner;
