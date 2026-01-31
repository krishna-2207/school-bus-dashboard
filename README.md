# 🚌 School Bus Safety & Tracking System

A real-time school bus tracking dashboard built with React, TypeScript, Firebase, and Tailwind CSS.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.7-orange)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

## ✨ Features

- 🗺️ **Real-Time GPS Tracking** - Live bus positions on interactive map
- ⚡ **Speed Monitoring** - Real-time speed display with overspeed alerts
- 🚨 **Alert System** - Automatic alerts for overspeed, geofence violations
- 👨‍✈️ **Driver Management** - View driver details and contact information
- 🛤️ **Route Visualization** - Display routes with stops on map
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔐 **Secure** - Firebase Authentication and Firestore security rules

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Firebase project created
- Git installed

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/school-bus-dashboard.git
cd school-bus-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable **Firestore Database** (Start in test mode)
4. Enable **Authentication** → Anonymous sign-in
5. Go to Project Settings → Your Apps → Add Web App
6. Copy the config and update these files:

**`src/firebase/config.ts`**
```typescript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

**`simulator/gps-simulator.js`** and **`scripts/seed-database.js`**
Update the same config in both files.

### 4. Seed the Database

```bash
npm run seed
```

This creates sample data: buses, routes, drivers, alerts.

### 5. Start Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 6. Start GPS Simulator (New Terminal)

```bash
npm run simulate
```

Watch the buses move in real-time! 🚌

## 📁 Project Structure

```
school-bus-dashboard/
├── src/
│   ├── components/           # React components
│   │   ├── LiveMap.tsx       # Interactive Leaflet map
│   │   ├── BusInfoPanel.tsx  # Bus details sidebar
│   │   └── AlertsList.tsx    # Alerts display
│   ├── firebase/             # Firebase services
│   │   ├── config.ts         # Firebase configuration
│   │   ├── firestore.ts      # Firestore operations
│   │   ├── auth.ts           # Authentication
│   │   └── index.ts          # Exports
│   ├── hooks/                # Custom React hooks
│   │   └── useBusTracking.ts # Real-time data hooks
│   ├── types/                # TypeScript types
│   │   └── firebase.ts       # Data type definitions
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Tailwind + custom styles
├── simulator/
│   └── gps-simulator.js      # GPS simulation script
├── scripts/
│   └── seed-database.js      # Database seeder
├── firestore.rules           # Firestore security rules
├── tailwind.config.js        # Tailwind configuration
├── vite.config.ts            # Vite configuration
└── package.json
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run seed` | Seed database with sample data |
| `npm run simulate` | Run GPS simulator |

## 🌐 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Deploy!

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Deploy to Netlify

1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Connect your repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Deploy!

## 🔒 Firestore Security Rules

Deploy these rules to your Firebase project:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📊 Database Collections

| Collection | Description |
|------------|-------------|
| `buses` | Bus information (number, capacity, status) |
| `routes` | Route details with stops |
| `drivers` | Driver profiles |
| `liveLocations` | Real-time GPS data |
| `alerts` | System alerts |
| `admins` | Admin users |

## 🎨 Customization

### Change Map Style

Edit `src/components/LiveMap.tsx`:

```typescript
// Use dark theme
<TileLayer
    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
/>
```

### Modify Speed Limit

Edit `src/components/BusInfoPanel.tsx` and `simulator/gps-simulator.js`:

```javascript
const SPEED_LIMIT = 50; // km/h
```

### Add New Alerts

Edit `src/firebase/firestore.ts`:

```typescript
await createAlert({
    busId: 'bus_001',
    type: 'custom',
    message: 'Custom alert message',
    severity: 'medium',
    status: 'active'
});
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Leaflet](https://leafletjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Vite](https://vitejs.dev/)

---

Made with ❤️ for School Safety
