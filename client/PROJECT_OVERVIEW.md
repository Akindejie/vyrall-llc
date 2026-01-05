# Vyrall LLC - Frontend Project Overview

## 1. Project Purpose

A high-fidelity, glossy event creation platform called **"Let's Hang"**. The application allows users to design, customize, and publish event pages with a premium, mobile-responsive "Glassmorphism" aesthetic.

## 2. Tech Stack

- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom "Glass" utility classes)
- **State Management**: Zustand (`eventStore`)
- **Icons**: Inline SVGs (for pixel-perfect control) and Emojis
- **External APIs**:
  - `Nominatim (OpenStreetMap)`: Location Autocomplete
  - `open.er-api.com`: Currency Exchange Rates

## 3. Key Components (The "Glassy" System)

### Core UI

- **EventCreationPage**: The main orchestrator. Handles layout, state, and module rendering.
- **CustomizeModal**: The "Control Center". A detailed modal where users toggle features (Guest List, Photos, etc.) on/off.
- **StatusModal**: Provides glossy feedback (Success/Error) during the publishing flow.

### Custom Inputs

- **GlossyDatePicker**: A custom-built calendar and time selector with proper z-index layering and glass styling.
- **LocationAutocomplete**: Real-time search for global locations with debouncing.
- **CurrencyInput**: Cost input with dynamic currency symbol detection (detects $, €, £, etc. automatically).

### Feature Modules

Each feature is a standalone "Module" that can be toggled via the `CustomizeModal`:

- **CapacityModule**: Manage guest limits.
- **LinksModule**: Add external links (Ticketmaster, Maps, etc.).
- **PhotoGalleryModule**: Upload grid for multiple event photos.
- **PrivacyModule**: Toggle public/private visibility and approval settings.
- **AnnouncementsModule**: Broadcast updates to guests.

## 4. Design System ("Glassmorphism")

The project strictly adheres to a premium dark-glass aesthetic:

- **Backgrounds**: `bg-black/20`, `bg-white/10`
- **Blur**: `backdrop-blur-xl`, `backdrop-blur-sm`
- **Borders**: Subtle white borders (`border-white/20`) to define edges without heaviness.
- **Typography**: Large, bold headings (`text-4xl`) with transparent placeholders.

## 5. State Management Flow

1.  **Event Store**: Holds the `currentEvent` object.
2.  **Toggle Action**: `CustomizeModal` dispatches toggle actions.
3.  **View Update**: `EventCreationPage` reacts to state changes and conditionally renders the corresponding Module.
4.  **Publish**: Validates required fields -> Shows `StatusModal` -> Resets state on success.
