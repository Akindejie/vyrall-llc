# Let's Hang - Event Creation Platform

A premium, glassmorphism-styled event creation interface built with **React**, **TypeScript**, and **Tailwind CSS**.

## ✨ Key Features

- **Glassy UI**: A fully custom design system using backdrop blurs (`backdrop-blur-xl`), semi-transparent layers, and subtle borders.
- **Modular Architecture**: Features like **Guest Lists**, **Photo Galleries**, and **Announcements** are modular "apps" that can be toggled on/off via the **Customize Modal**.
- **Smart Inputs**:
  - **GlossyDatePicker**: Custom calendar/time picker (No native browser inputs).
  - **LocationAutocomplete**: Integrated with OpenStreetMap for real-time suggestions.
  - **CurrencyInput**: Auto-detects currency symbols based on selection.
- **Validation**: Robust "Go Live" flow with a glossy **Status Modal** for errors and success messages.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

### Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build

Create a production build:

```bash
npm run build
```

## 📂 Project Structure

- `src/components/`: Core UI components (`EventCreationPage`, `CustomizeModal`, `StatusModal`).
- `src/components/modules/`: Individual feature modules (`Capacity`, `Links`, `PhotoGallery`, etc.).
- `src/store/`: Zustand state management for the event data.
- `src/types/`: TypeScript definitions (`EventFormData`, `ModuleType`).
