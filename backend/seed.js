const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Donation = require('./models/Donation');
const Notification = require('./models/Notification');
const Certificate = require('./models/Certificate');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await Promise.all([
      User.deleteMany({}),
      Campaign.deleteMany({}),
      Donation.deleteMany({}),
      Notification.deleteMany({}),
      Certificate.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    const users = await User.create([
      { name: 'Alice Volunteer', email: 'alice@test.com', password: 'password123', role: 'volunteer' },
      { name: 'Bob NGO Admin', email: 'bob@test.com', password: 'password123', role: 'ngo_admin' },
      { name: 'Charlie Super Admin', email: 'charlie@test.com', password: 'password123', role: 'super_admin' },
    ]);
    console.log('Users created');

    const campaigns = await Campaign.create([
      {
        title: 'Clean Water Initiative',
        description: 'Bring clean drinking water to rural communities by installing filtration systems and digging wells. This project aims to provide sustainable water solutions to over 5,000 families in the region.',
        shortDescription: 'Bring clean drinking water to rural communities.',
        image: 'https://images.unsplash.com/photo-1538300342682-cf57afb97285?w=600',
        targetAmount: 50000,
        raisedAmount: 32500,
        category: 'environment',
        location: 'Rural Kenya',
        volunteersNeeded: 50,
        volunteersJoined: 12,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        status: 'active',
        createdBy: users[1]._id,
        volunteers: [
          { user: users[0]._id, role: 'volunteer', joinedAt: new Date('2026-01-15') },
        ],
      },
      {
        title: 'Education for All',
        description: 'Provide school supplies, scholarships, and teacher training to underprivileged children in rural areas. We aim to support 1,000 students this year.',
        shortDescription: 'Support education for underprivileged children.',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600',
        targetAmount: 75000,
        raisedAmount: 45000,
        category: 'education',
        location: 'India',
        volunteersNeeded: 30,
        volunteersJoined: 8,
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-11-30'),
        status: 'active',
        createdBy: users[1]._id,
        volunteers: [],
      },
      {
        title: 'Food Drive 2026',
        description: 'Distribute nutritious meals to homeless shelters and food banks across the city. Target: 50,000 meals distributed by year end.',
        shortDescription: 'Distribute meals to homeless shelters.',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600',
        targetAmount: 25000,
        raisedAmount: 18000,
        category: 'poverty',
        location: 'New York, USA',
        volunteersNeeded: 100,
        volunteersJoined: 45,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-09-30'),
        status: 'active',
        createdBy: users[2]._id,
        volunteers: [
          { user: users[0]._id, role: 'volunteer', joinedAt: new Date('2026-03-10') },
        ],
      },
      {
        title: 'Tree Plantation Drive',
        description: 'Plant 10,000 trees across deforested areas to restore the ecosystem and fight climate change. Completed areas show 40% wildlife return.',
        shortDescription: 'Plant 10,000 trees to restore ecosystem.',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
        targetAmount: 15000,
        raisedAmount: 15000,
        category: 'environment',
        location: 'Amazon Rainforest',
        volunteersNeeded: 200,
        volunteersJoined: 200,
        startDate: new Date('2026-01-15'),
        endDate: new Date('2026-06-30'),
        status: 'completed',
        createdBy: users[1]._id,
        volunteers: [],
      },
      {
        title: 'Healthcare Outreach',
        description: 'Mobile medical clinics providing free checkups, medicines, and health education to remote villages with no access to hospitals.',
        shortDescription: 'Free medical clinics for remote villages.',
        image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
        targetAmount: 60000,
        raisedAmount: 12000,
        category: 'health',
        location: 'Rural Uganda',
        volunteersNeeded: 40,
        volunteersJoined: 5,
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-12-31'),
        status: 'active',
        createdBy: users[1]._id,
        volunteers: [],
      },
      {
        title: 'Animal Shelter Support',
        description: 'Provide food, medical care, and adoption services for abandoned and stray animals in the city.',
        shortDescription: 'Help abandoned animals find new homes.',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600',
        targetAmount: 20000,
        raisedAmount: 7500,
        category: 'animal',
        location: 'Mumbai, India',
        volunteersNeeded: 25,
        volunteersJoined: 10,
        startDate: new Date('2026-05-01'),
        endDate: new Date('2026-10-31'),
        status: 'active',
        createdBy: users[1]._id,
        volunteers: [],
      },
      {
        title: 'Disaster Relief Fund',
        description: 'Emergency relief supplies including food, water, tents, and medicine for families affected by natural disasters.',
        shortDescription: 'Emergency relief for disaster-affected families.',
        image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600',
        targetAmount: 100000,
        raisedAmount: 67000,
        category: 'disaster',
        location: 'Philippines',
        volunteersNeeded: 150,
        volunteersJoined: 80,
        startDate: new Date('2026-06-01'),
        endDate: new Date('2026-12-31'),
        status: 'active',
        createdBy: users[2]._id,
        volunteers: [],
      },
      {
        title: 'Community Garden Project',
        description: 'Transform vacant lots into community gardens providing fresh produce and green spaces for neighborhoods.',
        shortDescription: 'Create green spaces and grow fresh produce.',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
        targetAmount: 12000,
        raisedAmount: 3000,
        category: 'community',
        location: 'Detroit, USA',
        volunteersNeeded: 60,
        volunteersJoined: 15,
        startDate: new Date('2026-07-01'),
        endDate: new Date('2027-03-31'),
        status: 'draft',
        createdBy: users[1]._id,
        volunteers: [],
      },
    ]);
    console.log('Campaigns created');

    const donations = await Donation.create([
      { campaign: campaigns[0]._id, donor: users[0]._id, amount: 500, currency: 'USD', paymentMethod: 'card', paymentStatus: 'completed', message: 'Keep up the great work!' },
      { campaign: campaigns[0]._id, donor: users[1]._id, amount: 2000, currency: 'USD', paymentMethod: 'paypal', paymentStatus: 'completed' },
      { campaign: campaigns[1]._id, donor: users[0]._id, amount: 1000, currency: 'USD', paymentMethod: 'card', paymentStatus: 'completed', message: 'Every child deserves education' },
      { campaign: campaigns[2]._id, donor: users[2]._id, amount: 3000, currency: 'USD', paymentMethod: 'bank', paymentStatus: 'completed' },
      { campaign: campaigns[3]._id, donor: users[0]._id, amount: 250, currency: 'USD', paymentMethod: 'card', paymentStatus: 'completed' },
      { campaign: campaigns[4]._id, donor: users[1]._id, amount: 1500, currency: 'USD', paymentMethod: 'paypal', paymentStatus: 'completed', message: 'Health is wealth' },
      { campaign: campaigns[6]._id, donor: users[2]._id, amount: 5000, currency: 'USD', paymentMethod: 'card', paymentStatus: 'completed', message: 'Stay strong!' },
      { campaign: campaigns[5]._id, donor: users[0]._id, amount: 100, currency: 'USD', paymentMethod: 'card', paymentStatus: 'pending' },
    ]);
    console.log('Donations created');

    await Notification.create([
      { recipient: users[0]._id, type: 'system', title: 'Welcome!', message: 'Welcome to ImpactX, Alice!' },
      { recipient: users[1]._id, type: 'system', title: 'Welcome!', message: 'Welcome to ImpactX, Bob!' },
      { recipient: users[2]._id, type: 'system', title: 'Welcome!', message: 'Welcome to ImpactX, Charlie!' },
      { recipient: users[0]._id, type: 'donation_received', title: 'Donation Received', message: 'Thank you for your $500 donation to Clean Water Initiative' },
      { recipient: users[1]._id, type: 'campaign_update', title: 'Campaign Created', message: 'Your campaign "Clean Water Initiative" is now live' },
    ]);
    console.log('Notifications created');

    await Certificate.create([
      { user: users[0]._id, campaign: campaigns[0]._id, type: 'volunteer', certificateId: 'VOL-001', metadata: { hoursContributed: 40, role: 'volunteer' } },
      { user: users[0]._id, campaign: campaigns[2]._id, type: 'volunteer', certificateId: 'VOL-002', metadata: { hoursContributed: 20, role: 'volunteer' } },
      { user: users[0]._id, campaign: campaigns[1]._id, type: 'donation', certificateId: 'DON-001', metadata: { amountDonated: 1000 } },
    ]);
    console.log('Certificates created');

    console.log('\nSeed complete! Login credentials:');
    console.log('  alice@test.com / password123  (volunteer)');
    console.log('  bob@test.com / password123    (ngo_admin)');
    console.log('  charlie@test.com / password123 (super_admin)');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
