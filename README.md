# 🧑‍💻 Responsive Admin Dashboard

A modern and responsive **Admin Dashboard** built using:

- ⚛️ **React 18 + TypeScript**
- 💨 **Tailwind CSS (v4.1)** for utility-first styling
- 🎨 **ShadCN UI components** for accessible design
- 📈 **Recharts** for dynamic data visualization
- 💥 **GSAP (GreenSock)** for animations

This dashboard is **mobile-first**, **theme-aware** (light/dark), and optimized with container-based layouts for scalability and responsiveness.

---

## 🚀 How to Run This Project

Follow these steps to set up and run the project locally:- 

1. Install packages
```
npm install
```

2. Start your local server
```
npm run dev
```

---

## 🎨 Color Scheme

The application uses custom CSS variables with the **OKLCH color model** for better visual consistency and theme adaptability. All color tokens adjust automatically in dark mode using the `.dark` class.

### ✅ Primary Custom Colors

| Name        | Variable         | Light Mode                  | Dark Mode                      | Description                        |
|-------------|------------------|-----------------------------|----------------------------------|------------------------------------|
| Primary     | `--primary`      | `oklch(0.6478 0.1348 160.34)` | `oklch(0.922 0 0)`               | Primary brand green                |
| Secondary   | `--secondary`    | `oklch(0.5696 0.1178 160.23)` | `oklch(0.269 0 0)`               | Secondary green                    |
| Destructive | `--destructive`  | `oklch(0.577 0.245 27.325)`   | `oklch(0.704 0.191 22.216)`      | Destructive (error/danger) state  |
| Background  | `--background`   | `oklch(0.964 0.0132 159.92)`  | `oklch(0.145 0 0)`               | Page background                    |
| Foreground  | `--foreground`   | `oklch(0.2784 0.0335 257.67)` | `oklch(0.985 0 0)`               | Primary text color                 |
| Card        | `--card`         | `oklch(1 0 0)`               | `oklch(0.205 0 0)`               | Card background                    |
| Border      | `--border`       | `oklch(0.922 0 0)`           | `oklch(1 0 0 / 10%)`             | Border color                       |
| Chart Colors| `--chart-1` to `--chart-5` | Various OKLCH hues         | Theme-adjusted values           | Used for chart gradients           |

> 💡 All colors are managed via CSS variables and updated with `.dark` theme switch.

---

## 🔠 Typography

- **Font Family**: `Lexend Deca`
- **Source**: [Google Fonts](https://fonts.google.com/specimen/Lexend+Deca)
- **Font Weights**: `100 – 900`
- **Applied Globally**:
  ```css
  body {
    font-family: 'Lexend Deca', sans-serif;
  }
  ```

---

## 📐 Spacing & Sizing

- **Base Unit**: Tailwind’s default 4px scale (`space-1` = `0.25rem`)
- **Spacing**: Inherited from Tailwind and used via ShadCN UI
- **Card Border Radius**: Controlled via CSS custom props:
  ```css
  --radius: 0.625rem; /* 10px */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  ```

---

## 📱 Breakpoints

Tailwind CSS handles responsiveness using its standard breakpoints:

| Breakpoint | Prefix | Min Width |
|------------|--------|-----------|
| `sm`       | `sm:`  | `640px`   |
| `md`       | `md:`  | `768px`   |
| `lg`       | `lg:`  | `1024px`  |
| `xl`       | `xl:`  | `1280px`  |
| `2xl`      | `2xl:` | `1536px`  |

> ✅ Also uses container queries like `@container/card` and grid utilities like `@xl/main`, `@5xl/main` for advanced responsiveness.

---

## 🎞️ Animations

- **Library Used**: [GSAP (GreenSock Animation Platform)](https://gsap.com/)
- **Usage**: Applied to table cell components for smooth animated transitions.
- **Additional Support**: Included `tw-animate-css` for global animation classes.

---

## 🧰 Tech Stack Summary

| Category          | Stack                              |
|-------------------|-------------------------------------|
| **Framework**     | React 18 + TypeScript               |
| **Styling**       | Tailwind CSS (v4.1) + ShadCN UI     |
| **Charting**      | Recharts (OKLCH-based theming)      |
| **Animations**    | GSAP + `tw-animate-css`             |
| **Routing/State** | React Router / Zustand / Redux (as needed) |
| **Responsiveness**| Mobile-first + container queries    |
| **Project Type**  | Admin Dashboard                     |

---

