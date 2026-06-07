# Letter Builder — نامه‌ساز

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

<p align="center">
  A free, fully client-side web app for designing and exporting professional corporate letters in <strong>Persian (RTL)</strong> and <strong>English (LTR)</strong>.<br/>
  No backend. No sign-up. Everything runs in the browser.
</p>

<p align="center">
  <a href="https://alirewa.github.io/Letter-Builder/"><strong>🌐 Live Demo</strong></a>
</p>

---

## Features

| | |
|---|---|
| 📄 **Live A4 Preview** | Every change reflects instantly on the page |
| 📥 **PDF Export** | High-quality output with correct Persian font rendering |
| 🔄 **RTL ↔ LTR Toggle** | Full direction switch — layout, labels and alignment all reverse |
| 🖼️ **Logo Upload** | Drag-and-drop (JPG, PNG, WebP, SVG — max 2 MB) |
| ✍️ **Rich Text Editor** | Bold, italic, underline, headings, lists, tables, images, text color |
| 📅 **Jalali Date Picker** | Shamsi calendar for Persian letters |
| 📂 **Template System** | Save / load / delete letter templates stored in the browser |
| 💾 **JSON Import / Export** | Transfer all settings between devices |
| 🌙 **Dark / Light Mode** | Full theme support |
| 🔢 **Auto Letter Number** | Jalali year + auto-incrementing counter (`1405/آ/01`) |

---

## Getting Started

```bash
git clone https://github.com/Alirewa/Letter-Builder.git
cd Letter-Builder-Fa
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** The app uses **B Nazanin** for Persian text. Place `BNazanin.ttf` and `BNazaninBold.ttf` in `public/fonts/` — this font is not redistributable and must be obtained separately.

---

## Build & Deploy

```bash
npm run build   # outputs to /out — ready for any static host
```

GitHub Pages deploys automatically via the included Actions workflow on every push to `master`.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 16 (static export) | Framework |
| React 19 + TypeScript 5 | UI & type safety |
| Tailwind CSS v4 | Styling |
| Zustand 5 | State management with localStorage persistence |
| TipTap | Rich text editor |
| react-multi-date-picker | Jalali calendar |
| html2canvas + jsPDF | PDF generation |

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.

---

<p align="center">
  Designed & built by <a href="https://github.com/Alirewa">@Alirewa</a>
</p>
