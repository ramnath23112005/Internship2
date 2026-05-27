import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-dark-800/50 backdrop-blur-xl border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IX</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">ImpactX</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md">
              AI-powered platform connecting volunteers with NGOs. Making social impact accessible, trackable, and rewarding.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <div className="space-y-2">
              {['Campaigns', 'Donate', 'Volunteer', 'Analytics'].map((item) => (
                <Link key={item} to={`/${item.toLowerCase()}`} className="block text-sm text-gray-400 hover:text-white transition-colors">{item}</Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              {[FiGithub, FiTwitter, FiLinkedin, FiMail].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-gray-500"> 2026 ImpactX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
