# Bus Realtime Info (Bus ETA)

A modern Progressive Web App (PWA) for checking real-time bus arrival times (ETA) for Hong Kong bus services. Built with SvelteKit, this application provides a fast and user-friendly interface to browse routes, view stops, and check bus arrival times from multiple bus companies.

## Features

- 🚌 **Multi-Company Support**: Browse routes from CTB (Citybus), KMB, and NWFB
- 🔍 **Route Search**: Quickly find bus routes with real-time filtering
- 📍 **Stop Information**: View detailed stop information and real-time ETA
- ⏱️ **Auto-Refresh**: ETA data automatically refreshes every 10 seconds
- ⭐ **Favorites**: Save your frequently used stops for quick access
- 🔄 **Direction Switching**: Switch between inbound and outbound directions
- 📱 **PWA Support**: Install as a mobile app with offline capabilities
- ⚡ **Performance Optimized**: Virtual scrolling for smooth performance with large route lists
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS

## Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with Svelte 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) (formerly React Query)
- **Virtualization**: [TanStack Virtual](https://tanstack.com/virtual/latest)
- **HTTP Client**: Axios
- **Date Formatting**: date-fns
- **PWA**: Workbox
- **Deployment**: Netlify (Edge Functions)

## Data Sources

The application fetches real-time bus data from official Hong Kong government APIs:

- **CTB/Citybus**: `https://rt.data.gov.hk/v2/transport/citybus`
- **KMB**: `https://data.etabus.gov.hk/v1/transport/kmb`

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bus-realtime-info
```

2. Install dependencies:
```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm run dev
```

The app will open automatically in your browser at `http://localhost:5173`.

### Building

Build the production version:

```bash
pnpm run build
```

Preview the production build:

```bash
pnpm run preview
```

### Code Quality

Check TypeScript types:

```bash
pnpm run check
```

Lint code:

```bash
pnpm run lint
```

Format code:

```bash
pnpm run format
```

## Project Structure

```
src/
├── app.html              # HTML template
├── routes/               # SvelteKit routes
│   ├── +page.svelte      # Home page (route list)
│   ├── favorites/        # Favorites page
│   └── [companyId]/      # Dynamic routes
│       └── route/
│           └── [route]/
│               ├── +page.svelte        # Route detail page
│               └── stop/
│                   └── [stopId]/
│                       └── +page.svelte # Stop detail page
├── lib/
│   ├── api/              # API clients
│   │   ├── ctb/          # Citybus API
│   │   ├── kmb/          # KMB API
│   │   └── common/       # Shared API types
│   ├── components/       # Reusable Svelte components
│   ├── stores/           # Svelte stores (favorites)
│   └── utils/            # Utility functions (ETA formatting)
└── service-worker.ts     # PWA service worker
```

## Key Features Explained

### Route Browsing
- Browse all available routes from supported bus companies
- Search/filter routes by route number
- Virtual scrolling for optimal performance with large lists

### Stop Details
- View all stops along a route
- See real-time ETA for each stop
- Switch between inbound and outbound directions

### ETA Display
- Shows arrival time in minutes for buses arriving in more than 1 minute
- Displays "即將到達" (Arriving Soon) for buses arriving within 1 minute
- Automatically refreshes every 10 seconds
- Sorted by arrival time

### Favorites
- Save frequently used stops
- Access favorites from the dedicated favorites page
- Favorites are stored in browser local storage
- Filter favorites by route number

## Deployment

The project is configured for deployment on Netlify using the Netlify adapter with Edge Functions enabled.

Build configuration is defined in `netlify.toml`:

```toml
[build]
  command = "pnpm run build"
  publish = "build"
```

## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- PWA installation supported on compatible browsers

## License

This project is private.

## Contributing

This is a private project. Contributions are not currently accepted.

---

Built with ❤️ using SvelteKit
