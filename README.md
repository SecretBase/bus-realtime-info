# Bus Realtime Info (Bus ETA)

A modern Progressive Web App (PWA) for checking real-time bus arrival times (ETA) for Hong Kong bus services. Built with SvelteKit, this application provides a fast and user-friendly interface to browse routes, view stops, and check bus arrival times from multiple bus companies.

## Features

- 🚌 **Multi-Company Support**: Browse routes from CTB (Citybus), KMB, and NWFB
- 🚇 **MTR arrivals**: Look up Hong Kong MTR line/station ETAs on the same site
- 💰 **Fares**: Adult (and concession, where published) fares on bus route/stop pages and MTR station pages
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

The application fetches real-time data from official Hong Kong government / MTR APIs. No API keys or environment variables are required.

- **CTB/Citybus**: `https://rt.data.gov.hk/v2/transport/citybus`
- **KMB**: `https://data.etabus.gov.hk/v1/transport/kmb`
- **MTR Next Train**: `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php` (official [DATA.GOV.HK](https://data.gov.hk/en-data/dataset/mtr-data2-nexttrain-data) feed; spec: [Next Train API v1.7](https://opendata.mtr.com.hk/doc/Next_Train_API_Spec_v1.7.pdf)). Query with `line` + `sta` (optional `lang=TC|EN`). Covers heavy-rail lines including Disneyland Resort Line. Light Rail is not included.
- **Bus fares**: Transport Department [Routes and fares of public transport (XML)](https://data.gov.hk/en-data/dataset/hk-td-tis_14-routes-fares-xml) — `https://static.data.gov.hk/td/routes-fares-xml/ROUTE_BUS.xml` (`FULL_FARE` adult full-journey fare for KMB / Citybus / joint-operated routes). No env vars. Section fares are not shown.
- **MTR fares**: Official MTR open data ([DATA.GOV.HK — MTR routes, fares and barrier-free facilities](https://data.gov.hk/en-data/dataset/mtr-data-routes-fares-barrier-free-facilities)):
  - Heavy rail: `https://opendata.mtr.com.hk/data/mtr_lines_fares.csv` (adult / student / child / elderly / PWD / JoyYou Octopus)
  - Airport Express: `https://opendata.mtr.com.hk/data/airport_express_fares.csv` (adult / child Octopus; airport & AsiaWorld-Expo pairs only)
  - These CSVs have no CORS headers, so the app loads them through `/api/fare/mtr?file=…` (allowlisted proxy, no API key). Light Rail is not included.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.3 or higher)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd bus-realtime-info
```

2. Install dependencies:

```bash
bun install
```

### Development

Start the development server:

```bash
bun run dev
```

The app will open automatically in your browser at `http://localhost:5173`.

### Building

Build the production version:

```bash
bun run build
```

Preview the production build:

```bash
bun run preview
```

### Code Quality

Check TypeScript types:

```bash
bun run check
```

Lint code:

```bash
bun run lint
```

Format code:

```bash
bun run format
```

## Project Structure

```
src/
├── app.html              # HTML template
├── routes/               # SvelteKit routes
│   ├── +page.svelte      # Home page (route list)
│   ├── favorites/        # Favorites page
│   ├── mtr/              # MTR lines, stations, and live ETA
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
- Switch to **港鐵 / MTR** on the home page or footer to browse lines, search stations, and view live train arrivals (refreshes every 10 seconds)

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
  command = "bun run build"
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
