import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiHeart, FiMapPin, FiCalendar } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { campaignAPI } from '../../services/api';
import { formatCurrency, formatDateShort, getStatusColor } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const CampaignList = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const params = {};
        if (search) params.search = search;
        if (filter !== 'all') params.status = filter;
        const { data } = await campaignAPI.getAll(params);
        setCampaigns(data.campaigns);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [search, filter]);

  if (loading) return <Loader className="min-h-[60vh]" size="lg" />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Campaigns</h1>
          <p className="text-gray-400 mt-1">Discover and support impact campaigns.</p>
        </div>
        {user?.role === 'ngo_admin' && (
          <Link
            to="/campaigns/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/25"
          >
            <FiPlus size={18} /> New Campaign
          </Link>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search campaigns..."
            icon={FiSearch}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'completed', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === status
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-20">
          <FiHeart className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">No Campaigns Found</h3>
          <p className="text-gray-400">Be the first to create a campaign!</p>
          {user?.role === 'ngo_admin' && (
            <Link to="/campaigns/new" className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl">
              Create Campaign
            </Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp, i) => {
            const progress = camp.targetAmount > 0 ? Math.min((camp.raisedAmount / camp.targetAmount) * 100, 100) : 0;
            return (
              <motion.div
                key={camp._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/campaigns/${camp._id}`}>
                  <Card hover glow className="h-full">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={camp.status === 'active' ? 'success' : camp.status === 'completed' ? 'info' : 'warning'}>
                        {camp.status}
                      </Badge>
                      <Badge variant="primary">{camp.category}</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{camp.title}</h3>
                    {camp.shortDescription && (
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{camp.shortDescription}</p>
                    )}
                    <div className="space-y-3 mt-auto">
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white font-semibold">{formatCurrency(camp.raisedAmount)}</span>
                        <span className="text-gray-400">of {formatCurrency(camp.targetAmount)}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-white/5">
                        {camp.location && (
                          <span className="flex items-center gap-1"><FiMapPin size={12} />{camp.location}</span>
                        )}
                        <span className="flex items-center gap-1"><FiCalendar size={12} />{formatDateShort(camp.endDate)}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default CampaignList;
