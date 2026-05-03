# Muwafak's Developer Portfolio

A premium, fully responsive, and highly professional developer portfolio website built for a modern frontend developer. The site features a dark-themed UI with glassmorphism, neon blue and purple gradients, and smooth scroll-triggered animations.

![Portfolio Preview](./public/portfolio-preview.webp) *(Note: Add a screenshot of your portfolio in the public folder to display here)*

## 🚀 Features

- **Modern Glassmorphism UI**: High-end translucent design elements perfect for presenting a sleek tech portfolio.
- **Dynamic Orbit Animation**: A custom CSS and Framer Motion animation orbiting around the profile card in the Hero section.
- **Beautiful Scroll Animations**: Every section elegantly fades and slides into view as the user scrolls down the page.
- **Interactive "Skills" progress**: Animated skill progress bars and floating stat-counters.
- **Fully Responsive Layout**: Perfectly tailored views for Mobile, Tablet, and Desktop users.
- **Form UI Ready**: Beautifully styled contact form ready to be integrated with a backend service (e.g., Formspree or EmailJS).

## 🛠️ Technology Stack

- **React (`react`)**: Core library for UI components.
- **Vite (`vite`)**: Ultra-fast frontend build tool.
- **Tailwind CSS (`tailwindcss`)**: Utility-first CSS framework for rapid styling.
- **Framer Motion (`framer-motion`)**: Production-ready animation library used for scroll reveals and orbit effects.
- **React Icons (`react-icons`)**: Lightweight library for scalable SVG icons.
- **React Scroll (`react-scroll`)**: Used to enable smooth scrolling to anchored sections on single-page applications.
- **React Type Animation (`react-type-animation`)**: Used for the interactive typewriter effect in the hero section.

## 📁 Project Structure

```text
muwafak-portfolio/
├── public/                 # Static public assets (e.g., CV pdf)
│   └── muwafak-cv.pdf        # Downloadable CV file
├── src/
│   ├── assets/             # Images and local media
│   │   └── muwafak.png       
│   ├── components/         # Independent React UI components
│   │   ├── Navbar.jsx      
│   │   ├── Hero.jsx        
│   │   ├── About.jsx       
│   │   ├── Skills.jsx      
│   │   ├── Projects.jsx    
│   │   ├── Contact.jsx     
│   │   └── Footer.jsx      
│   ├── App.jsx             # Main layout assembly
│   ├── index.css           # Global Tailwind & Custom styles
│   └── main.jsx            # Application entry point
├── tailwind.config.js      # Global layout configs (theme colors, animations)
└── package.json            # Project dependencies
```

## ⚙️ How to Setup & Run Locally

1. **Clone the repository** (if hosted on GitHub):
   ```bash
   git clone <repository_url>
   cd muwafak-portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the local development server**:
   ```bash
   npm run dev
   ```
   *The server will typically start at `http://localhost:5173/`.*

4. **Build for production** (when ready to deploy):
   ```bash
   npm run build
   ```

## 🎨 Customizing the Content

- **Personal Information**: Open the individual component files (like `About.jsx`, `Contact.jsx`, `Hero.jsx`) to update placeholder text with your actual bio, phone number, location, etc.
- **Changing Projects**: Navigate to `src/components/Projects.jsx` and look for the `projects` array at the top of the file to replace placeholder titles, descriptions, and Github links with your own work.
- **CV Download**: Place your resume PDF in the `/public/` directory and name it `muwafak-cv.pdf`.

## 🚢 Deployment

Since this project is built with Vite, it's incredibly easy to deploy to platforms like **Vercel** or **Netlify**. 
Simply link your GitHub repository to either platform, and the build settings will be automatically detected (`npm run build`, output directory: `dist/`).

---
*Coded and designed with 💙 using React & Tailwind.*
