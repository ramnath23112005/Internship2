# ImpactX - AI-Powered NGO Volunteer & Campaign Management Platform

![ImpactX](https://img.shields.io/badge/ImpactX-v1.0-purple)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

ImpactX is a **modern full-stack SaaS web application** that connects volunteers with NGOs. It provides campaign management, donation tracking, real-time notifications, AI-powered assistance, analytics, and certificate generation — all wrapped in a stunning glassmorphism UI with dark/light mode.

---

## Features

### Frontend
- Landing page with animated hero, features, and CTA sections
- User authentication (register/login) with JWT
- Volunteer dashboard with personal impact stats
- NGO Admin dashboard with platform-wide analytics
- Campaign management (create, browse, join, donate)
- Real-time donation tracking with pagination
- Analytics dashboard with bar and pie charts (Recharts)
- Certificate generation and display
- User management for super admins
- Profile management
- **Dark/Light mode** with persistent storage
- **Glassmorphism UI** with purple/blue gradients
- **Responsive** mobile-first design
- **Framer Motion** animations throughout
- Protected routes with role-based access

### Backend
- RESTful API with Express.js
- MongoDB Atlas integration with Mongoose ODM
- JWT authentication with role-based access (volunteer, ngo_admin, super_admin)
- Campaign CRUD with volunteer join system
- Donation processing with campaign progress tracking
- Real-time notifications via Socket.io
- AI campaign assistant (OpenAI/Gemini integration)
- Certificate generation with unique IDs
- Email notifications (welcome, donation receipts)
- Aggregated analytics with MongoDB pipelines
- Pagination, search, and filtering

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Framer Motion, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens) |
| Real-time | Socket.io |
| AI | OpenAI API / Gemini API |
| Email | Nodemailer |
| Styling | Tailwind CSS, Glassmorphism, Gradients |

---

## Project Structure

```
ImpactX/
├── .env.example
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Campaign.js
│   │   ├── Donation.js
│   │   ├── Notification.js
│   │   └── Certificate.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── roleCheck.js
│   │   └── errorHandler.js
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── campaigns.js
│   │   ├── donations.js
│   │   ├── notifications.js
│   │   ├── analytics.js
│   │   ├── certificates.js
│   │   ├── users.js
│   │   └── ai.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── campaigns.js
│   │   ├── donations.js
│   │   ├── notifications.js
│   │   ├── analytics.js
│   │   ├── certificates.js
│   │   ├── users.js
│   │   └── ai.js
│   ├── services/
│   │   ├── email.js
│   │   └── ai.js
│   ├── socket/
│   │   └── index.js
│   └── utils/
│       └── helpers.js
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── index.css
│       ├── App.js
│       ├── context/
│       │   ├── AuthContext.js
│       │   ├── ThemeContext.js
│       │   └── SocketContext.js
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.js
│       │   │   ├── Sidebar.js
│       │   │   └── DashboardLayout.js
│       │   ├── ui/
│       │   │   ├── Button.js
│       │   │   ├── Card.js
│       │   │   ├── Input.js
│       │   │   ├── Badge.js
│       │   │   ├── Modal.js
│       │   │   ├── Loader.js
│       │   │   └── Toast.js
│       │   ├── charts/
│       │   │   ├── BarChart.js
│       │   │   └── PieChart.js
│       │   └── protected/
│       │       └── ProtectedRoute.js
│       ├── pages/
│       │   ├── Home.js
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── Profile.js
│       │   ├── Users.js
│       │   ├── volunteer/
│       │   │   └── Dashboard.js
│       │   ├── admin/
│       │   │   └── Dashboard.js
│       │   ├── campaigns/
│       │   │   ├── CampaignList.js
│       │   │   ├── CampaignDetail.js
│       │   │   └── CreateCampaign.js
│       │   ├── donations/
│       │   │   └── DonationTracking.js
│       │   ├── analytics/
│       │   │   └── Analytics.js
│       │   └── certificates/
│       │       └── Certificates.js
│       ├── services/
│       │   └── api.js
│       └── utils/
│           └── helpers.js
└── README.md
```

---

## Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/impactx.git
cd impactx
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the root `ImpactX` directory (see `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
AI_API_KEY=your_openai_or_gemini_api_key
AI_PROVIDER=openai
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

The app will be available at `http://localhost:3000`.

---

## API Endpoints

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Campaigns
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/campaigns` | List campaigns (with search, filter, pagination) |
| POST | `/api/campaigns` | Create campaign (NGO admin+) |
| GET | `/api/campaigns/:id` | Get campaign details |
| PUT | `/api/campaigns/:id` | Update campaign |
| DELETE | `/api/campaigns/:id` | Delete campaign |
| POST | `/api/campaigns/:id/join` | Join campaign as volunteer |
| GET | `/api/campaigns/:id/ai-tips` | Get AI-powered campaign tips |

### Donations
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/donations` | Create donation |
| GET | `/api/donations` | List donations |
| GET | `/api/donations/stats` | Get donation statistics |

### Notifications
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/notifications` | Get user notifications |
| PUT | `/api/notifications/:id/read` | Mark notification as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

### Analytics
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/analytics/dashboard` | Admin dashboard stats |
| GET | `/api/analytics/volunteer` | Volunteer stats |

### Certificates
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/certificates` | Generate certificate |
| GET | `/api/certificates` | Get user certificates |
| GET | `/api/certificates/verify/:id` | Verify certificate |

### Users (Super Admin)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/users` | List all users |
| PUT | `/api/users/:id/role` | Update user role |
| PUT | `/api/users/:id/status` | Toggle user status |

### AI Assistant
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/ai/tips/:campaignId` | Get AI tips for campaign |
| POST | `/api/ai/generate-description` | Generate campaign description |

---

## Roles

| Role | Permissions |
|------|------------|
| **Volunteer** | View campaigns, join campaigns, donate, view own analytics, generate certificates |
| **NGO Admin** | All volunteer permissions + create/manage campaigns, view admin analytics |
| **Super Admin** | All permissions + user management (update roles, toggle status) |

---

## License

This project is licensed under the MIT License.
