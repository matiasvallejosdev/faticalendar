# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- **Development server**: `npm run dev`
- **Build**: `npm run build`
- **Production start**: `npm start`
- **Lint**: `npm run lint`

## Project Architecture

**FatiCalendar** is a Next.js 15 life visualization application that displays a user's life in weeks as a grid calendar. The app helps users visualize their life journey and track progress.

### Core Architecture

- **Framework**: Next.js 15 with App Router (src directory structure)
- **State Management**: Redux Toolkit with persistent localStorage
- **Styling**: Tailwind CSS with custom vintage theme colors
- **UI Components**: Radix UI primitives with custom components in `src/components/ui/`
- **TypeScript**: Full TypeScript support with path aliases

### Key Components Structure

**Main Application Flow**:
- `src/components/life-app.tsx` - Root app component handling loading states and user data flow
- `src/components/initial-form.tsx` - User onboarding form collecting personal data
- `src/components/life-grid.tsx` - Core life visualization grid component
- `src/components/life-circle.tsx` - Alternative circular life visualization

**State Management**:
- `src/lib/store.ts` - Redux store configuration
- `src/lib/features/user-slice.ts` - User data slice with localStorage persistence
- `src/hooks/user-user-state.ts` - Custom hook for user state management

**Data Structure**:
User data includes: name, birthYear, nationality, healthyFood, running, alcohol, smoking - used for life expectancy calculations.

### Configuration

- **Site config**: `src/config.js` contains site metadata and branding
- **Environment**: `src/env.js` handles API URLs and Supabase configuration
- **Theme**: Custom vintage color scheme (cream, green variants) defined in `tailwind.config.ts`
- **Path aliases**: Comprehensive alias setup in `tsconfig.json` for clean imports

### Development Notes

- Build ignores TypeScript and ESLint errors (configured in `next.config.mjs`)
- Images are unoptimized for deployment flexibility
- Security headers configured for XSS protection and content security
- Uses Lucide React for icons with optimization enabled
- Sonner for toast notifications, next-themes for theme management