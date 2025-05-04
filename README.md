# 💸 Crypto Tracker App

A production-grade, cross-platform **React Native cryptocurrency tracker** application developed to function seamlessly on both **Android** and **iOS** devices. The app utilizes the [CoinGecko API](https://www.coingecko.com/en/api) to retrieve real-time digital asset data, including market prices, volume, and historical performance metrics.

---

## 📱 Platform Compatibility

| Platform | Support Status |
|----------|----------------|
| Android  | ✅ Fully Supported |
| iOS      | ✅ Fully Supported |

---

## 🚀 Key Features

- 🔍 Real-time coin data from CoinGecko API
- 📈 Interactive historical price charts
- 📊 Market cap, volume, and price change metrics
- ⚡ Hermes engine enabled for Android performance optimization
- 🧩 Componentized and modular UI structure
- 🔐 Secure architecture and third-party integrations

---

## 📸 Screenshots

> *(Include emulator or real-device screenshots here to showcase the UI and features.)*

---

## 🧰 Technology Stack

- **React Native CLI** (not Expo)
- **JavaScript (ES6+)**
- **React Navigation** – routing and screen transitions
- **Victory Native** / **react-native-svg-charts** – for graph rendering
- **Hermes** – lightweight JavaScript engine for Android
- **CoinGecko API** – market data provider

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/rsuneel7351/Crypto-app.git
cd crypto-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. iOS Specific Setup (MacOS Only)

```bash
cd ios
pod install
cd ..
```

### 4. Start Metro Bundler

```bash
npx react-native start
```

---

## 📱 Running the App

### Android

```bash
npx react-native run-android
```

### iOS

```bash
npx react-native run-ios
```

> Ensure that the respective emulator/simulator is running before executing the above commands.

---

## 📦 Build Instructions

### Generate a Signed APK (Android)

```bash
cd android
./gradlew assembleRelease
```

APK will be available at:
```
android/app/build/outputs/apk/release/
```

### Generate an Android App Bundle (AAB)

```bash
cd android
./gradlew bundleRelease
```

AAB will be available at:
```
android/app/build/outputs/bundle/release/
```

---

## 🔐 Environment Variables

- The CoinGecko API does not require authentication; hence, no API key configuration is necessary.
- For extensibility, `.env` integration can be added using `react-native-dotenv`.

---

## 📈 Potential Enhancements

- [ ] Add coin watchlist or favorites
- [ ] Enable dark mode toggle
- [ ] Implement authentication and user portfolio management
- [ ] Integrate push notifications for coin alerts

---


---

## 👤 Author

**Suneel Kumar**  
React Native Developer  
GitHub: [rsuneel7351](https://github.com/rsuneel7351)  
LinkedIn: *[suneel7351](https://www.linkedin.com/in/suneel7351/)*

---

## 📢 Acknowledgments

- [CoinGecko](https://coingecko.com) for API data access
- React Native and associated open-source contributors
- Design inspiration from various open-source crypto dashboards
