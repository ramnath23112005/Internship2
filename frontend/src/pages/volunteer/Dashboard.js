import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiDollarSign, FiUsers, FiTarget, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { analyticsAPI, campaignAPI, donationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDateShort, getStatusColor } from '../../utils/helpers';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, campRes, donRes] = await Promise.all([
          analyticsAPI.getVolunteer(),
          campaignAPI.getAll({ limit: 3 }),
          donationAPI.getAll({ limit: 5 }),
        ]);
        setStats(statsRes.data.stats);
        setCampaigns(campRes.data.campaigns);
        setDonations(donRes.data.donations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader className="min-h-[60vh]" size="lg" />;

  const statCards = [
    { label: 'Campaigns Joined', value: stats?.joinedCampaigns || 0, icon: FiHeart, color: 'from-purple-500 to-blue-500' },
    { label: 'Total Donated', value: formatCurrency(stats?.totalDonated || 0), icon: FiDollarSign, color: 'from-emerald-500 to-teal-500' },
    { label: 'Donations Made', value: stats?.donationCount || 0, icon: FiTarget, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-gray-400 mt-1">Here&apos;s your volunteer impact summary.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card glow>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">{card.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className="text-white" size={20} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Active Campaigns</h2>
            <Link to="/campaigns" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          {campaigns.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No campaigns yet. Browse campaigns to join!</p>
          ) : (
            <div className="space-y-3">
              {campaigns.map((camp) => (
                <Link key={camp._id} to={`/campaigns/${camp._id}`}>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{camp.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(camp.status)}`}>{camp.status}</span>
                        <span className="text-xs text-gray-400"><FiCalendar size={12} className="inline mr-1" />{formatDateShort(camp.endDate)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-purple-400">{formatCurrency(camp.raisedAmount)}</p>
                      <p className="text-xs text-gray-400">of {formatCurrency(camp.targetAmount)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Donations</h2>
            <Link to="/donations" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          {donations.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No donations yet. Support a campaign!</p>
          ) : (
            <div className="space-y-3">
              {donations.map((don) => (
                <div key={don._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-white">{formatCurrency(don.amount)}</p>
                    <p className="text-xs text-gray-400">{don.campaign?.title}</p>
                  </div>
                  <span className="text-xs text-gray-500">{formatDateShort(don.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
};

export default VolunteerDashboard;
