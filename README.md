README.md

md
# Creative Workspace 🎨

A **Mobile-First Creative Workspace** for visual creators to manage their hustle entirely from their phones.

## 🎯 Vision

Instead of building massive, bloated desktop software, Creative Workspace is a lean, mobile-first platform that lets creators:
- 📸 Share client proofing portals for instant feedback
- 💰 Generate milestone invoices automatically upon approval
- 📁 Manage assets, links, and project files seamlessly

## 🚀 MVP Features

### 1. Client Proofing Portal
- Upload high-res urban street portraits or design mockups
- Generate mobile-friendly links for clients
- Clients tap to leave specific feedback on images
- One-click approval workflow

### 2. Frictionless Micro-Invoicing
- Automatic milestone invoicing upon client approval
- Direct payment integration (Apple Pay & Google Pay)
- Invoice generation tied to workflow status
- Payment history tracking

### 3. Asset & Link Management
- Centralized hub for active project links
- Social media deliverables organization
- Pop-up store link management
- Clean file organization (no more messy camera rolls)

## 🏗️ Project Structure

creative-workspace/ ├── mobile/ # React Native mobile app │ ├── src/ │ │ ├── screens/ # Screens (Proofing, Invoicing, Assets) │ │ ├── components/ # Reusable components │ │ ├── navigation/ # Navigation setup │ │ ├── services/ # Firebase, Payment APIs │ │ ├── redux/ # State management │ │ └── utils/ # Helpers & constants │ ├── app.json │ └── package.json │ ├── backend/ # Node.js backend │ ├── src/ │ │ ├── routes/ # API endpoints │ │ ├── controllers/ # Business logic │ │ ├── models/ # Firebase schema │ │ ├── middleware/ # Auth, validation │ │ ├── services/ # Firebase, Stripe, Payment services │ │ └── utils/ # Helpers │ ├── .env.example │ └── package.json │ ├── docs/ # Documentation │ ├── API.md # API documentation │ ├── SETUP.md # Setup guide │ └── ARCHITECTURE.md # Architecture overview │ └── .github/workflows/ # CI/CD workflows

Code

## 🛠️ Tech Stack

- **Frontend**: React Native (JavaScript/TypeScript)
- **Backend**: Node.js + Express
- **Database & Auth**: Firebase Firestore + Firebase Auth
- **File Storage**: Firebase Storage
- **Payments**: Stripe + Apple Pay + Google Pay
- **State Management**: Redux or Context API

## 📋 Getting Started

See [SETUP.md](docs/SETUP.md) for detailed setup instructions.

### Quick Start

```bash
# Clone the repo
git clone https://github.com/Aquaman378/creative-workspace.git
cd creative-workspace

# Setup mobile app
cd mobile
npm install
npx react-native run-android  # or run-ios

# Setup backend
cd ../backend
npm install
npm run dev
📚 Documentation
API Documentation
Setup Guide
Architecture
Database Schema
🤝 Contributing
Contributions are welcome! Please read our contributing guidelines.

📄 License
MIT License - See LICENSE file for details

👨‍💻 Author
Aquaman378 - Creator & Builder

Status: 🚧 Early Development - MVP Phase
