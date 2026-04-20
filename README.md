# My Michigan Lake - Full-Stack Lake Community Platform

A comprehensive mobile-first application connecting Michigan lake communities through posts, marketplace listings, direct messaging, and local business features. Built with a modern tech stack featuring expo/React Native frontend, FastAPI backend, and PostgreSQL database with Supabase authentication.

[Live Demo](#) | [GitHub Repo](https://github.com/fiorittoev/itm411-teamthree8)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Prerequisites & Installation](#prerequisites--installation)
4. [Quick Start](#quick-start)
5. [Development Setup](#development-setup)
6. [Production Deployment](#production-deployment)
7. [Project Structure](#project-structure)
8. [Key Files & Components](#key-files--components)
9. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          My Michigan Lake App                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────┐              ┌──────────────────────┐         │
│  │   React Native App   │              │   Expo Development   │         │
│  │   (iOS/Android/Web)  │◄────────────►│    Server (Bundler)  │         │
│  │                      │              │                      │         │
│  │ • Native UI Components              │ • Hot Module Reload  │         │
│  │ • Routing (Expo Router)             │ • Live Preview       │         │
│  │ • State Management (React Context)  │ • Development Tools  │         │
│  └──────────────────────┘              └──────────────────────┘         │
│           │                                                               │
│           │ (HTTP/REST)                                                  │
│           ▼                                                               │
│  ┌──────────────────────────────────┐                                   │
│  │    Supabase Auth & Storage       │                                   │
│  │                                  │                                   │
│  │ • User Authentication (JWT)      │                                   │
│  │ • Session Management             │                                   │
│  │ • Real-time Updates              │                                   │
│  └──────────────────────────────────┘                                   │
│           │                                                               │
│           │ (HTTP/REST)                                                  │
│           ▼                                                               │
│  ┌──────────────────────────────────┐                                   │
│  │  FastAPI Backend (Port 8000)     │                                   │
│  │                                  │                                   │
│  │ • REST API Endpoints             │                                   │
│  │ • Business Logic Layer           │                                   │
│  │ • CORS Middleware                │                                   │
│  │ • Authentication/Authorization   │                                   │
│  └──────────────────────────────────┘                                   │
│           │                                                               │
│           │ (SQLAlchemy ORM)                                             │
│           ▼                                                               │
│  ┌──────────────────────────────────┐                                   │
│  │  PostgreSQL Database             │                                   │
│  │                                  │                                   │
│  │ • Profiles (Users)               │                                   │
│  │ • Communities                    │                                   │
│  │ • Posts (Feed)                   │                                   │
│  │ • Items (Marketplace)            │                                   │
│  │ • Messages (Direct DMs)          │                                   │
│  │ • Ads (Business Promotions)      │                                   │
│  │ • Connections (Relationships)    │                                   │
│  └──────────────────────────────────┘                                   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Architecture

#### **Frontend: React Native + Expo**
Expo is a framework built on React Native that simplifies mobile app development. It provides:
- **Development Server**: Hot module reloading and live preview without rebuilding
- **Native Modules**: Pre-built access to iOS/Android APIs through JavaScript
- **Managed Build**: Simplified build process compared to bare React Native
- **Cross-Platform**: Single codebase compiles to iOS, Android, and web

The frontend communicates with the backend via HTTP REST API calls, using Supabase for authentication tokens.

#### **Backend: FastAPI + PostgreSQL**
FastAPI is a modern Python web framework providing:
- **High Performance**: Built on Starlette and Pydantic, comparable to Node.js frameworks
- **Automatic API Documentation**: Swagger UI at `/docs` and ReDoc at `/redoc`
- **Type Safety**: Built-in request/response validation with Pydantic
- **Async Support**: Handles concurrent requests efficiently
- **CORS Middleware**: Enabled for localhost development and production domains

The backend implements:
- RESTful API routes organized into routers (posts, items, search, connections, messages, ads)
- Database ORM layer using SQLAlchemy
- Business logic and validation before data persistence
- JWT-based authentication verification with Supabase tokens

#### **Database: PostgreSQL**
A relational database storing all application data with:
- **Normalized Schema**: Efficient data storage and integrity constraints
- **Relationships**: Foreign keys linking profiles, communities, posts, items, etc.
- **Indexing**: Optimized queries for search and filtering
- **Migrations**: Alembic-managed schema versions for safe updates

#### **Authentication: Supabase**
Supabase provides backend-as-a-service authentication with:
- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Automatic token refresh and expiration
- **User Verification**: Email/password and social login support (configurable)
- **Security**: Built-in rate limiting and DDoS protection

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React Native + Expo | Cross-platform mobile UI framework |
| **Frontend Routing** | Expo Router | File-based routing (similar to Next.js) |
| **Frontend State** | React Context API | State management for app data |
| **Frontend UI** | React Native components | Native UI elements for iOS/Android |
| **Authentication** | Supabase Auth | User login & token management |
| **Backend Framework** | FastAPI | High-performance Python web framework |
| **Backend ORM** | SQLAlchemy | Database object-relational mapping |
| **Backend Validation** | Pydantic | Request/response data validation |
| **Database** | PostgreSQL | Primary relational database |
| **Database Migrations** | Alembic | Schema version control |
| **API Documentation** | Swagger UI | Auto-generated interactive API docs |
| **Containerization** | Docker & Docker Compose | Development and production deployment |
| **Environment Variables** | .env files | Configuration management |

---

## Prerequisites & Installation

### Required Software

Install in this order:

#### 1. **Git**
- Download: https://git-scm.com/download
- Verify: `git --version`

#### 2. **Node.js & npm** (v18+)
- Download: https://nodejs.org (LTS version)
- Verify: `node --version` and `npm --version`

#### 3. **Python** (3.10+)
- Download: https://www.python.org/downloads/
- **IMPORTANT**: Check "Add Python to PATH"
- Verify: `python --version`

#### 4. **Docker** (Optional, for containerized development)
- Download: https://www.docker.com/products/docker-desktop
- Verify: `docker --version` and `docker-compose --version`

#### 5. **Supabase Account** (Free tier)
- Sign up: https://supabase.com
- Create project and get API credentials
- Store credentials in `.env` files (see Configuration section below)

### Environment Configuration

#### Backend `.env` file
Create `backend/.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/mml_db
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
GOOGLE_MAPS_API_KEY=your-google-maps-key
SECRET_KEY=your-secret-key-for-jwt
DEBUG=true
PORT=8000

# Ad verification email settings (using Resend)
ADMIN_EMAIL=fiorittoev@gmail.com
RESEND_API_KEY=your-resend-api-key
API_BASE_URL=http://localhost:8000
```

##### Email Setup (Resend)

The application uses **Resend** for sending ad approval notification emails. This is configured for the `/ads` endpoint to notify admins when a business submits an ad.

**Setup Steps:**

1. **Create a Resend account** (free)
   - Go to [resend.com](https://resend.com)
   - Sign up for a free account
   - Navigate to the API Keys section in your dashboard

2. **Get your API Key**
   - Copy your API key from the Resend dashboard
   - Paste it into your `backend/.env` file as `RESEND_API_KEY`

3. **Configure sender email**
   - By default, emails are sent from `onboarding@resend.dev` (Resend's default domain)
   - To customize the sender domain:
     - Add your domain in [Resend Dashboard](https://resend.com) and complete domain verification
     - Update the `"from"` field in `backend/app/routers/ads.py` `send_approval_email()` function

4. **Set admin email**
   - Update `ADMIN_EMAIL` in your `.env` to the email address that should receive ad approval requests
   - Example: `ADMIN_EMAIL=fiorittoev@gmail.com`

**How it works:**
- When a business submits an ad via the `/ads` POST endpoint, an email is automatically sent to the `ADMIN_EMAIL` address
- The email includes the ad details, business information, and approval/rejection links
- If `RESEND_API_KEY` is not set, the email sending is skipped silently (ads still submit successfully)

#### Frontend `.env` file
Create `frontend/.env`:
```
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Quick Start

### Option 1: Development with Start Scripts (Recommended for Active Development)

#### **Windows (PowerShell or CMD)**
```powershell
# From project root directory
./dev.bat
```

This starts both frontend and backend in separate terminal windows:
- Backend runs on `http://localhost:8000`
- Frontend runs on Expo (output shows connection info)

#### **macOS/Linux**
```bash
# From project root directory
chmod +x dev.sh
./dev.sh
```

### Option 2: Docker Compose (Containerized Development)

```bash
# Build and start all services
docker-compose up --build

# Access services
Backend: http://localhost:8000
Frontend: http://localhost:8081
```

### Option 3: Manual Setup

#### **Backend Setup**
```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.\.venv\Scripts\activate
# Activate (macOS/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed database with sample data
python seed_db.py

# Run development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend API docs available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

#### **Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Start Expo development server
npx expo start

# In Expo prompt:
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Press 'w' for web browser
# Press 'j' for web debugger
```

---

## Development Setup

### Project Initialization (First Time)

1. **Clone the repository**
   ```bash
   git clone https://github.com/fiorittoev/itm411-teamthree8.git
   cd itm411-teamthree8
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   python -m venv .venv
   .\.venv\Scripts\activate  # Windows or source .venv/bin/activate
   pip install -r requirements.txt
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` in both `backend/` and `frontend/`
   - Fill in your Supabase credentials
   - Set database connection strings

4. **Initialize database**
   ```bash
   cd backend
   python seed_db.py  # Populates with sample Michigan lake community data
   ```

5. **Start development**
   ```bash
   # From project root
   ./dev.bat   # Windows
   ./dev.sh    # macOS/Linux
   ```

### During Development

#### Backend Development
- API runs with hot reload enabled (`--reload` flag)
- Changes to Python files automatically restart the server
- Check logs in backend terminal for errors
- View API docs at `http://localhost:8000/docs`

#### Frontend Development
- Expo watches for file changes automatically
- Changes appear in emulator/phone within seconds
- Use `r` key to reload in Expo prompt
- Use `c` to clear Expo cache if issues occur

#### Database Changes
If you modify database models in `backend/app/db/models.py`:
```bash
cd backend

# Create migration
alembic revision --autogenerate -m "Description of change"

# Apply migration
alembic upgrade head

# (These run automatically in production)
```

### Testing & Debugging

```bash
# Backend API testing
curl http://localhost:8000/docs  # Interactive Swagger UI

# Frontend debugging
# In Expo prompt, press 'j' for JavaScript debugger
# Use Chrome DevTools or Expo debugger

# Database inspection
# Connect with: psql postgresql://user:password@localhost:5432/mml_db
```

---

## Production Deployment

### Docker Deployment

The application is containerized and production-ready using Docker Compose.

#### **Build Images**
```bash
docker-compose build
```

#### **Deploy Locally (Testing)**
```bash
docker-compose up
```

#### **Deploy to Production (Cloud)**

1. **Push images to registry (e.g., Docker Hub, AWS ECR)**
   ```bash
   docker tag mml-backend:latest myrepo/mml-backend:latest
   docker push myrepo/mml-backend:latest
   ```

2. **Deploy to cloud platform** (AWS, Google Cloud, DigitalOcean, etc.)
   - Use cloud provider's container orchestration
   - Update environment variables in deployment config
   - Ensure database URL points to production PostgreSQL

#### **Fly.io Deployment** (Included in project)

Both `backend/fly.toml` and `frontend/fly.toml` are configured for Fly.io deployment:

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Deploy backend
cd backend
flyctl deploy

# Deploy frontend
cd ../frontend
flyctl deploy
```

#### **Environment Variables for Production**
Ensure these are set in your cloud platform:
- `DATABASE_URL`: Production PostgreSQL connection string
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anonymous key
- `SECRET_KEY`: Strong random string for JWT signing
- `ALGORITHM`: JWT algorithm (HS256)

#### **Database Migrations in Production**
```bash
# SSH into container
docker exec -it mml-backend bash

# Apply migrations
alembic upgrade head
```

---

## Project Structure

```
itm411-teamthree8/
├── backend/                          # FastAPI Python backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # Main FastAPI app & CORS setup
│   │   ├── core/
│   │   │   ├── auth.py               # JWT authentication logic
│   │   │   └── config.py             # Configuration management
│   │   ├── db/
│   │   │   ├── models.py             # SQLAlchemy ORM models
│   │   │   ├── session.py            # Database session management
│   │   │   └── base.py               # Base model configuration
│   │   ├── dependencies.py           # Shared dependencies (DB session, auth)
│   │   └── routers/
│   │       ├── posts_items.py        # Posts & marketplace items endpoints
│   │       ├── search.py             # Search functionality
│   │       ├── connections.py        # User connections/friend requests
│   │       ├── messages.py           # Direct messaging endpoints
│   │       └── ads.py                # Business advertisements endpoints
│   ├── alembic/                      # Database migration management
│   │   ├── env.py                    # Migration configuration
│   │   ├── script.py.mako            # Migration script template
│   │   └── versions/                 # Individual migration files
│   ├── seed_db.py                    # Database seeding script (70+ profiles, 85+ posts, 75+ items)
│   ├── requirements.txt              # Python dependencies
│   ├── Dockerfile                    # Container image definition
│   ├── fly.toml                      # Fly.io deployment config
│   └── alembic.ini                   # Alembic configuration
│
├── frontend/                         # React Native + Expo app
│   ├── app/
│   │   ├── _layout.tsx               # Root layout & navigation setup
│   │   ├── index.tsx                 # Home/login screen
│   │   ├── login.tsx                 # Authentication screen
│   │   ├── options.tsx               # App options/menu
│   │   ├── main/                     # Main app screens (after login)
│   │   │   ├── _layout.tsx           # Main layout with tab navigation
│   │   │   ├── index.tsx             # Home/feed screen
│   │   │   ├── communities.tsx       # Communities list & details
│   │   │   ├── marketplace.tsx       # Marketplace/items listing
│   │   │   ├── search.tsx            # Search functionality
│   │   │   ├── settings.tsx          # User settings
│   │   │   ├── submit-ad.tsx         # Ad creation screen
│   │   │   └── profile/
│   │   │       ├── index.tsx         # My profile
│   │   │       └── [userId].tsx      # Other user profile view
│   │   ├── register/                 # Registration/onboarding flow
│   │   │   ├── _layout.tsx           # Registration layout
│   │   │   ├── index.tsx             # Start registration
│   │   │   ├── account-type.tsx      # Personal vs business selection
│   │   │   ├── display-name.tsx      # Username setup
│   │   │   ├── location.tsx          # Address & community selection
│   │   │   ├── interests.tsx         # Interest selection
│   │   │   ├── profile-picture.tsx   # Profile image upload
│   │   │   ├── about.tsx             # Bio/about section
│   │   │   ├── review.tsx            # Review before submission
│   │   │   └── end.tsx               # Registration complete
│   │   ├── context/
│   │   │   └── RegisterContext.tsx   # Registration form state management
│   │   ├── components/               # Reusable UI components
│   │   │   ├── index.ts              # Component exports
│   │   │   ├── AdCard.tsx            # Advertisement display
│   │   │   ├── ConnectButton.tsx     # Connection request button
│   │   │   ├── ConnectionsPanel.tsx  # Connections list
│   │   │   ├── ListingCard.tsx       # Marketplace item card
│   │   │   ├── Loading.tsx           # Loading spinner
│   │   │   ├── MarketCard.tsx        # Market item card variant
│   │   │   ├── MessagesPanel.tsx     # Messages/chat panel
│   │   │   ├── Navbar.tsx            # Top navigation bar
│   │   │   ├── PostCard.tsx          # Feed post card
│   │   │   ├── modals/               # Modal components
│   │   │   │   ├── DeleteConfirmModal.tsx
│   │   │   │   ├── PostModal.tsx     # Create/edit posts
│   │   │   │   └── ProfileModal.tsx  # Profile view modal
│   │   │   └── ui/                   # Base UI components
│   │   │       ├── Button.tsx        # Reusable button
│   │   │       ├── FormField.tsx     # Form input wrapper
│   │   │       ├── PanelHeader.tsx   # Panel header styling
│   │   │       ├── TextInput.tsx     # Reusable text input
│   │   │       └── UserListItem.tsx  # User list item display
│   │   ├── styles/                   # App-wide styling
│   │   │   ├── globalStyles.ts       # Global CSS/theme variables
│   │   │   ├── theme.ts              # Design tokens & theme colors
│   │   │   ├── auth/
│   │   │   │   └── authStyles.ts     # Authentication screen styles
│   │   │   ├── main/                 # Main app screen styles
│   │   │   │   ├── mainStyles.ts
│   │   │   │   ├── homeScreen.ts
│   │   │   │   ├── marketplace.ts
│   │   │   │   ├── profile.ts
│   │   │   │   ├── search.ts
│   │   │   │   └── ... (other screen styles)
│   │   │   ├── register/
│   │   │   │   └── registerStyles.ts
│   │   │   └── settings/
│   │   │       └── settingsStyles.ts
│   │   ├── services/                 # API & external service integration
│   │   │   ├── api.ts                # Backend API client/axios config
│   │   │   └── supabase.ts           # Supabase client initialization
│   │   ├── types/                    # TypeScript type definitions
│   │   │   └── search.ts             # Search-related types
│   │   └── assets/
│   │       └── images/               # App images & icons
│   ├── scripts/                      # Build/utility scripts
│   ├── services/                     # (see app/services above)
│   ├── package.json                  # Node dependencies
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── eslint.config.js              # ESLint rules
│   ├── expo-env.d.ts                 # Expo TypeScript types
│   ├── app.json                      # Expo app configuration
│   ├── Dockerfile                    # Frontend container image
│   ├── fly.toml                      # Fly.io deployment config
│   └── .env.example                  # Environment variables template
│
├── docker-compose.yml                # Multi-container orchestration
├── dev.bat                           # Windows dev startup script
├── dev.sh                            # macOS/Linux dev startup script
├── README.md                         # This file
└── .gitignore                        # Git ignore rules
```

---

## Key Files & Components

### Backend Core Files

#### `backend/app/main.py`
- **Purpose**: FastAPI application entry point
- **Includes**: 
  - CORS middleware configuration
  - Router registration (posts, items, search, connections, messages, ads)
  - Database initialization
- **Key Routes**: `/docs` (Swagger UI), `/health` (status check)

#### `backend/app/core/auth.py`
- **Purpose**: JWT authentication and Supabase verification
- **Functions**:
  - `get_current_user()`: Extracts and validates JWT tokens
  - Token verification against Supabase
  - User context injection into endpoints

#### `backend/app/db/models.py`
- **Purpose**: SQLAlchemy ORM model definitions
- **Models**:
  - `Profile`: User accounts (personal or business)
  - `Community`: Geographic lake communities
  - `Interest`: User interests/hobbies
  - `Post`: Community feed posts
  - `Item`: Marketplace listings
  - `Message`: Direct messages between users
  - `Ad`: Business advertisements
  - `Connection`: User connection requests (friend system)

#### `backend/app/db/session.py`
- **Purpose**: Database connection management
- **Provides**: `get_db()` dependency for injecting DB sessions into routes

#### `backend/seed_db.py`
- **Purpose**: Populate database with seed data
- **Includes**:
  - 10 Michigan lake communities
  - 70+ user profiles (mix of personal & business)
  - 85+ community posts with realistic content
  - 75+ marketplace items (boats, fishing gear, etc.)
  - 12 business advertisements
- **Run**: `python seed_db.py` to populate database

#### `backend/requirements.txt`
- **Dependencies**:
  - `fastapi`: Web framework
  - `uvicorn`: ASGI web server
  - `sqlalchemy`: ORM
  - `psycopg2-binary`: PostgreSQL driver
  - `alembic`: Database migrations
  - `python-dotenv`: Environment configuration
  - `pydantic`: Data validation

### Frontend Core Files

#### `frontend/app/_layout.tsx`
- **Purpose**: Root layout component
- **Sets up**: Navigation structure, provider setup (Supabase context)
- **Handles**: Authentication state and routing logic

#### `frontend/app/index.tsx`
- **Purpose**: Initial entry screen
- **Shows**: Login or redirect to main app based on auth state

#### `frontend/app/login.tsx`
- **Purpose**: User authentication screen
- **Handles**: Login/signup with Supabase

#### `frontend/app/main/_layout.tsx`
- **Purpose**: Main app bottom tab navigation
- **Tabs**: Home, Communities, Marketplace, Search, Settings
- **Navigation**: Bottom tabs container

#### `frontend/app/register/`
- **Purpose**: Multi-step registration/onboarding flow
- **Steps**: Account type → Display name → Location → Interests → Profile pic → Review
- **State Management**: RegisterContext.tsx for form data across steps

#### `frontend/app/services/api.ts`
- **Purpose**: Backend API client configuration
- **Setup**: Axios instance with base URL and auth headers
- **Functions**: API calls to `/posts`, `/items`, `/search`, etc.

#### `frontend/app/services/supabase.ts`
- **Purpose**: Supabase client initialization
- **Handles**: Authentication sessions and real-time subscriptions

#### `frontend/app/styles/theme.ts`
- **Purpose**: Design tokens and theme variables
- **Defines**: Colors, typography, spacing, responsive breakpoints

#### `frontend/package.json`
- **Key Dependencies**:
  - `@supabase/supabase-js`: Supabase client
  - `@react-navigation/bottom-tabs`: Tab navigation
  - `expo-router`: File-based routing
  - `expo`: Development framework
  - `@expo/vector-icons`: Icon library

### Configuration Files

#### `docker-compose.yml`
- **Services**:
  - `backend`: FastAPI on port 8000
  - `frontend`: Expo on ports 19000-19002, 8081
- **Volumes**: Mounted for hot reload during development
- **Environment**: Load from `.env` files

#### `dev.bat` (Windows) & `dev.sh` (macOS/Linux)
- **Purpose**: One-command development startup
- **Actions**: Launch backend and frontend in separate terminals
- **Output**: Backend at `http://localhost:8000`, Expo connection info

#### `backend/alembic.ini` & `backend/alembic/`
- **Purpose**: Database migration management
- **Used**: Tracking schema changes before production deploys
- **Commands**:
  - `alembic revision --autogenerate -m "description"`: Create migration
  - `alembic upgrade head`: Apply migrations

#### `frontend/app.json`
- **Purpose**: Expo app configuration
- **Includes**: App name, version, plugins, permissions, etc.

#### `backend/fly.toml` & `frontend/fly.toml`
- **Purpose**: Fly.io deployment configuration
- **Defines**: App name, port mappings, environment variables

---

## API Endpoints Overview

### Posts & Items
- `GET/POST /posts` - Feed posts
- `GET/POST /items` - Marketplace items
- `DELETE /posts/{id}`, `DELETE /items/{id}` - Remove listings

### Search
- `GET /search?q=query&type=profiles|posts|items` - Global search

### Connections
- `POST /connections/request` - Send connection request
- `GET /connections` - Get user's connections
- `PUT/DELETE /connections/{id}` - Accept/decline/remove

### Messages
- `GET/POST /messages` - Direct messaging
- `GET /conversations` - Active conversation list

### Ads
- `GET /ads` - View approved advertisements
- `POST /ads` - Create new ad (pending approval)

### Authentication
- All endpoints (except `/docs`) require valid JWT token in `Authorization: Bearer <token>` header
- Tokens provided by Supabase after login

---

## Troubleshooting

### Backend Issues

#### Problem: `ModuleNotFoundError: No module named 'app'`
**Solution:**
- Ensure you're in the `backend` directory before running uvicorn
- Virtual environment is activated: `source .venv/bin/activate` (macOS/Linux) or `.\.venv\Scripts\activate` (Windows)
- Reinstall dependencies: `pip install -r requirements.txt`

#### Problem: `CORS error when frontend calls backend`
**Solution:**
- Ensure backend is running on `http://localhost:8000`
- Update CORS allowed origins in `backend/app/main.py` if using different ports
- Check that both services are using correct URLs in environment variables

#### Problem: Database connection error
**Solution:**
```bash
# Check if Docker container is running
docker ps

# Restart Docker Compose services
docker-compose down
docker-compose up --build

# Or verify local PostgreSQL is running:
psql -U postgres -d mml_db
```

#### Problem: Migrations not applying
**Solution:**
```bash
cd backend

# Check migration status
alembic current

# Upgrade to latest
alembic upgrade head

# Or reset (WARNING: destroys data)
alembic downgrade base
alembic upgrade head
```

#### Problem: `Port 8000 already in use`
**Solution:**
```bash
# Find process using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use a different port
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### Frontend Issues

#### Problem: `Module not found` errors
**Solution:**
```bash
cd frontend

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# In Expo prompt, press 'c' to clear cache
```

#### Problem: Expo won't connect to backend
**Solution:**
- Verify backend is running: `http://localhost:8000/docs` should load
- Check `.env` file has correct `EXPO_PUBLIC_API_URL`
- For Android emulator: Use `10.0.2.2:8000` instead of `localhost:8000`
- For iOS simulator: Use `localhost:8000` (works through bridge)

#### Problem: `Cannot find module '@supabase/supabase-js'`
**Solution:**
```bash
npm install @supabase/supabase-js
# Or reinstall all dependencies
npm install
```

#### Problem: Port 19000/19001 already in use
**Solution:**
```bash
# Kill Expo processes
pkill -f "expo" # macOS/Linux
taskkill /IM node.exe /F # Windows (kills all Node processes)

# Or use different port
npx expo start --port 9000
```

### Docker Issues

#### Problem: `docker-compose: command not found`
**Solution:**
Install Docker Compose separately or update Docker Desktop:
```bash
# Install Compose v2 (recommended)
brew install docker-compose  # macOS
# Or download from https://docs.docker.com/compose/install/
```

#### Problem: Permission denied for docker commands
**Solution:**
```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER
sudo newgrp docker

# Or use sudo
sudo docker ps
```

#### Problem: Volume mounting issues
**Solution:**
```bash
# Verify volumes are mounted
docker inspect <container_id> | grep -A 20 "Mounts"

# Rebuild services with clean volumes
docker-compose down -v
docker-compose up --build
```

#### Problem: `Out of disk space` for Docker
**Solution:**
```bash
# Clean up unused Docker resources
docker system prune -a

# Or remove specific images/containers
docker rm <container_id>
docker rmi <image_id>
```

### Database Issues

#### Problem: Can't connect to PostgreSQL
**Solution:**
```bash
# Check if service is running
docker ps | grep postgres

# Or locally:
psql -U postgres

# Default credentials from docker-compose:
# User: postgres
# Password: postgres
# Database: mml_db
```

#### Problem: Foreign key constraint violations
**Solution:**
- Ensure referenced records exist before creating relationships
- Check for cascading deletes affecting dependent records
- Review database schema: `\d+` in psql

#### Problem: Seed data not loading
**Solution:**
```bash
# Ensure database is ready
docker-compose up -d postgres
sleep 5  # Wait for database to start

# Run seed script
cd backend
source .venv/bin/activate  # or .\.venv\Scripts\activate
python seed_db.py

# Check output
sqlite3 mml_db.db ".tables"  # or use psql for PostgreSQL
```

### Development Environment

#### Problem: Can't activate virtual environment
**Solution:**
```powershell
# Windows PowerShell - if execution policy error:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try:
.\.venv\Scripts\Activate.ps1
```

#### Problem: `dev.bat` or `dev.sh` not executing
**Solution:**
```bash
# Make script executable (macOS/Linux)
chmod +x dev.sh

# Run with explicit shell
bash dev.sh
zsh dev.sh  # For zsh on macOS

# Or run components manually
# Terminal 1:
cd backend && source .venv/bin/activate && uvicorn app.main:app --reload

# Terminal 2:
cd frontend && npx expo start
```

#### Problem: Python version mismatch
**Solution:**
```bash
# Check Python version
python --version

# Should be 3.10 or higher
# If not, specify version explicitly:
python3.10 -m venv .venv
python3.11 -m pip install -r requirements.txt
```

### Common API Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Invalid/expired JWT token | Re-login in app, verify Supabase credentials |
| `403 Forbidden` | User doesn't have permission | Check user ID matches request owner |
| `404 Not Found` | Resource doesn't exist | Verify ID exists, check DB |
| `422 Unprocessable Entity` | Invalid request data | Check request body matches API schema, see `/docs` |
| `500 Internal Server Error` | Backend bug | Check backend logs, verify database connection |

---

## Development Workflow

### Creating a New Feature

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement changes**
   - Backend: Add endpoints in `backend/app/routers/`
   - Frontend: Add screens in `frontend/app/main/`
   - Update models if schema changes needed

3. **Test locally**
   - Backend: Visit `http://localhost:8000/docs` to test API
   - Frontend: Test in Expo emulator or device

4. **Create migration if needed**
   ```bash
   cd backend
   alembic revision --autogenerate -m "Description of change"
   alembic upgrade head
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: description of feature"
   git push origin feature/your-feature-name
   ```

6. **Create pull request on GitHub**
   - Describe changes
   - Reference related issues
   - Request reviewers

### Database Schema Changes

1. **Modify model** in `backend/app/db/models.py`
2. **Create migration**:
   ```bash
   cd backend
   alembic revision --autogenerate -m "Add new_field to Model"
   ```
3. **Review generated migration** in `backend/alembic/versions/`
4. **Apply migration**:
   ```bash
   alembic upgrade head
   ```
5. **Commit migration file** to git

---

## Performance Optimization Tips

- **Database**: Add indexes on frequently queried columns
- **API**: Use database query pagination for large result sets
- **Frontend**: Use React Memo for expensive components
- **Images**: Optimize and compress images before uploading
- **Caching**: Consider redis for session/data caching in production

---

## Security Considerations

- **Secrets**: Never commit `.env` files or API keys
- **Authentication**: All API routes require JWT validation
- **CORS**: Only allow trusted origins in production
- **Database**: Use parameterized queries (SQLAlchemy default)
- **Rate Limiting**: Consider implementing in production
- **Input Validation**: All inputs validated by Pydantic

---

## Useful Commands Reference

```bash
# Backend
python seed_db.py                           # Populate database
alembic current                              # Check migration status
alembic upgrade head                        # Apply migrations
uvicorn app.main:app --reload              # Development server
python -m pytest                            # Run tests (if configured)

# Frontend
npm install                                 # Install dependencies
npm run lint                                # Check code style
npx expo start                             # Development server
npx expo start --web                       # Web preview
npx expo prebuild                          # Generate native code

# Docker
docker-compose up --build                  # Build and start
docker-compose down                        # Stop and remove
docker-compose logs -f backend             # View logs
docker exec -it mml-backend bash           # Access container

# Git
git status                                 # Check changes
git add .                                  # Stage changes
git commit -m "message"                    # Commit
git push origin branch-name                # Push to GitHub
git pull                                   # Fetch latest
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## Contact & Support

- **Project Lead**: ITM 411 Team Three 8
- **Repository**: https://github.com/fiorittoev/itm411-teamthree8
- **Issues**: GitHub Issues tab
- **Documentation**: This README + API docs at `/docs`

---

## License

This project is part of ITM 411 course at Michigan State University.

### Creating a Pull Request

1. After pushing changes, click "Create Pull Request"
2. This opens a browser window to GitHub
3. Add a description of your changes
4. Click "Create pull request"
5. Wait for team review and approval

### Merging Your Branch

1. After pull request is approved, go to GitHub in your browser
2. Click "Merge pull request"
3. Click "Confirm merge"
4. Back in GitHub Desktop, click "Fetch origin" to get the merged changes

### Switching Between Branches

1. Click "Current Branch" at the top
2. Select the branch you want to work on from the list
3. Click "Switch Branch"

---

## Local Development

### Running Backend & Frontend Together

To easily start both the backend and frontend development servers in separate terminals:

**Windows:**
```powershell
.\dev.bat
```

**macOS/Linux:**
```bash
chmod +x dev.sh
./dev.sh
```

This will automatically:
- Activate the Python virtual environment
- Start the FastAPI backend on `http://localhost:8000`
- Start the Expo development server in a separate terminal

### Manual Setup (if not using the dev script)

#### Backend
```powershell
cd backend

# Activate virtual environment
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate

# Start the server with auto-reload
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend (in a separate terminal)
```powershell
cd frontend
npx expo start
```

---

## Building & Running with Docker

Docker allows you to run the entire application (database, backend, frontend) in isolated containers.

### Prerequisites
- Docker Desktop must be running (check system tray)

### Start the Application

From the project root directory:

**Run both Mobile and Web:**
```powershell
cd itm411-teamthree8
docker compose --profile mobile --profile web up --build
```

**Run Mobile only:**
```powershell
docker compose --profile mobile up --build
```

**Run Web only:**
```powershell
docker compose --profile web up --build
```

These commands will:
- Build Docker images for backend and selected frontend(s)
- Start PostgreSQL database
- Start FastAPI backend
- Start Expo development servers
- Download and configure all dependencies

**First run may take 5-10 minutes.**

### View Logs

While running, you can view logs in the same terminal. To stop:
```powershell
# Press Ctrl+C in the terminal
```

### Rebuild After Code Changes

```powershell
docker compose up --build
```

### Stop All Services

```powershell
docker compose down
```

### Remove Volumes (Clear Database)

```powershell
docker compose down -v
```

---

## Accessing the Application

Once `docker compose up` is running (with appropriate profiles), you can access:

### 1. **Web Version** (with `--profile web`)
- URL: http://localhost:8081
- Open in your browser
- Hot reload enabled - changes are reflected immediately

### 2. **Expo Mobile Version** (with `--profile mobile`)

**Using Expo Go App (Easiest):**
1. Download "Expo Go" from App Store or Google Play
2. On your phone, open Expo Go
3. In the terminal where `docker compose up` is running, scan the QR code
4. Your app will load on your phone

**Using Android Emulator:**
1. Install Android Studio: https://developer.android.com/studio
2. In the terminal, run:
   ```powershell
   cd frontend
   npm run android
   ```
3. This automatically opens the Android emulator and loads your app

**Using iOS Simulator (Mac only):**
1. In the terminal, run:
   ```powershell
   cd frontend
   npm run ios
   ```

### 3. **Backend API**
- URL: http://localhost:8000
- API Documentation (Swagger UI): http://localhost:8000/docs
- Alternative docs (ReDoc): http://localhost:8000/redoc

### 4. **PostgreSQL Database**
- Host: localhost
- Port: 5432
- Username: postgres
- Password: (set in docker-compose.yml)
- Database: mml_db

**Connect with pgAdmin or DBeaver:**
- Download pgAdmin: https://www.pgadmin.org/download/
- Create new connection with the above credentials

---

## Development Workflow

### Local Development (Without Docker)

**Terminal 1 - Backend:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload
```
Backend will be available at http://localhost:8000

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```
Follow the prompts to open in web, iOS, or Android

### With Docker Development

Docker is recommended as it ensures consistency across team members and matches production environment.

---

## Troubleshooting

### Docker Issues

**"Docker daemon is not running"**
- Open Docker Desktop from your Start menu and wait 1-2 minutes for it to start

**"Port 5432 already in use"**
- Another PostgreSQL instance is running
- Stop other services or change the port in docker-compose.yml

**"Cannot connect to database"**
- Ensure `DATABASE_URL` in backend/.env matches docker-compose.yml credentials
- Check that mml-db container is running: `docker ps`

### Frontend Issues

**Expo won't start**
- Clear cache: `npm run reset-project`
- Delete node_modules: `rm -r node_modules` then `npm install`

**Port 8081 already in use**
- Close other applications using that port
- Or change port in docker-compose.yml frontend-web service

### Backend Issues

**"ModuleNotFoundError" when running locally**
- Activate virtual environment: `.\venv\Scripts\Activate.ps1`
- Verify Python version: `python --version` (should be 3.10+)

**Database migration errors**
- Reset database: `docker compose down -v` then `docker compose up --build`

---

## Useful Commands Reference

```powershell
# Docker commands
docker compose up --build          # Start all services
docker compose down                # Stop all services
docker compose logs -f             # View live logs
docker compose ps                  # View running containers
docker compose down -v             # Stop and remove volumes (CAREFUL!)

# Git commands (or use GitHub Desktop)
git status                         # Check current branch status
git add .                          # Stage all changes
git commit -m "message"            # Commit changes
git push                           # Push to GitHub
git pull                           # Pull latest changes
git branch -a                      # List all branches

# Frontend commands
npm install                        # Install dependencies
npm start                          # Start development server
npm run web                        # Run web version
npm run android                    # Run Android version
npm run ios                        # Run iOS version
npm run lint                       # Check code style

# Backend commands
python -m venv venv              # Create virtual environment
.\venv\Scripts\Activate.ps1      # Activate virtual environment
pip install -r requirements.txt   # Install dependencies
python -m uvicorn app.main:app --reload  # Run development server
```

---

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Docker Documentation](https://docs.docker.com/)
- [React Native Documentation](https://reactnative.dev/)
- [GitHub Desktop Guide](https://docs.github.com/en/desktop)

---

**Last Updated:** February 2026

For questions or issues, contact the team or create an issue on GitHub.
