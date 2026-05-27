const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
  host: env.emailHost,
  port: env.emailPort,
  secure: false,
  auth: {
    user: env.emailUser,
    pass: env.emailPass,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"ImpactX" <${env.emailUser}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email send failed:', error.message);
    return false;
  }
};

const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to ImpactX!',
    html: `<h1>Welcome ${user.name}!</h1><p>Thank you for joining ImpactX. Start making a difference today.</p>`,
  });
};

const sendDonationReceipt = async (user, donation, campaign) => {
  return sendEmail({
    to: user.email,
    subject: `Donation Receipt - ${campaign.title}`,
    html: `<h1>Thank you for your donation!</h1><p>Amount: $${donation.amount}</p><p>Campaign: ${campaign.title}</p>`,
  });
};

module.exports = { sendEmail, sendWelcomeEmail, sendDonationReceipt };
