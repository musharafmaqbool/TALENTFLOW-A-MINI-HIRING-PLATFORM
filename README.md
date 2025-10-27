# TalentFlow - Modern Hiring Platform

Hey there! 👋 Welcome to TalentFlow - a sleek, modern hiring platform I built to help HR teams manage their recruitment process more efficiently.

## What's This All About?

TalentFlow is a web application that makes hiring easier. It's packed with features that let HR teams:
- Create and manage job postings (with drag-and-drop reordering!)
- Track candidates as they move through different stages
- Build custom assessments for each position
- Keep everything organized in one beautiful interface

I built this using React and some really cool modern web technologies. Everything runs in your browser - no backend servers needed!

## The Cool Tech Stuff

Here's what powers TalentFlow:

- **React 18** - For the super smooth UI
- **JavaScript (ES6+)** - Keeping it simple, no TypeScript
- **Vite** - Lightning-fast development server
- **TailwindCSS** - For that modern, polished look
- **Dexie.js** - Stores everything locally in your browser (using IndexedDB)
- **MSW (Mock Service Worker)** - Simulates a real API with network delays and everything
- **@dnd-kit** - Makes drag-and-drop feel buttery smooth
- **@tanstack/react-virtual** - Handles thousands of candidates without breaking a sweat

## Quick Start

Want to try it out? It's super easy:

```bash
# First, grab the dependencies
npm install

# Fire up the dev server
npm run dev

# Open your browser to http://localhost:3000
```

That's it! The app will automatically seed itself with:
- 25 sample jobs (mix of active, draft, and archived)
- 50 candidates at various stages
- 3 pre-built assessments

Everything persists in your browser, so you won't lose your data when you refresh!

## Features I'm Proud Of

### 📋 Jobs Management
- Create, edit, and archive job postings
- Drag and drop to reorder (because clicking arrows is so 2010)
- Filter by status, search by title, or filter by tags
- Each job gets a unique slug URL

### 👥 Candidate Tracking
- See all candidates in a clean, filterable list
- View detailed profiles with application timelines
- Drag candidates between stages on a Kanban board
- Search by name or email
- Handles lots of candidates smoothly (thanks to virtualization!)

### 📝 Assessment Builder
- Create custom assessments for any job
- Multiple question types: multiple choice, text, numeric, file upload
- Organize questions into sections
- Set up conditional questions based on previous answers
- Preview before publishing

## The Little Details

I added some nice touches to make it feel polished:

- **Smart API Simulation**: MSW adds realistic network delays (200-1200ms) and even simulates occasional errors (just like a real API!)
- **Optimistic Loading**: The UI shows up fast, data loads in the background
- **Error Handling**: Retry buttons everywhere - because things fail sometimes
- **Modern Design**: Glassmorphism effects, smooth animations, gradient accents
- **Responsive**: Works great on any screen size

## Project Structure

Here's how everything is organized:

```
src/
├── components/          # All the React components
│   ├── ui/             # Reusable UI components (buttons, inputs, etc.)
│   ├── jobs/           # Job-related components
│   ├── candidates/     # Candidate management
│   └── assessments/    # Assessment builder
├── db/                 # Database setup and seeding
│   ├── index.js       # Dexie configuration
│   ├── seed.js        # Sample data generator
│   └── healthCheck.js # Verifies data is loaded
├── mocks/             # MSW API handlers
│   ├── browser.js     # MSW setup
│   └── handlers.js    # API endpoint definitions
└── utils/             # Helper functions
    ├── api.js         # API client with retry logic
    └── cn.js          # Utility for class names
```

## How the Data Works

Everything is stored locally using IndexedDB. Here's what the data looks like:

**Jobs**
- Have a title, description, status (active/draft/archived)
- Can be tagged (remote, full-time, etc.)
- Sortable by drag-and-drop

**Candidates**
- Linked to a job
- Move through stages: Applied → Screening → Interview → Offer → Hired
- Complete history of stage changes

**Assessments**
- Tied to specific jobs
- Made up of sections with multiple questions
- Support various question types

## Building for Production

Ready to deploy?

```bash
# Create optimized build
npm run build

# Test it locally
npm run preview
```

The build goes into the `dist/` folder - just upload that to any static hosting service!


## A Few Notes

- **First load takes a moment**: We're seeding 50+ candidates and setting up MSW on the first run
- **Data persists**: Everything is stored in IndexedDB, so it survives page refreshes
- **Clear data**: Open browser console and run `indexedDB.deleteDatabase('TalentFlowDB')` to start fresh
- **Check health**: Run `checkDatabaseHealth()` in console to see what's loaded

## Known Quirks

- MSW adds realistic network delays (200-1200ms per request)
- ~7.5% of write operations will fail (simulates real-world errors)
- If you see "Failed to load", just click Retry - it's the simulated error rate doing its thing!

## What's Next?

Some ideas for future enhancements:
- Add actual authentication
- Email notifications for stage changes
- Calendar integration for interviews
- Export candidate data to CSV
- Analytics dashboard
- Dark mode (because why not?)

## Contributing

Feel free to fork, experiment, and submit PRs! This was a learning project and I'm always open to suggestions.

## License

MIT - Do whatever you want with it!

---

Built with ☕ and React. Hope you find it useful!

If you run into any issues or have questions, feel free to open an issue on GitHub.
