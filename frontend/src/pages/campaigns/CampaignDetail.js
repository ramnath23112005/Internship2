import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiZap, FiShare2 } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { campaignAPI, donationAPI } from '../../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [campaign, setCampaign] = useState(null);
  const [aiTips, setAiTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donateModal, setDonateModal] = useState(false);
  const [donateAmount, setDonateAmount] = useState('');
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const { data } = await campaignAPI.getOne(id);
        setCampaign(data.campaign);
        setAiTips(data.aiTips || []);
      } catch (err) {
        addToast('Campaign not found', 'error');
        navigate('/campaigns');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const handleJoin = async () => {
    try {
      await campaignAPI.join(id);
      addToast('Successfully joined the campaign!');
      const { data } = await campaignAPI.getOne(id);
      setCampaign(data.campaign);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to join', 'error');
    }
  };

  const handleDonate = async () => {
    if (!donateAmount || donateAmount <= 0) return;
    setDonating(true);
    try {
      await donationAPI.create({ campaignId: id, amount: parseFloat(donateAmount) });
      addToast(`Thank you for donating $${donateAmount}!`);
      setDonateModal(false);
      setDonateAmount('');
      const { data } = await campaignAPI.getOne(id);
      setCampaign(data.campaign);
    } catch (err) {
      addToast('Donation failed', 'error');
    } finally {
      setDonating(false);
    }
  };

  if (loading) return <Loader className="min-h-[60vh]" size="lg" />;
  if (!campaign) return null;

  const progress = campaign.targetAmount > 0 ? Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100) : 0;
  const hasJoined = campaign.volunteers?.some((v) => v.user?._id === user?._id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
      <button onClick={() => navigate('/campaigns')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <FiArrowLeft size={18} /> Back to Campaigns
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start gap-3 mb-4">
              <Badge variant={campaign.status === 'active' ? 'success' : 'info'}>{campaign.status}</Badge>
              <Badge variant="primary">{campaign.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{campaign.title}</h1>
            <p className="text-gray-300 leading-relaxed">{campaign.description}</p>

            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-white/5">
              {campaign.location && (
                <span className="flex items-center gap-2 text-sm text-gray-400"><FiMapPin /> {campaign.location}</span>
              )}
              <span className="flex items-center gap-2 text-sm text-gray-400"><FiCalendar /> {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
              <span className="flex items-center gap-2 text-sm text-gray-400"><FiUsers /> {campaign.volunteersJoined} / {campaign.volunteersNeeded || '∞'} volunteers</span>
            </div>
          </Card>

          {aiTips.length > 0 && (
            <Card glow>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FiZap className="text-yellow-400" /> AI-Powered Tips
              </h3>
              <div className="space-y-3">
                {aiTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400 text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm text-gray-200">{tip.tip}</p>
                      <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                        tip.impact === 'High' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {tip.impact} Impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {campaign.volunteers?.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Volunteers ({campaign.volunteers.length})</h3>
              <div className="space-y-2">
                {campaign.volunteers.map((v) => (
                  <div key={v.user?._id} className="flex items-center gap-3 p-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {v.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300">{v.user?.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card glow>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-white">{formatCurrency(campaign.raisedAmount)}</p>
              <p className="text-sm text-gray-400">raised of {formatCurrency(campaign.targetAmount)}</p>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm text-gray-400 text-center mb-6">{Math.round(progress)}% funded</p>

            <div className="space-y-3">
              {user && (
                <>
                  <Button className="w-full" onClick={() => setDonateModal(true)}>
                    <FiDollarSign className="mr-1" /> Donate Now
                  </Button>
                  {user.role === 'volunteer' && (
                    <Button variant="secondary" className="w-full" onClick={handleJoin} disabled={hasJoined}>
                      <FiUsers className="mr-1" /> {hasJoined ? 'Joined' : 'Join as Volunteer'}
                    </Button>
                  )}
                </>
              )}
              <Button variant="ghost" className="w-full">
                <FiShare2 className="mr-1" /> Share
              </Button>
            </div>
          </Card>

          {campaign.createdBy && (
            <Card>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Organized by</h4>
              <p className="text-white font-medium">{campaign.createdBy?.name}</p>
              {campaign.createdBy?.organization && (
                <p className="text-sm text-gray-400">{campaign.createdBy.organization}</p>
              )}
            </Card>
          )}
        </div>
      </div>

      <Modal isOpen={donateModal} onClose={() => setDonateModal(false)} title="Make a Donation">
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            {[10, 25, 50, 100, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => setDonateAmount(amount.toString())}
                className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                  donateAmount === amount.toString()
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
          <Input label="Custom Amount" type="number" placeholder="Enter amount" value={donateAmount} onChange={(e) => setDonateAmount(e.target.value)} min="1" />
          <Button className="w-full" loading={donating} onClick={handleDonate}>Donate {donateAmount ? `$${donateAmount}` : ''}</Button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default CampaignDetail;
