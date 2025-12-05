# How to Install Milestone English App on Android

This guide will help you install the Milestone English PWA (Progressive Web App) on your Android device.

## ⚠️ Important: PWA vs APK

**PWAs don't install as APK files** - they install as web apps that run in a browser container. This is normal and expected behavior.

- **PWA Installation**: Installs as a web app icon on your home screen, works offline, updates automatically
- **APK File**: A native Android app file (like apps from Play Store)

If you need a **real APK file**, see `APK_INSTALLATION.md` for instructions on how to generate one.

## Prerequisites

1. **Android device** running Android 5.0 (Lollipop) or higher
2. **Chrome browser** or **Edge browser** installed on your Android device
3. **Internet connection** (for initial setup)

## Method 1: Using Chrome Browser (Recommended)

### Step 1: Open the App in Chrome
1. Open **Chrome** browser on your Android device
2. Navigate to your app URL:
   - **Local Development**: `http://YOUR_COMPUTER_IP:5173` (replace with your computer's IP address)
   - **Production**: Your deployed app URL

### Step 2: Install the App
1. Once the app loads, you'll see an **"Add to Home screen"** banner at the bottom
2. Tap **"Add"** or **"Install"** button
   
   **OR** if you don't see the banner:
   
   - Tap the **three-dot menu** (⋮) in the top-right corner
   - Select **"Add to Home screen"** or **"Install app"**
   - Tap **"Add"** or **"Install"** in the popup

### Step 3: Confirm Installation
1. A confirmation dialog will appear
2. You can customize the app name (default: "Milestone")
3. Tap **"Add"** or **"Install"**

### Step 4: Launch the App
1. The app icon will appear on your home screen
2. Tap the icon to launch the app
3. It will open in fullscreen mode (like a native app)

## Method 2: Using Edge Browser

1. Open **Edge** browser on your Android device
2. Navigate to your app URL
3. Tap the **three-dot menu** (⋮)
4. Select **"Add to Home screen"**
5. Tap **"Add"** to confirm

## Method 3: Manual Installation via Browser Menu

If the automatic prompt doesn't appear:

1. Open Chrome/Edge and navigate to your app
2. Tap the **three-dot menu** (⋮)
3. Look for **"Add to Home screen"** or **"Install app"**
4. Follow the prompts to install

## Troubleshooting

### Issue: "Add to Home screen" option is not available

**Solutions:**
- Make sure you're using Chrome or Edge browser (not Samsung Internet or Firefox)
- Ensure you're accessing the app via HTTPS (required for PWA installation)
- Clear browser cache and try again
- Make sure the app is fully loaded before trying to install

### Issue: App doesn't work offline

**Solution:**
- The service worker needs to be registered first
- Open the app in browser, wait a few seconds for it to cache
- Then install it

### Issue: Can't access local development server from phone

**Solution:**
1. Make sure your phone and computer are on the same Wi-Fi network
2. Find your computer's IP address:
   - **Windows**: Open Command Prompt, type `ipconfig`, look for IPv4 Address
   - **Mac/Linux**: Open Terminal, type `ifconfig` or `ip addr`, look for inet address
3. In your terminal, run: `npm run dev -- --host`
4. Access from phone using: `http://YOUR_IP_ADDRESS:5173`

## Features After Installation

Once installed, the app will:
- ✅ Work offline (after initial load)
- ✅ Launch in fullscreen mode
- ✅ Appear in your app drawer
- ✅ Have its own icon on home screen
- ✅ Update automatically when new version is available

## Uninstalling

To uninstall the app:
1. Long-press the app icon on your home screen
2. Tap **"Uninstall"** or drag to **"Remove"**
3. Or go to **Settings > Apps > Milestone** and tap **"Uninstall"**

## Notes

- The app needs to be served over HTTPS (or localhost) for PWA features to work
- For production, deploy to a hosting service that supports HTTPS (Vercel, Netlify, etc.)
- The app will cache content for offline use automatically
