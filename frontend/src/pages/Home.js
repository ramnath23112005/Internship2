import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart, FiUsers, FiDollarSign, FiBarChart2, FiShield, FiZap, FiGlobe } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-dark-900 to-blue-900/30" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-[128px]" />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300 mb-6">
                <FiZap size={14} />
                AI-Powered Social Impact Platform
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
            >
              Empowering{' '}
              <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
                Change
              </span>
              {' '}Through Technology
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl"
            >
              ImpactX connects passionate volunteers with impactful NGOs. Manage campaigns, track donations, and measure your social impact with AI-powered insights.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                Get Started Free <FiArrowRight />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-8 mt-12"
            >
              {[
                { number: '500+', label: 'NGOs' },
                { number: '10K+', label: 'Volunteers' },
                { number: '$2M+', label: 'Raised' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.number}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Active Campaigns', value: '42', color: 'from-purple-500 to-blue-500' },
                    { label: 'Volunteers', value: '156', color: 'from-emerald-500 to-teal-500' },
                    { label: 'Donations', value: '$84K', color: 'from-amber-500 to-orange-500' },
                    { label: 'Impact Score', value: '94%', color: 'from-pink-500 to-rose-500' },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <p className="text-sm text-gray-400">{item.label}</p>
                      <p className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
                </div>
                <p className="text-xs text-gray-400 mt-2">Global Impact Progress</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -8 }}
    className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-4">
        <Icon className="text-purple-400" size={24} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const FeaturesSection = () => (
  <div className="relative py-24">
    <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-purple-900/10 to-dark-900" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div {...fadeInUp} className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Everything You Need to{' '}
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Make an Impact
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Powerful tools designed for NGOs and volunteers to collaborate, track impact, and drive change.
        </p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard icon={FiHeart} title="Campaign Management" description="Create and manage social impact campaigns with AI-powered suggestions and real-time progress tracking." delay={0.1} />
        <FeatureCard icon={FiUsers} title="Volunteer Network" description="Connect passionate volunteers with meaningful causes. Track hours, skills, and contributions." delay={0.2} />
        <FeatureCard icon={FiDollarSign} title="Donation Tracking" description="Transparent donation management with real-time tracking, receipts, and impact reporting." delay={0.3} />
        <FeatureCard icon={FiBarChart2} title="Analytics Dashboard" description="Comprehensive analytics with beautiful charts showing campaign performance and impact metrics." delay={0.4} />
        <FeatureCard icon={FiShield} title="Certificate System" description="Automatically generate verified certificates for volunteers and donors to showcase their impact." delay={0.5} />
        <FeatureCard icon={FiGlobe} title="AI Assistant" description="Smart campaign recommendations, description generation, and optimization tips powered by AI." delay={0.6} />
      </div>
    </div>
  </div>
);

const HowItWorks = () => (
  <div className="relative py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div {...fadeInUp} className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Three simple steps to start making a difference.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { step: '01', title: 'Create Account', desc: 'Sign up as a volunteer or NGO. Set up your profile and start exploring.' },
          { step: '02', title: 'Join or Create Campaigns', desc: 'Browse campaigns that match your interests or create your own cause.' },
          { step: '03', title: 'Track Your Impact', desc: 'Monitor progress, earn certificates, and see the difference you make.' },
        ].map((item, i) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">{item.step}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const CTA = () => (
  <div className="relative py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative bg-gradient-to-br from-purple-600/20 via-dark-800 to-blue-600/20 border border-white/10 rounded-3xl p-12 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
        <div className="relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Join thousands of volunteers and NGOs already using ImpactX to drive positive change.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-xl shadow-purple-500/25"
          >
            Start Your Journey <FiArrowRight />
          </Link>
        </div>
      </motion.div>
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="bg-dark-900 min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
