# Overview

This is an Islamic learning application built with React and Express that provides comprehensive educational content including Hijaiyah (Arabic alphabet) learning, Quran reading, Dhikr (remembrance) practices, and Islamic knowledge quizzes. The app features progress tracking, audio playback, interactive writing practice, and a mobile-first responsive design with dark/light theme support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management with local state via React hooks
- **UI Components**: Radix UI primitives with shadcn/ui component system
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Mobile-First Design**: Responsive layout optimized for mobile devices with bottom navigation

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Design**: RESTful API with JSON responses
- **Data Storage**: In-memory storage with interface for future database integration
- **Session Management**: Express sessions with PostgreSQL session store ready
- **File Structure**: Monorepo structure with shared schema definitions

## Data Architecture
- **Database ORM**: Drizzle ORM configured for PostgreSQL with schema definitions
- **Schema Design**: Normalized tables for users, progress tracking, bookmarks, dhikr counters, and quiz attempts
- **Type Safety**: Zod schemas for runtime validation integrated with Drizzle
- **Progress Tracking**: Modular system tracking completion across different learning modules

## Component Architecture
- **Audio System**: Custom audio player with playback controls and progress tracking
- **Canvas Integration**: HTML5 Canvas for Arabic letter writing practice with touch support
- **Theme System**: Context-based theme provider with CSS custom properties
- **Navigation**: Bottom navigation optimized for mobile interaction patterns

## External Dependencies

- **Database**: PostgreSQL with Neon serverless driver for production deployment
- **UI Framework**: Radix UI for accessible component primitives
- **Styling**: Tailwind CSS for utility-first styling approach
- **Build Tools**: Vite for fast development and optimized production builds
- **Audio Support**: HTML5 Audio API for Quran recitation and pronunciation
- **Development**: Replit-specific plugins for enhanced development experience
- **Form Handling**: React Hook Form with Hookform resolvers for form validation
- **Date Utilities**: date-fns for date formatting and manipulation
- **Icons**: Lucide React for consistent iconography