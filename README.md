# 🪔 শ্রীমদ্ভগবদ্গীতা যথাযথ | Śrīmad Bhagavad Gītā As It Is

<p align="center">
  <img src="assets/logo.png" alt="Bhagavad Gita Logo" width="120" style="border-radius: 50%; shadow: 0 4px 15px rgba(0,0,0,0.2);"/>
</p>

<p align="center">
  <b>An Interactive, Bilingual & Customisable Web Reader for Śrīmad Bhagavad Gītā</b>
</p>

<p align="center">
  <a href="http://rantu.me/e-Gita/"><img src="https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=github&logoColor=white" alt="Live Demo"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Languages-Bengali%20|%20English%20|%20Sanskrit-gold?style=for-the-badge" alt="Languages"></a>
  <a href="#-license"><img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License"></a>
  <img src="https://img.shields.io/badge/PRs-welcome-orange?style=for-the-badge" alt="PRs Welcome">
</p>

<blockquote align="center">
  <i>"हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥"</i>
</blockquote>

---

## 📜 Table of Contents
- [✨ Overview](#-overview)
- [🌟 Key Features](#-key-features)
- [🖥️ Reading Layout Modes](#️-reading-layout-modes)
- [⚡ Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start & Local Setup](#-quick-start--local-setup)
- [🔌 API & Data Architecture](#-api--data-architecture)
- [🎨 Design & Aesthetics](#-design--aesthetics)
- [👤 Author & Acknowledgments](#-author--acknowledgments)

---

## ✨ Overview

**Bhagavad Gita As It Is** (শ্রীমদ্ভগবদ্গীতা যথাযথ) is a lightweight, zero-dependency, highly interactive web platform built to read, study, and contemplate the sacred verses of the Bhagavad Gita. Designed with a traditional parchment theme and modern responsive UI capabilities, it offers seamless translation switching (Bengali & English), Devanagari Sanskrit scripts, word-for-word synonyms, transliteration (IAST), and detailed purports.

Data is fetched dynamically from a high-performance **Google Apps Script backend API**, enabling real-time updates without redeploying frontend assets.

---

## 🌟 Key Features

- 🌐 **Instant Bilingual Toggle**: Switch effortlessly between Bengali (**বাংলা**) and **English** with full UI and content adaptation.
- 🪶 **3 Flexible Reading Layout Modes**:
  - **Default View**: Minimalistic view showing transliteration and main translation.
  - **Advanced View**: Granular control panel to toggle individual fields (Sanskrit, Synonyms, Purport, Gita Songs, etc.).
  - **Dual Language View**: Side-by-side comparative column reading of Bengali and English simultaneously.
- 🎯 **Smart Jump & Search Filters**: Direct navigation to any specific chapter or verse directly from index or chapter headers.
- 🛞 **3D Chariot Wheel Loader**: A custom CSS/SVG animated 24-spoke wheel inspired by Vedic heritage and Ashoka Chakra with a golden shimmering divine glow overlay.
- 🎨 **Sacred Artworks PDF Integration**: Embedded responsive Google Docs PDF viewer to explore authentic Bhagavad Gita original paintings (`arts.pdf`).
- 📱 **Mobile-First & Touch Optimised**: Native back-button history integration (`popstate`), Backspace hotkey desktop support, and dynamic viewport scaling.
- 🔤 **Authentic Sacred Typography**: Automatic dynamic switching between *Kalpurush* (Bengali), *Tiro Devanagari Sanskrit*, *Noto Serif*, and *Cinzel/Garamond*.

---

## 🖥️ Reading Layout Modes

<details>
<summary><b>1. 📖 Standard / Default View (সাধারণ)</b></summary>
<p>Provides a clean, distraction-free reading experience focusing primarily on scriptural transliteration and clear verse translations.</p>
</details>

<details>
<summary><b>2. ⚙️ Advanced View (বিস্তারিত)</b></summary>
<p>Offers interactive checkboxes to dynamically customize displayed commentary sections:</p>
<ul>
  <li><b>সংষ্কৃতম্</b> (Sanskrit Devanagari text)</li>
  <li><b>বাংলা বর্ণান্তর / IAST</b> (Phonetic Transliteration)</li>
  <li><b>শব্দার্থ / Synonyms</b> (Word-by-word breakups)</li>
  <li><b>অনুবাদ / Translation</b></li>
  <li><b>তাৎপর্য / Purport</b> (In-depth commentary)</li>
  <li><b>গীতার গান</b> (Devotional poetic verse)</li>
</ul>
</details>

<details>
<summary><b>3. ☯️ Dual Language View (দ্বৈত ভাষা)</b></summary>
<p>Displays Bengali and English commentary side-by-side in parallel columns, allowing scholars and devotees to compare translations in real-time.</p>
</details>

---

## ⚡ Tech Stack

| Domain | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | Vanilla JavaScript (ES6+) | No heavy frameworks; high performance state management & DOM manipulation |
| **Styling** | Custom CSS3 | CSS Variables, Paged Media principles, Custom 3D Keyframe Animations |
| **Backend / API** | Google Apps Script | RESTful JSON API endpoint parsing Google Sheets data sources |
| **Fonts** | Google Fonts + Web Fonts | Kalpurush, Tiro Devanagari Sanskrit, Cinzel, Garamond |
| **PDF Rendering** | Google Docs Viewer | Embedded iframe integration for authentic artworks |

---

## 📁 Project Structure

```strings
e-Gita/
├── 📄 index.html          # Main HTML structure with semantic tags & loader overlay
├── 🎨 style.css           # Complete design system, 3D chariot loader & responsive rules
├── ⚙️ script.js           # Dynamic data fetching, state management, dual-language logic
├── 📁 assets/             # Brand logos, original artwork PDFs & font files
│   ├── logo.png           # Repository logo & favicon
│   ├── arts.pdf           # Original Bhagavad Gita artwork illustrations
│   └── kalpurush.ttf      # Local fallback TTF font for Bengali typography
└── 📄 README.md           # Project documentation
```

---

## 🚀 Quick Start & Local Setup

No build step or Node.js environment is required. Simply run the project locally using any web server.

### 1. Clone the repository
```bash
git clone https://github.com/rantusamadder/e-Gita.git
cd e-Gita
```

### 2. Run locally
- Open `index.html` directly in your browser.
- **OR** use VS Code Live Server extension / Python HTTP server:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

---

## 🔌 API & Data Architecture

The application consumes dynamic payload structures directly from a deployed Google Apps Script macro:

```javascript
const API_URL = 'https://script.google.com/macros/s/.../exec';
```

### Data Schema Overview:
- **`সূচীপত্র` (Index)**: Contains metadata, chapter titles, English/Bengali names, and chapter descriptions.
- **`chapters` (Verses)**: Arrays containing verse cards with keys like `সংষ্কৃতম্`, `IAST`, `শব্দার্থ`, `Translation`, `Purport`, etc.
- **Special Pages**: Dedicated views for Introduction (`ভূমিকা`), Preface (`মুখবন্ধ`), Author Profile (`গ্রন্থকারের পরিচিতি`), and Artwork Gallery (`মূল চিত্রসমূহ`).

---

## 🎨 Design & Aesthetics

The UI follows classic Vedic book aesthetic principles:
- **Palette**: Warm divine cream (`#efe3c2`), deep dark mahogany (`#5a3515`), and golden accents (`#b8860b`).
- **Loader**: 24-spoked 3D revolving wheel with radial divine halo (`.divine-halo`) and shimmering text transitions (`textShimmer`).
- **Typography**: Explicit script scoping to guarantee Devanagari renders in authentic Devanagari typefaces regardless of active locale settings.

---

## 👤 Author & Acknowledgments

- **Author / Developer**: [Rantu Samadder](https://github.com/rantusamadder)
- **Inspiration & Content**: Based on *Śrīmad Bhagavad Gītā As It Is* by His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda (ISKCON).

---

<p align="center">
  <b>जय श्री कृष्ण | Hare Krishna</b>
</p>
