# Full-Stack Project

This repository contains a full-stack application with separate backend and frontend folders.

---

## Backend

### Technologies Used
- Node.js
- Express
- MongoDB (via Mongoose)
- Cloudinary (for media management)
- Authentication with JWT and bcryptjs
- File uploads with Multer
- Other utilities: Axios, Nodemailer, PDF parsing, dotenv, CORS, cookie-parser

### Structure Overview
- `src/app.js`: Express app setup with middleware and route declarations
- `src/server.js`: Server startup, database and Cloudinary connection
- `src/routes/`: API route definitions
- `src/controllers/`: Route handlers and business logic
- `src/models/`: Mongoose models for data schemas
- `src/lib/`: Utility libraries (database connection, Cloudinary config, helpers)
- `src/middleware/`: Middleware for authentication, file uploads, etc.

### Installation and Running
```bash
cd backend
npm install
npm run dev       # Start server with nodemon for development
npm start         # Start server normally
```

### Environment Variables
Create a `.env` file in the `backend` folder with variables such as:
- `PORT` (optional, default 3000)
- `MONGODB_URI` (MongoDB connection string)
- `CLOUDINARY_*` (Cloudinary credentials)
- `FRONTEND_URL` (for CORS configuration)
- Other secrets as needed

### API Routes Overview
- `/api/auth` - Authentication routes
- `/api/courses` - Course management
- `/api/semesters` - Semester management
- `/api/subjects` - Subject management
- `/api/notes` - Notes management
- `/api/profile` - User profile management

---

## Frontend

### Technologies Used
- React 18 with TypeScript
- Vite build tool
- Tailwind CSS for styling
- shadcn-ui component library
- React Router for routing
- React Query for data fetching and caching
- Zustand for state management
- Various Radix UI components

### Structure Overview
- `src/main.tsx`: React app entry point, renders `<App />` inside `<BrowserRouter>`
- `src/App.tsx`: Main app component with routing and authentication logic
- `src/components/`: Reusable UI components and admin panel components
- `src/pages/`: Page components for different routes
- `src/store/`: Zustand stores for state management
- `src/hooks/`: Custom React hooks
- `src/lib/`: Utility functions and axios instance

### Installation and Running
```bash
cd frontend
npm install
npm run dev       # Start development server with hot reload
```

### Existing Frontend README Summary
This frontend is part of a Lovable project. You can edit the code via:
- Lovable web interface
- Your preferred IDE locally
- GitHub web editor
- GitHub Codespaces

Deployment and domain setup can be managed via Lovable.

---

## Environment Variables

Both backend and frontend use `.env` files for configuration. Ensure to create and configure these files appropriately.

---

## Scripts

### Backend
- `npm run dev` - Start backend server with nodemon (auto-reload)
- `npm start` - Start backend server normally

### Frontend
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint checks

---

## Deployment

- Backend server can be deployed on any Node.js hosting platform.
- Frontend is deployed via Lovable platform with easy publishing and custom domain support.

---

## Links and References

- Lovable Project URL: [https://lovable.dev/projects/dc790f48-0dda-4092-a5e9-1b60cc29e10d](https://lovable.dev/projects/dc790f48-0dda-4092-a5e9-1b60cc29e10d)
- Lovable Documentation: [https://docs.lovable.dev/](https://docs.lovable.dev/)
