# 🔧 Kisavi Setup Guide — Fix All Errors

---

## ❌ Main Error You're Seeing

```
querySrv ENOTFOUND _mongodb._tcp.cluster0.xxxxx.mongodb.net
```

**Cause:** You haven't replaced the placeholder MongoDB URI in `.env.local`.

---

## ✅ Step-by-Step Fix

### Step 1 — MongoDB Atlas (5 minutes, free)

1. Go to **[mongodb.com/atlas](https://mongodb.com/atlas)** → Sign up free
2. Create a **free M0 cluster** (choose any region)
3. Under **Security → Database Access** → Add database user
   - Username: `farmlink`
   - Password: something strong (save it)
   - Role: `Atlas admin`
4. Under **Security → Network Access** → Add IP Address → `0.0.0.0/0` (allow all)
5. Under **Deployment → Database** → Click **Connect** → **Drivers**
6. Copy the connection string. It looks like:
   ```
   mongodb+srv://farmlink:YourPassword@cluster0.abc123.mongodb.net/
   ```
7. Open `.env.local` and replace:
   ```
   MONGODB_URI=mongodb+srv://farmlink:YourPassword@cluster0.abc123.mongodb.net/farmlink?retryWrites=true&w=majority
   ```

---

### Step 2 — Generate NextAuth Secret

Run this in your terminal (PowerShell):

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste into `.env.local`:
```
NEXTAUTH_SECRET=paste-the-output-here
```

---

### Step 3 — Install & Run

```bash
npm install
npm run dev
```

Open: http://localhost:3000

---

### Step 4 — Seed Demo Data

1. Go to http://localhost:3000/admin
2. Login: `admin` / `farmlink2025`
3. Click **"🌱 Seed Demo Data"** button (top right)
4. 3 farmers + vegetables will appear

---

### Step 5 — Test All Panels

| Panel | URL | Login |
|-------|-----|-------|
| Customer | http://localhost:3000/customer | Sign up with email |
| Farmer | http://localhost:3000/farmer | FL-001 / farm001 |
| Delivery | http://localhost:3000/delivery | Add via admin first |
| Admin | http://localhost:3000/admin | admin / farmlink2025 |

---

## 💳 Razorpay Setup (for real payments)

1. Go to **[razorpay.com](https://razorpay.com)** → Sign up
2. Dashboard → Settings → API Keys → Generate Test Key
3. Copy Key ID and Key Secret into `.env.local`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   ```
4. Test payments work with any card: `4111 1111 1111 1111` / any future date / any CVV

---

## 📱 Twilio WhatsApp Setup

1. Go to **[twilio.com](https://twilio.com)** → Sign up free
2. Console → Messaging → Try it out → Send a WhatsApp message
3. Follow the sandbox join instructions
4. Copy Account SID and Auth Token into `.env.local`
5. Farmers and customers get WhatsApp when a customer places an order
6. Every active delivery partner gets a WhatsApp offer for new confirmed orders
7. Customers, farmers, and the assigned delivery partner get WhatsApp after delivery

## ✉️ Email Notifications (Resend)

1. Create an API key at [resend.com](https://resend.com)
2. Add these values to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxx
   FARMLINK_FROM_EMAIL=Kisavi <notifications@your-verified-domain.com>
   FARMLINK_SUPPORT_PHONE=+91xxxxxxxxxx
   ```
3. Verify the sender domain in Resend before using a production address.

Customers, farmers, and delivery partners must have email addresses saved in their profiles for email notifications.

---

## 🗺️ Google Maps Setup (live GPS tracking)

1. Go to **[console.cloud.google.com](https://console.cloud.google.com)**
2. Create project → Enable **Maps JavaScript API**
3. Credentials → Create API Key
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_KEY=your-key-here
   ```
5. Restrict key to your domain in production

> Without this key, the app uses a fallback SVG map (still works, just no live GPS)

---

## 🚀 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

When prompted, add all `.env.local` values as environment variables.

After deploy, update:
- `NEXTAUTH_URL` → your Vercel URL (e.g. `https://kisavi.vercel.app`)
- Google OAuth redirect URI → `https://farmlink.vercel.app/api/auth/callback/google`
- Razorpay webhook URL → `https://farmlink.vercel.app/api/payment`

---

## 📁 All 4 Panels

```
/customer   → Swiggy-style mobile ordering app
/farmer     → Farmer dashboard (vegetable management)
/delivery   → Delivery partner app (GPS sharing, status updates)
/admin      → Platform owner (manage everything)
```
