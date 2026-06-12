# 🌿 FarmLink — Next.js Startup

Farm-to-home vegetable delivery platform built with Next.js 14, MongoDB, NextAuth, Tailwind CSS.

---

## 🚀 Quick Start (5 steps)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up MongoDB Atlas (free)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free account
2. Create a new cluster (free M0 tier)
3. Click **Connect** → **Drivers** → copy the connection string
4. Replace `<username>` and `<password>` in the URI

### 3. Set up Google OAuth (optional but recommended)
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID → Web application
4. Add Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Client Secret

### 4. Configure environment variables
Edit `.env.local`:
```
MONGODB_URI=mongodb+srv://your-user:your-pass@cluster0.xxxxx.mongodb.net/farmlink

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-string-here   # run: openssl rand -base64 32

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

ADMIN_USERNAME=admin
ADMIN_PASSWORD=farmlink2025
```

### 5. Run the app
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📱 Three Apps

| URL | Who uses it | Login |
|-----|-------------|-------|
| `/customer` | Customers ordering vegetables | Email/Password or Google |
| `/farmer` | Farmers managing their listings | Farmer ID + Password (given by admin) |
| `/admin` | Platform owner (you) | admin / farmlink2025 |

---

## 🌱 Seed Demo Data
After starting the app:
1. Go to `/admin` → Login
2. Click the **"Seed Demo Data"** button in top right
3. Three sample farmers + vegetables will be created

Demo farmer accounts after seeding:
- `FL-001` / `farm001` — Balu Patil (Warangal)
- `FL-002` / `farm002` — Savitri Reddy (Nizamabad)
- `FL-003` / `farm003` — Kishore Naidu (Kurnool)

---

## 🏗️ Project Structure

```
farmlink/
├── app/
│   ├── admin/page.js          # Admin panel (desktop-optimized)
│   ├── farmer/page.js         # Farmer dashboard (mobile-friendly)
│   ├── customer/page.js       # Customer app (Swiggy-style mobile)
│   ├── api/
│   │   ├── auth/[...nextauth] # NextAuth (Google + credentials)
│   │   ├── farmers/           # GET, POST farmers
│   │   ├── farmers/[id]/      # GET, PATCH, DELETE farmer by ID
│   │   ├── vegetables/        # POST, PATCH, DELETE vegetables
│   │   ├── orders/            # GET, POST, PATCH orders
│   │   ├── customers/         # POST (signup)
│   │   └── seed/              # POST (demo data)
│   ├── globals.css            # Tailwind + custom design system
│   ├── layout.js              # Root layout (Sora font, providers)
│   └── providers.js           # NextAuth SessionProvider
├── lib/
│   ├── mongodb.js             # Mongoose connection (cached)
│   └── utils.js               # Helpers (formatCurrency, getVegEmoji…)
├── models/
│   ├── Farmer.js              # Farmer + Vegetable schema
│   ├── Customer.js            # Customer schema
│   └── Order.js               # Order schema
├── .env.local                 # ← Fill this in!
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🔑 Key Features

### Customer App (`/customer`)
- Google Sign-In + Email/Password auth
- Browse nearby farms with Swiggy-style cards
- Add-to-cart with real-time quantity controls
- ₹300 minimum order enforcement
- Animated SVG delivery map tracker
- Live order status updates
- Mobile-first bottom navigation
- Order history in account tab

### Farmer Panel (`/farmer`)
- Login with unique Farmer ID (given by admin)
- Dashboard with earnings, order count, rating
- Add / Edit / Delete vegetables
- Toggle availability on/off instantly
- View all incoming orders with earnings breakdown

### Admin Panel (`/admin`)
- Overview: GMV, live orders, farmer status
- Add farmers → auto-generate FL-001, FL-002… IDs
- Edit / Deactivate / Delete farmers
- View all orders with real-time status updates
- Revenue breakdown: platform fee, delivery, farmer payouts
- Revenue by farmer with progress bars

---

## 🚢 Deploy to Vercel (production)

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard → Settings → Environment Variables.

Update Google OAuth redirect URI to your Vercel domain:
`https://your-app.vercel.app/api/auth/callback/google`

---

## 💡 Next Steps for Your Startup

1. **Payments** — Integrate Razorpay for real money collection
2. **SMS OTP** — Add 2Factor.in for phone verification (you already know this!)
3. **Push notifications** — Use Firebase Cloud Messaging for order updates
4. **Delivery partner app** — Build a 4th panel for delivery partners
5. **Map integration** — Use Google Maps API for real location tracking
6. **Reviews & ratings** — Let customers rate farmers after delivery
7. **Analytics** — Add Mixpanel/PostHog for user behaviour tracking

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB Atlas + Mongoose
- **Auth**: NextAuth.js (Google OAuth + Credentials)
- **Styling**: Tailwind CSS + custom design system
- **Fonts**: Sora (body) + JetBrains Mono (IDs/code)
- **Deployment**: Vercel
