const OpenAI = require('openai');
const env = require('../config/env');

let openai = null;
if (env.aiApiKey) {
  openai = new OpenAI({ apiKey: env.aiApiKey });
}

const generateCampaignTips = async (campaign) => {
  if (!openai) {
    return getFallbackTips(campaign);
  }

  try {
    const prompt = `As an AI campaign assistant, provide 3 actionable tips to improve this NGO campaign:
Title: ${campaign.title}
Description: ${campaign.description}
Category: ${campaign.category}
Target: $${campaign.targetAmount}
Raised so far: $${campaign.raisedAmount || 0}

Format response as JSON array of objects with "tip" and "impact" fields.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const cleaned = content.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    }
    return getFallbackTips(campaign);
  } catch (error) {
    console.error('AI generation failed:', error.message);
    return getFallbackTips(campaign);
  }
};

const generateCampaignDescription = async (title, category, keywords) => {
  if (!openai) {
    return `Join our ${category} campaign "${title}" and make a difference. Your support helps us achieve our mission.`;
  }

  try {
    const prompt = `Write a compelling campaign description for an NGO campaign.
Title: ${title}
Category: ${category}
Keywords: ${keywords || 'community, impact, change'}

Keep it under 150 words, inspiring, and professional.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 300,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('AI description generation failed:', error.message);
    return '';
  }
};

const getFallbackTips = (campaign) => {
  const tips = [
    { tip: 'Share your campaign on social media platforms to reach a wider audience', impact: 'High' },
    { tip: 'Send personalized emails to your network explaining why this cause matters', impact: 'Medium' },
    { tip: 'Update your campaign page with fresh photos and progress reports weekly', impact: 'Medium' },
  ];
  return tips;
};

module.exports = { generateCampaignTips, generateCampaignDescription };
