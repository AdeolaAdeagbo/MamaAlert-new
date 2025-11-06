# MamaAlert - Capacitor Mobile Setup Guide

## 🚀 Quick Start for Mobile App Development

MamaAlert is now Capacitor-ready! Follow these steps to build and test the native mobile app.

### Prerequisites
- Node.js installed
- For iOS: macOS with Xcode installed
- For Android: Android Studio installed
- Git account connected to export project

### Step 1: Export to GitHub
1. Click "Export to GitHub" button in Lovable
2. Git pull the project to your local machine
3. Run `npm install` to install dependencies

### Step 2: Install Capacitor Dependencies
```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
```

### Step 3: Initialize Capacitor (Already configured)
The `capacitor.config.json` is already set up with:
- App ID: `app.lovable.34625e4a2fd647578a8cbc0a0653c33e`
- App Name: `MamaAlert`
- Hot-reload enabled for development

### Step 4: Add Native Platforms
```bash
# For iOS
npx cap add ios

# For Android
npx cap add android
```

### Step 5: Build and Sync
```bash
# Build the web assets
npm run build

# Sync to native platforms
npx cap sync
```

### Step 6: Run on Device/Emulator
```bash
# For Android
npx cap run android

# For iOS (macOS only)
npx cap run ios
```

## 📱 PWA Features Included

- ✅ Offline support with service worker caching
- ✅ Installable as standalone app
- ✅ Optimized for low-bandwidth environments
- ✅ Stale-while-revalidate caching strategy
- ✅ Background sync when connection restored
- ✅ Lazy-loaded images for performance
- ✅ Mobile-optimized card layouts
- ✅ Notification permission hooks (ready for push notifications)

## 🔧 Configuration Notes

### localStorage Keys
All localStorage keys use the `mamaalert_` prefix for consistency across platforms. See `src/lib/localStorage.ts` for centralized key management.

### Caching Strategy
- **Supabase API**: NetworkFirst (24h cache)
- **Static Assets**: StaleWhileRevalidate (7 days)
- **Images**: CacheFirst (30 days)

### Offline Behavior
When offline, users see: "You're offline — cached data loaded safely 💕"
When reconnected: "Back online! Syncing updates..."

## 🎨 Mobile Optimizations

- Card heights reduced by ~25% for less scrolling
- Consistent 12-16px padding throughout
- Smooth scroll rendering for mid-tier Android devices
- Tap targets minimum 44px for accessibility
- Dark mode and light mode tested

## 🔔 Push Notifications (Coming in v2)

Notification hooks are ready in:
- `src/hooks/useNotificationPermission.ts`
- Capacitor config includes push notification plugin setup
- Backend integration needed for actual notifications

## 📊 Performance

- Code splitting for React, UI, and Supabase
- Lazy loading with Intersection Observer
- Optimized image loading
- Service worker caching reduces API calls

## 🛠️ Development Tips

1. **Hot Reload**: The capacitor config points to Lovable sandbox for live updates during development
2. **Production Build**: Change server.url to production domain before deploying
3. **Testing**: Test both online/offline modes
4. **Storage**: Monitor localStorage usage to stay within device limits

## 📝 Next Steps

1. Test on physical devices (iOS and Android)
2. Implement push notifications backend
3. Add app store assets (screenshots, descriptions)
4. Configure app signing for production
5. Submit to Apple App Store and Google Play Store

For more help, visit: https://capacitorjs.com/docs
