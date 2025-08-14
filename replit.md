# Rarity Certificate Generator

## Overview

A full-stack web application that generates personalized "rarity certificates" based on users' unique physical characteristics. Users input details like eye color, hair color, and special traits (freckles, ability to touch nose with tongue, etc.), and the system calculates their statistical rarity, then generates both a certificate and poster as downloadable images.

The application consists of a React frontend with shadcn/ui components for the user interface, an Express.js backend API, and a Python script for image generation using PIL and matplotlib.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Hook Form for form handling, TanStack Query for server state
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints for certificate generation and retrieval
- **Data Storage**: In-memory storage with interface design for future database integration
- **Image Generation**: Python subprocess execution for certificate and poster creation
- **File Serving**: Static file serving for generated images

### Data Schema
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Definition**: Centralized in shared directory for type safety across frontend/backend
- **Validation**: Zod schemas for runtime type validation and form validation

### Image Generation Pipeline
- **Technology**: Python with PIL (Python Imaging Library) and matplotlib
- **Process**: Subprocess execution from Node.js backend
- **Output**: PNG files for both certificate and poster formats
- **Storage**: Local file system with configurable output directory

### Project Structure
- **Monorepo Setup**: Client, server, and shared code in single repository
- **TypeScript Configuration**: Unified configuration with path mapping
- **Shared Types**: Common schemas and types accessible to both frontend and backend

## External Dependencies

### Core Dependencies
- **Frontend**: React, React Hook Form, TanStack Query, Wouter, Tailwind CSS
- **Backend**: Express.js, Drizzle ORM, Zod validation
- **UI Components**: Radix UI primitives, shadcn/ui components, Lucide icons
- **Development**: Vite, TypeScript, ESBuild for production builds

### Database Integration
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Driver**: @neondatabase/serverless for database connectivity
- **Migrations**: Drizzle Kit for schema management

### Python Dependencies
- **Image Processing**: PIL (Python Imaging Library)
- **Plotting**: matplotlib for chart and graphics generation
- **Data Handling**: JSON for data exchange between Node.js and Python

### Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **Code Quality**: TypeScript strict mode, ESM modules
- **Replit Integration**: Custom plugins for development environment support