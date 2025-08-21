# 🌟 Orione.uk - Automated Portfolio Website

A modern, automated portfolio website that syncs projects directly from GitHub repositories. Built with HTML5, TailwindCSS, and Vanilla JavaScript.

![Portfolio Preview](https://img.shields.io/badge/Portfolio-Live-blue?style=for-the-badge&logo=vercel)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-green?style=for-the-badge&logo=github)](https://miqdad-dev.github.io/Portfolio/)
[![Auto-Sync](https://img.shields.io/badge/Auto--Sync-Enabled-orange?style=for-the-badge&logo=github-actions)](https://github.com/miqdad-dev/Portfolio/actions)

## ✨ Features

### 🚀 **Automated Project Sync**
- Automatically fetches all public repositories from GitHub
- Extracts project metadata, tech stacks, and descriptions
- Updates portfolio dynamically without manual intervention
- Excludes forks and unwanted repositories

### 🎨 **Modern Design**
- Responsive design across all devices
- Dark/light mode with system preference detection
- Smooth animations and scroll effects
- Clean, minimalist aesthetic inspired by Apple/Vercel

### 📱 **Interactive Elements**
- Dedicated projects page with filtering and search
- Contact form with validation
- Mobile-first responsive navigation
- Real-time project statistics

### ⚙️ **Tech Stack Detection**
- Automatically identifies technologies from repository data
- Smart framework detection from project names/descriptions
- Dynamic tech badges and categorization

## 🏗️ Architecture

```
orione.uk/
├── index.html              # Homepage with hero, about, experience, contact
├── projects.html            # Dedicated projects showcase page
├── projects.json           # Auto-generated project data
├── sync-projects.js        # GitHub API sync script
├── scripts/
│   ├── main.js            # Homepage functionality
│   └── projects.js        # Projects page functionality
├── styles/
│   └── tailwind.css       # Custom styles and components
├── .github/workflows/
│   └── sync-projects.yml  # Automated sync workflow
└── update-portfolio.*     # Manual update scripts
```

## 🔄 Automation System

### **GitHub Actions Workflow**
- **Daily sync** at 8 AM UTC
- **Manual trigger** via GitHub UI
- **Auto-commit** when changes detected
- **Summary reports** in action logs

### **Manual Update Scripts**
- `update-portfolio.sh` (Linux/macOS)
- `update-portfolio.bat` (Windows)
- `node sync-projects.js` (Direct)

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone https://github.com/miqdad-dev/Portfolio.git
cd Portfolio
npm install  # If using local Tailwind build
```

### 2. Configure for Your Profile
Edit `sync-projects.js`:
```javascript
const CONFIG = {
    username: 'your-github-username',  // Change this
    outputFile: 'projects.json',
    excludeRepos: ['Portfolio'],       // Repos to skip
    // ... other config
};
```

### 3. Initial Sync
```bash
node sync-projects.js
```

### 4. Deploy
- **GitHub Pages**: Enable in repository settings
- **Netlify**: Connect GitHub repo
- **Vercel**: Import from GitHub

## 🔧 Configuration

### Project Filtering
```javascript
// In sync-projects.js
const CONFIG = {
    excludeForks: true,          // Skip forked repos
    minStars: 0,                 // Minimum stars required
    excludeRepos: ['Portfolio'], // Specific repos to exclude
};
```

### Tech Stack Detection
The system automatically detects:
- **Languages**: From GitHub API
- **Frameworks**: React, Vue, FastAPI, etc.
- **Tools**: Docker, AWS, databases
- **Topics**: From repository topics

### Customization
- **Colors**: Edit Tailwind config in HTML
- **Animations**: Modify CSS animations
- **Layout**: Update HTML structure
- **Content**: Edit section text and copy

## 📊 Project Data Structure

```json
{
  "lastUpdated": "2025-01-20T12:00:00.000Z",
  "totalProjects": 15,
  "projects": [
    {
      "id": 123456,
      "title": "Project Name",
      "description": "Project description",
      "tech": ["Python", "FastAPI", "ML"],
      "github": "https://github.com/user/repo",
      "demo": "https://demo.example.com",
      "language": "Python",
      "stars": 5,
      "featured": true,
      "created": "2025-01-01T00:00:00Z",
      "updated": "2025-01-20T00:00:00Z"
    }
  ]
}
```

## 🎯 Pages Overview

### **Homepage (`index.html`)**
- Hero section with introduction
- About section with skills and profile image
- Project preview (top 3 projects)
- Experience timeline
- Contact form and information

### **Projects Page (`projects.html`)**
- All projects with search and filtering
- Sort by date, name, or stars
- Tech stack badges and categories
- GitHub and demo links

## 🔐 Security & Performance

- **No API keys required** (uses public GitHub API)
- **Rate limiting handled** with proper delays
- **Error handling** and fallback data
- **Responsive images** and optimized loading
- **SEO optimized** with meta tags and structured data

## 🛠️ Development

### Local Development
```bash
# Start local server
python -m http.server 8000
# or
live-server .
```

### Update Projects
```bash
# Manual sync
npm run sync  # or node sync-projects.js

# Automated sync (Linux/macOS)
./update-portfolio.sh

# Automated sync (Windows)
update-portfolio.bat
```

### Build Process
```bash
# Build Tailwind (if using local build)
npx tailwindcss -i styles/tailwind.css -o styles/output.css --minify
```

## 📈 Analytics & Tracking

Add analytics by including scripts in HTML:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

<!-- Plausible Analytics -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🌟 Acknowledgments

- **TailwindCSS** for the utility-first CSS framework
- **GitHub API** for project data
- **GitHub Actions** for automation
- **Vercel/Netlify** for hosting solutions

---

<div align="center">

**Built with ❤️ by [Miqdad Issa](https://github.com/miqdad-dev)**

[🌐 Live Site](https://miqdad-dev.github.io/Portfolio/) • [📧 Contact](mailto:issa@orione.uk) • [💼 LinkedIn](https://www.linkedin.com/in/miqdad-issa-912166192/)

</div>