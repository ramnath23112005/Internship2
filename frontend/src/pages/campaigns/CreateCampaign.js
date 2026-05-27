import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiZap } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { campaignAPI, aiAPI } from '../../services/api';
import { useToast } from '../../components/ui/Toast';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'education',
    targetAmount: '',
    volunteersNeeded: '',
    startDate: '',
    endDate: '',
    location: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateDescription = async () => {
    if (!form.title) {
      addToast('Enter a title first', 'error');
      return;
    }
    setGenerating(true);
    try {
      const { data } = await aiAPI.generateDescription({
        title: form.title,
        category: form.category,
      });
      if (data.description) {
        setForm({ ...form, description: data.description });
        addToast('AI description generated!');
      }
    } catch {
      addToast('AI generation failed, please write manually', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await campaignAPI.create({
        ...form,
        targetAmount: parseFloat(form.targetAmount),
        volunteersNeeded: parseInt(form.volunteersNeeded) || 0,
      });
      addToast('Campaign created successfully!');
      navigate(`/campaigns/${data.campaign._id}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create campaign', 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['education', 'health', 'environment', 'poverty', 'disaster', 'animal', 'community', 'other'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-8">
      <button onClick={() => navigate('/campaigns')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <FiArrowLeft size={18} /> Back to Campaigns
      </button>

      <div>
        <h1 className="text-3xl font-bold text-white">Create Campaign</h1>
        <p className="text-gray-400 mt-1">Launch a new impact campaign with AI assistance.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="Campaign Title" name="title" placeholder="Enter campaign title" value={form.title} onChange={handleChange} required />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <button type="button" onClick={generateDescription} disabled={generating} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                  <FiZap size={12} /> {generating ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              <textarea
                name="description"
                placeholder="Describe your campaign..."
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <Input label="Short Description" name="shortDescription" placeholder="Brief summary (max 200 chars)" value={form.shortDescription} onChange={handleChange} maxLength={200} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all">
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-dark-800">{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            <Input label="Location" name="location" placeholder="City, Country" value={form.location} onChange={handleChange} />

            <Input label="Target Amount ($)" name="targetAmount" type="number" placeholder="10000" value={form.targetAmount} onChange={handleChange} required min="0" />
            <Input label="Volunteers Needed" name="volunteersNeeded" type="number" placeholder="50" value={form.volunteersNeeded} onChange={handleChange} min="0" />

            <Input label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
            <Input label="End Date" name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => navigate('/campaigns')}>Cancel</Button>
            <Button type="submit" loading={loading}>Create Campaign</Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default CreateCampaign;
