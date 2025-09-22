<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI Wardrobe App - React Native Expo Project

## Project Overview
This is a React Native Expo application for an AI-powered wardrobe management system. Users can upload photos of clothing items, categorize them with AI assistance, and generate outfit combinations.

## Tech Stack
- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation v7 with bottom tabs
- **State Management**: Zustand for global state
- **API**: React Query (TanStack Query) for data fetching
- **HTTP Client**: Axios with interceptors
- **Image Handling**: Expo Image Picker & Image Manipulator
- **Styling**: Custom theme system with light/dark mode
- **Code Quality**: ESLint, Prettier, Husky

## Architecture Patterns
- **Component Structure**: Functional components with hooks
- **State Management**: Minimal global state, React Query for server state
- **API Layer**: Centralized API services with React Query hooks
- **Theme System**: Context-based theming with Zustand
- **File Organization**: Feature-based folder structure

## Key Components
- `WardrobeItemCard`: Displays clothing items with status indicators
- `Button`: Reusable button component with variants
- `Card`: Container component for consistent styling
- Custom hooks for image picking, theming, and API operations

## API Integration
- Backend: NestJS with Prisma and Qdrant vector database
- Endpoints: `/api/warderobe`, `/api/outfits/generate`
- Image upload: Multipart form data with compression
- Error handling: Global interceptors with user-friendly messages

## Development Guidelines
- Use TypeScript strictly with proper typing
- Follow the established folder structure in `src/`
- Implement responsive design with theme-based styling
- Handle loading states and error scenarios
- Optimize images before upload
- Use absolute imports with `@/` prefix

## Environment Configuration
- Environment variables managed via `.env` files
- Production builds configured with EAS Build
- Secure API keys using Expo Constants
