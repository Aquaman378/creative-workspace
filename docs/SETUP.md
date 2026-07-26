# Setup Guide 🚀

Complete setup instructions for Creative Workspace development environment.

## Prerequisites

- **Node.js** (v16+) and npm
- **React Native CLI**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Firebase Account** (free tier available)
- **Stripe Account** (for payments)

## 1️⃣ Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project"
3. Name it: `creative-workspace`
4. Enable Google Analytics (optional)
5. Wait for project creation

### Enable Services

In Firebase Console:

1. **Firestore Database**
   - Click "Firestore Database"
   - Click "Create Database"
   - Start in **Production Mode**
   - Select region closest to you

2. **Authentication**
   - Go to "Authentication"
   - Click "Get Started"
   - Enable **Email/Password** and **Google Sign-In**

3. **Storage**
   - Go to "Storage"
   - Click "Get Started"
   - Accept default settings

4. **Download Config**
   - Project Settings → Your Apps → Web
   - Copy the config object
   - Save as `FIREBASE_CONFIG` (see Environment Variables)

## 2️⃣ Environment Variables

### Backend (.env)

Create `backend/.env`:

```env
# Firebase
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Apple Pay
APPLE_PAY_MERCHANT_ID=merchant.com.yourcompany.creativeworkspace
APPLE_PAY_CERTIFICATE_PATH=./certs/apple_pay.p8

# Server
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

### Mobile (.env)

Create `mobile/.env`:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

STRIPE_PUBLISHABLE_KEY=pk_test_your_key
API_URL=http://localhost:3000
```

## 3️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Verify .env file is configured
cat .env

# Start development server
npm run dev

# Server should run on http://localhost:3000
```

## 4️⃣ Mobile App Setup

### Android

```bash
cd mobile

# Install dependencies
npm install

# Start Android emulator (or connect physical device)
npx react-native run-android

# Metro bundler will start automatically
```

### iOS (macOS only)

```bash
cd mobile

# Install dependencies
npm install

# Install pods
cd ios && pod install && cd ..

# Start iOS simulator
npx react-native run-ios

# Or open Xcode directly
open ios/CreativeWorkspace.xcworkspace
```

## 5️⃣ Stripe Payment Setup

### Get API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API Keys**
3. Copy **Secret Key** (sk_test_...)
4. Copy **Publishable Key** (pk_test_...)
5. Add to `.env` files

### Create Stripe Products

```bash
# Example: Create products for milestone payments
# Use Stripe CLI or Dashboard

# Deposit (50%)
# Milestone Invoice
# Final Payment
```

## 6️⃣ Apple Pay & Google Pay Setup

### Apple Pay

1. Enroll in [Apple Developer Program](https://developer.apple.com)
2. Create **Merchant ID**: `merchant.com.yourcompany.creativeworkspace`
3. Generate certificate and download `.p8` file
4. Add path to `APPLE_PAY_CERTIFICATE_PATH` in `.env`

### Google Pay

1. Go to [Google Pay Setup](https://developers.google.com/pay)
2. No additional setup needed - works with Stripe integration

## 7️⃣ Firestore Database Schema Setup

Run this in Firebase Console (Firestore):

```javascript
// Collections structure
users/
  {userId}/
    - email: string
    - name: string
    - createdAt: timestamp
    - tier: string (free/pro)

projects/
  {projectId}/
    - userId: string
    - name: string
    - status: string (draft/active/archived)
    - createdAt: timestamp
    - updatedAt: timestamp

clients/
  {clientId}/
    - projectId: string
    - email: string
    - name: string
    - approvals: array

assets/
  {assetId}/
    - projectId: string
    - type: string (image/video/mockup)
    - url: string
    - uploadedAt: timestamp

invoices/
  {invoiceId}/
    - projectId: string
    - amount: number
    - status: string (draft/sent/paid)
    - dueDate: timestamp
    - createdAt: timestamp

approvals/
  {approvalId}/
    - assetId: string
    - clientId: string
    - status: string (pending/approved/rejected)
    - feedback: string
    - approvedAt: timestamp
```

## 8️⃣ Testing

```bash
# Backend tests
cd backend
npm run test

# Mobile tests
cd ../mobile
npm run test
```

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
# Clear cache and rebuild
npm start -- --reset-cache
```

### Firebase Connection Issues
- Verify `.env` credentials are correct
- Check Firebase project is created and enabled
- Ensure Firestore is initialized

### Payment Integration Issues
- Test keys should start with `pk_test_` and `sk_test_`
- Production keys start with `pk_live_` and `sk_live_`
- Never commit real keys to git

## ✅ Verification Checklist

- [ ] Node.js installed (v16+)
- [ ] Firebase project created
- [ ] Firestore Database initialized
- [ ] Authentication enabled
- [ ] Storage bucket created
- [ ] `.env` files configured (backend & mobile)
- [ ] Backend dependencies installed
- [ ] Mobile dependencies installed
- [ ] Backend server starts without errors
- [ ] Mobile app starts in emulator/simulator
- [ ] Firebase connection verified

## 📞 Need Help?

- [Firebase Docs](https://firebase.google.com/docs)
- [React Native Docs](https://reactnative.dev)
- [Stripe Docs](https://stripe.com/docs)

---

**Next Steps**: See [API.md](API.md) for backend endpoints documentation.
