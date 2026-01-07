# Next.js Migration Setup

This project has been set up with Next.js 14+ using Bun runtime and Vite integration.

## Development

```bash
# Start development server with Bun
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Type checking
bun run type-check

# Linting
bun run lint
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable UI components (to be migrated)
├── lib/                   # Utility functions and configurations
├── public/                # Static assets
├── shared/                # Shared types and utilities
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── bun.lockb             # Bun lockfile
```

## Features Configured

- ✅ Next.js 14+ with App Router
- ✅ Bun runtime and package manager
- ✅ Vite integration for development
- ✅ TypeScript configuration
- ✅ Tailwind CSS with shadcn/ui compatibility
- ✅ ESLint configuration
- ✅ Environment variables setup
- ✅ CORS headers for API routes
- ✅ Image optimization configuration
- ✅ Serverless deployment ready

## Next Steps

1. Migrate UI components from `client/src/components`
2. Set up MongoDB with Prisma
3. Create API routes in `app/api`
4. Migrate pages to App Router structure
5. Set up data fetching patterns

## Performance Benefits

- **Bun Runtime**: 3x faster than Node.js for JavaScript execution
- **Vite Integration**: Fast HMR and optimized bundling
- **Turbopack**: Next.js 16's default bundler for faster builds
- **Server-Side Rendering**: Better SEO and initial load performance
- **Serverless Architecture**: Auto-scaling and cost-effective deployment