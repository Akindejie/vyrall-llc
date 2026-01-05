# Event Creation Platform

A beautiful, modern event creation platform built with React, TypeScript, and Tailwind CSS.

## Features

- ✨ Create and customize events with a beautiful UI
- 🖼️ Upload custom flyer and background images
- 📱 Save drafts with phone number
- 🔗 Add custom links to your events
- 👥 Set event capacity
- 📸 Photo gallery support
- 🎨 Customizable modules system
- 💾 Local storage persistence

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Mock API** - Easy-to-replace backend functions

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/              # Mock API functions
│   └── eventApi.ts   # Event CRUD operations
├── components/       # React components
│   ├── modules/      # Customizable event modules
│   ├── BackgroundChanger.tsx
│   ├── CustomizeModal.tsx
│   ├── EventCreationPage.tsx
│   ├── FormInput.tsx
│   ├── ImageUpload.tsx
│   └── QuickLinkButton.tsx
├── store/            # Zustand state management
│   └── eventStore.ts # Main event store
├── types/            # TypeScript type definitions
│   ├── api.types.ts
│   └── event.types.ts
├── App.tsx           # Root component
├── main.tsx          # Entry point
└── index.css         # Global styles with Tailwind

```

## Connecting to Real Backend

The project uses mock API functions that store data in localStorage. To connect to a real backend:

1. Update the API functions in `src/api/eventApi.ts`
2. Uncomment and set the `BASE_URL` constant
3. Replace mock implementations with actual `fetch` calls
4. Add authentication headers if needed

Example:

```typescript
// Before (mock)
export const saveEventDraft = async (eventData: EventFormData) => {
  await delay(MOCK_DELAY);
  // ... localStorage logic
};

// After (real API)
export const saveEventDraft = async (eventData: EventFormData) => {
  const response = await fetch(`${BASE_URL}/events`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(eventData),
  });
  return response.json();
};
```

## State Management

The app uses Zustand for state management with the following features:

- ✅ Automatic localStorage persistence
- ✅ DevTools integration
- ✅ Type-safe actions and state
- ✅ Optimistic updates

Access the store in any component:

```typescript
import { useEventStore } from '../store/eventStore';

function MyComponent() {
  const { currentEvent, updateEventField } = useEventStore();
  // ...
}
```

## Customizable Modules

The quick-links system allows adding customizable modules to events. Each module:

- Has a unique type identifier
- Can be toggled on/off
- Stores its own configuration
- Renders custom UI when active

To add a new module:

1. Add the type to `ModuleType` in `types/event.types.ts`
2. Create a component in `components/modules/`
3. Add the module definition to the modules list
4. Handle the module in the event creation page

## Design Decisions

- **Top-to-bottom flow**: Form follows a vertical layout as per design requirements
- **Desktop-first**: Optimized for desktop viewing (responsive design can be added later)
- **Glassmorphism**: Subtle backdrop blur and transparency effects
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Performance**: Optimized re-renders with Zustand selectors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - All rights reserved

## Support

For questions or issues, please contact the development team.
