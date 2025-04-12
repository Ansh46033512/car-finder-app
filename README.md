
# 🚗 Car Finder App

A sleek and feature-rich car listing web application built with **Next.js**, **TypeScript**, and **Bootstrap**. Search, filter, and explore car models by brand, fuel type, seating capacity, and price range.

---

## ✨ Features

- 🔍 Search & filter cars by brand, fuel type, price range, and seating
- 🖼️ Fetches real-time car images using the Unsplash API
- 💾 Wishlist with `localStorage` support
- 🌙 Dark mode toggle
- 📱 Fully responsive UI using Bootstrap
- 🔁 Pagination support
- 🎨 Smooth animations using Bootstrap utilities and CSS transitions

---

## 🛠️ Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Bootstrap**
- **API Ninjas** (Car data)
- **Unsplash API** (Car images)
- **Vercel** (for deployment - optional)

---

## 📁 Project Structure

```
car-finder-app/
├── app/
│   ├── api/
│   │   └── cars/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── wishlist/page.tsx
├── components/
│   ├── CarCard.tsx
│   └── Navbar.tsx
├── data/
│   └── cars.json
├── types/
│   └── cars.ts
├── public/
│   └── images/
├── styles/
│   └── globals.css
├── .env.local
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Ansh46033512/car-finder-app.git
cd car-finder-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file and add your keys:

```env
UNSPLASH_ACCESS_KEY=your_unsplash_api_key
API_NINJAS_KEY=your_api_ninjas_key
```

> 🔐 [Get Unsplash API key](https://unsplash.com/developers)
> 🔐 [Get API Ninjas Car API key](https://api-ninjas.com/api/cars)

### 4. Run the Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📸 Screenshots

Add screenshots here:

```
![Home Page](public/screenshots/homepage.png)
```

## 📦 Deployment

You can deploy this app for free on [Vercel](https://vercel.com):

1. Push this project to GitHub
2. Import project from GitHub in Vercel dashboard
3. Set up environment variables
4. Deploy 🚀

---

## 👤 Author

Made by [@Ansh46033512](https://github.com/Ansh46033512)

---

## 📜 License

This project is licensed under the MIT License.
