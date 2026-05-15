<div dir="rtl">

# نامه‌ساز اختصاصی

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

<p align="center">
  یک وب‌اپلیکیشن رایگان و کاملاً کلاینت‌ساید برای طراحی و دانلود نامه‌های اداری حرفه‌ای به زبان فارسی و انگلیسی — بدون هیچ نیازی به بک‌اند یا ثبت‌نام.
</p>

---

## ویژگی‌ها

- **پیش‌نمایش زنده A4** — هر تغییری بلادرنگ در سند نمایش داده می‌شود
- **دانلود PDF** — خروجی با کیفیت بالا با فونت‌های فارسی صحیح
- **حالت فارسی / انگلیسی** — سوئیچ RTL ↔ LTR که تمام عناصر صفحه را برعکس می‌کند
- **آپلود لوگو** — بارگذاری تصویر با کشیدن و رها کردن (JPG، PNG، WebP، SVG)
- **ابزار تایپوگرافی** — انتخاب فونت، اندازه، ارتفاع خط و متن Bold
- **سیستم قالب** — ذخیره، بارگذاری و حذف قالب‌های نامه در مرورگر
- **درون‌ریزی / برون‌ریزی JSON** — انتقال آسان تنظیمات بین دستگاه‌ها
- **حالت تاریک / روشن** — تم‌بندی کامل با Tailwind CSS
- **ذخیره خودکار** — وضعیت نامه در localStorage حفظ می‌شود
- **ریسپانسیو** — در موبایل با تب‌های جداگانه، در دسکتاپ با دو ستون

---

## فونت‌های پشتیبانی‌شده

| فونت | کاربرد |
|------|--------|
| **B Nazanin** | متن پیش‌فرض نامه (فارسی) |
| **Vazirmatn** | رابط کاربری کل اپ |
| Tahoma | قابل انتخاب برای متن نامه |
| Arial | قابل انتخاب برای متن نامه |

---

## اجرا در محیط توسعه

```bash
# نصب وابستگی‌ها
npm install

# اجرای سرور توسعه
npm run dev
```

سپس مرورگر را باز کنید: [http://localhost:3000](http://localhost:3000)

> **نکته:** فونت B Nazanin را باید خودتان تهیه کرده و در مسیر `public/fonts/BNazanin.ttf` قرار دهید.

---

## بیلد برای استقرار

```bash
npm run build
```

خروجی استاتیک در پوشه `out/` تولید می‌شود و می‌توانید آن را روی هر هاست استاتیکی (GitHub Pages، Vercel، Netlify و ...) آپلود کنید.

---

## ساختار پروژه

```
src/
├── app/
│   ├── globals.css        # فونت‌ها، متغیرهای CSS، کلاس‌های Tailwind
│   ├── layout.tsx         # Root layout + StoreHydrator
│   └── page.tsx           # صفحه اصلی (دو ستون + موبایل تب‌بار)
├── components/
│   ├── ControlPanel.tsx   # پنل کنترل (تمام فیلدهای ورودی)
│   ├── LetterDocument.tsx # سند نامه (فقط inline style — برای html2canvas)
│   ├── LetterPreview.tsx  # ظرف پیش‌نمایش با زوم واکنش‌گرا
│   ├── Navbar.tsx         # نوار بالا (PDF، قالب‌ها، ریست)
│   ├── TemplatesPanel.tsx # پانل کشویی قالب‌ها + JSON import/export
│   ├── layout/
│   │   └── StoreHydrator.tsx
│   └── ui/
│       └── SectionCard.tsx
├── hooks/
│   ├── useDarkMode.ts     # مدیریت تم تاریک/روشن
│   └── usePreviewScale.ts # محاسبه زوم بدون لرزش
├── lib/
│   ├── pdfExport.ts       # html2canvas + jsPDF
│   └── utils.ts           # توابع کمکی (cn، تاریخ جلالی، و ...)
├── store/
│   └── letterStore.ts     # Zustand store با persist
└── types/
    └── letter.ts          # تایپ‌های TypeScript + مقادیر پیش‌فرض
```

---

## تکنولوژی‌ها

| ابزار | نسخه | کاربرد |
|-------|------|--------|
| Next.js | 16.2.6 | فریمورک (static export) |
| React | 19 | رابط کاربری |
| TypeScript | 5 | تایپ‌گذاری ایستا |
| Tailwind CSS | v4 | استایل‌دهی |
| Zustand | 5 | مدیریت state |
| html2canvas | 1.4.1 | رندر HTML به canvas |
| jsPDF | 4.2.1 | تولید فایل PDF |
| lucide-react | latest | آیکون‌ها |

---

## مجوز

این پروژه تحت مجوز [MIT](LICENSE) منتشر شده است.

---

<p align="center">
  طراحی شده با ❤️ توسط <a href="https://github.com/Alirewa">@alirewa</a>
</p>

</div>

---
---

<div dir="ltr">

# Letter Builder Fa — Persian Corporate Letter Generator

<p align="center">
  A free, fully client-side web app for designing and exporting professional corporate letters in Farsi (Persian) and English — no backend, no sign-up required.
</p>

---

## Features

- **Live A4 Preview** — Every change is reflected instantly in the document
- **PDF Download** — High-quality output with correct Persian font rendering
- **RTL ↔ LTR Toggle** — Switch between Persian and English layouts; all element positions reverse automatically
- **Logo Upload** — Drag-and-drop image upload (JPG, PNG, WebP, SVG, max 2 MB)
- **Typography Toolbar** — Font family, font size, line height, and inline **bold** via `**text**` markdown
- **Template System** — Save, load, and delete letter templates stored in the browser
- **JSON Import / Export** — Easily transfer settings between devices
- **Dark / Light Mode** — Full theme support via Tailwind CSS class strategy
- **Auto-save** — Letter state is persisted in `localStorage` automatically
- **Responsive** — Tab-based layout on mobile; two-column layout on desktop

---

## Supported Fonts

| Font | Usage |
|------|-------|
| **B Nazanin** | Default letter body font (Persian) |
| **Vazirmatn** | App UI font (bundled locally) |
| Tahoma | Selectable for letter body |
| Arial | Selectable for letter body |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** You must supply the B Nazanin font yourself and place it at `public/fonts/BNazanin.ttf` (it is not redistributable).

---

## Production Build

```bash
npm run build
```

A fully static site is exported to the `out/` folder. Deploy it to any static host — GitHub Pages, Vercel, Netlify, etc.

---

## Project Structure

```
src/
├── app/
│   ├── globals.css        # Fonts, CSS variables, Tailwind component classes
│   ├── layout.tsx         # Root layout + StoreHydrator
│   └── page.tsx           # Main page (two-column + mobile tab bar)
├── components/
│   ├── ControlPanel.tsx   # All input fields (sidebar)
│   ├── LetterDocument.tsx # Letter document (inline styles only — required for html2canvas)
│   ├── LetterPreview.tsx  # Preview container with responsive zoom
│   ├── Navbar.tsx         # Top bar (PDF export, templates, reset)
│   ├── TemplatesPanel.tsx # Slide-in templates drawer + JSON import/export
│   ├── layout/
│   │   └── StoreHydrator.tsx
│   └── ui/
│       └── SectionCard.tsx
├── hooks/
│   ├── useDarkMode.ts     # Dark/light theme management
│   └── usePreviewScale.ts # Flicker-free A4 zoom calculation
├── lib/
│   ├── pdfExport.ts       # html2canvas + jsPDF (off-screen clone approach)
│   └── utils.ts           # Helpers: cn, Jalali date, contrast color, etc.
├── store/
│   └── letterStore.ts     # Zustand store with localStorage persistence
└── types/
    └── letter.ts          # TypeScript types + default state
```

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 16.2.6 | Framework (static export) |
| React | 19 | UI rendering |
| TypeScript | 5 | Static typing |
| Tailwind CSS | v4 | Styling |
| Zustand | 5 | State management |
| html2canvas | 1.4.1 | Render DOM to canvas |
| jsPDF | 4.2.1 | Generate PDF from canvas |
| lucide-react | latest | Icons |

---

## How the PDF Export Works

1. Clone `#letter-print-root` into an off-screen fixed container (bypasses `zoom: scale` parent transforms)
2. Wait for `document.fonts.ready` + two `requestAnimationFrame` ticks
3. Capture with `html2canvas` at `scale: 3` for crisp output
4. Slice into A4 pages if the content is taller than 297 mm
5. Save via `jsPDF` as `نامه-{letterNumber}.pdf`

---

## License

Released under the [MIT](LICENSE) License.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Alirewa">@alirewa</a>
</p>

</div>
