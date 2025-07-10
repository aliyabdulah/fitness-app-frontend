# BankProject - React Native Frontend

This is a React Native Expo application for banking functionality.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on specific platforms:
   ```bash
   npm run android  # Android
   npm run ios      # iOS
   npm run web      # Web
   ```

## Project Structure

- `app/` - Main application pages using Expo Router
  - `(auth)/` - Authentication pages (login, register)
  - `(protected)/` - Protected pages requiring authentication
    - `Account/` - Banking account related pages
- `component/` - Reusable React components
- `context/` - React context providers
- `api/` - API functions for data fetching
- `assets/` - Static assets (images, fonts)

## Features

- Authentication (Login/Register)
- Account Management
- Transfer Money
- Deposit/Withdraw
- User Management
- Profile Management

## Tech Stack

- React Native
- Expo
- Expo Router
- TypeScript
- React Navigation
- Tanstack Query
- Axios 