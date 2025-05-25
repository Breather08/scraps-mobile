# Sarqyt - Food Waste Reduction App 🍽️

Sarqyt is a mobile application inspired by TooGoodToGo, designed to connect users with local food businesses that have surplus food to sell at a discount, helping reduce food waste while offering great deals to customers.

## Features

- **Phone Authentication**: Secure login and registration using phone number and OTP verification
- **Partner Exploration**: Browse nearby food businesses with surplus food packages
- **Partner Details**: View detailed information about each partner, including food packages, ratings, and pickup times
- **Filter & Search**: Find partners by proximity, rating, price, or search by name
- **Checkout Process**: Select food packages and complete the ordering process
- **Orders History**: Track past and upcoming orders
- **Multilingual Support**: Available in English and Russian

## Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Database & Backend**: Supabase (PostgreSQL)
- **State Management**: React Context API
- **Styling**: React Native StyleSheet
- **Location Services**: Expo Location
- **Maps**: React Native Maps

## Project Structure

```
sarqyt/
├── app/                  # Main application screens and navigation
│   ├── (auth)/           # Authentication screens
│   ├── (tabs)/           # Main tab screens
│   └── partner/          # Partner detail screens
├── components/           # Reusable UI components
├── entities/             # Domain-specific modules
│   ├── food-package/     # Food package related code
│   └── partner/          # Partner related code
├── providers/            # Context providers
├── services/             # API and service integration
└── utils/                # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- pnpm
- Expo CLI
- Supabase account

### Setup

1. Clone the repository

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Configure environment variables

   Create a `.env` file in the root directory with the following variables:

   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server

   ```bash
   npx expo start
   ```

5. Open the app in your preferred environment:
   - iOS Simulator
   - Android Emulator
   - Expo Go app on your physical device

## Database Schema

The app uses Supabase with the following main tables:

- `users` - User authentication and profile information
- `business_profiles` - Partner/business information
- `food_packages` - Available food packages from partners
- `orders` - Customer orders
