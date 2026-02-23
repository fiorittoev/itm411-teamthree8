# ITM 411 Team Three 8 - My Michigan Lake

A full-stack application for managing Michigan Lake data with React Native/Expo frontend and FastAPI backend.

---

## Table of Contents

1. [Prerequisites & Software Installation](#prerequisites--software-installation)
2. [Project Setup](#project-setup)
3. [Git Workflow with GitHub Desktop](#git-workflow-with-github-desktop)
4. [Building & Running with Docker](#building--running-with-docker)
5. [Accessing the Application](#accessing-the-application)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites & Software Installation

### Required Software

Install the following software in this order:

#### 1. **Git**
- Download from: https://git-scm.com/download/win
- Run the installer and follow the default options
- Verify installation:
  ```powershell
  git --version
  ```

#### 2. **GitHub Desktop**
- Download from: https://desktop.github.com/
- Install and sign in with your GitHub account
- This provides a GUI interface for all Git operations

#### 3. **Node.js & npm**
- Download from: https://nodejs.org/ (LTS version recommended)
- Verify installation:
  ```powershell
  node --version
  npm --version
  ```

#### 4. **Python 3.10+**
- Download from: https://www.python.org/downloads/
- **Important:** Check "Add Python to PATH" during installation
- Verify installation:
  ```powershell
  python --version
  pip --version
  ```

#### 5. **Docker Desktop**
- Download from: https://www.docker.com/products/docker-desktop/
- Install and sign in (create free Docker account if needed)
- Verify installation:
  ```powershell
  docker --version
  docker compose --version
  ```
 — Enable IPv6 in Docker

Edit /etc/docker/daemon.json (or create it if missing):

{
  "ipv6": true,
  "fixed-cidr-v6": "2001:db8:1::/64"
}

#### 6. **PostgreSQL (Optional - only if running locally without Docker)**
- Download from: https://www.postgresql.org/download/windows/
- Remember the superuser password
- Verify installation:
  ```powershell
  psql --version
  ```

---

## Project Setup

### 1. Clone the Repository

**Using GitHub Desktop:**
1. Open GitHub Desktop
2. Click "File" → "Clone Repository"
3. Select the repository `fiorittoev/itm411-teamthree8`
4. Choose a local path (e.g., `C:\Users\YourUsername\Desktop\Programming`)
5. Click "Clone"

**Using Terminal:**
```powershell
git clone https://github.com/fiorittoev/itm411-teamthree8.git
cd itm411-teamthree8
```

### 2. Backend Setup

Navigate to the backend directory:
```powershell
cd backend
```

Create a Python virtual environment:
```powershell
python -m venv venv
```

Activate the virtual environment:
```powershell
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows Command Prompt (cmd)
venv\Scripts\activate.bat
```

Install Python dependencies:
```powershell
pip install -r requirements.txt
```

### 3. Frontend Setup

Navigate to the frontend directory:
```powershell
cd ../frontend
```

Install Node.js dependencies:
```powershell
npm install
```

### 4. Environment Configuration

**Backend (.env file)**

Create/update `backend/.env`:
```
DATABASE_URL=postgresql://postgres:your_password_here@localhost:5432/mml_db
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your_public_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
```

**Frontend (.env file)**

Create/update `frontend/.env`:
```
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_public_key_here
```

**Docker (.env for docker-compose)**

Create/update `docker-compose.yml` environment variables:
- Update `POSTGRES_PASSWORD` with a secure password
- Ensure `DATABASE_URL` matches the PostgreSQL credentials

---

## Project Structure Guide

### Backend Directory Structure

The backend is a FastAPI application with the following structure:

```
backend/
├── app/
│   ├── main.py                 # Main FastAPI application entry point
│   ├── core/
│   │   └── config.py           # Configuration settings, environment variables
│   └── db/
│       ├── base.py             # Database base setup and session management
│       └── models/             # SQLAlchemy ORM models (create as needed)
├── alembic/
│   ├── versions/               # Database migration files (auto-generated)
│   ├── env.py                  # Alembic environment configuration
│   └── script.py.mako          # Alembic migration script template
├── alembic.ini                 # Alembic configuration file
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Docker configuration for backend
└── .env                        # Environment variables (DO NOT commit)
```
run
expo install expo-location
**Key Files:**
- `main.py` - Define your API routes here
- `config.py` - Store database URLs, API keys, and other settings
- `alembic/versions/` - Database schema changes tracked here
- `requirements.txt` - Add new Python packages here and run `pip install -r requirements.txt`

### Frontend Directory Structure

The frontend is an Expo React Native application with the following structure:

```
frontend/
├── app/
│   ├── _layout.tsx             # Root layout component (navigation & auth routing)
│   ├── auth.tsx                # Authentication screen (Sign in / Sign up)
│   ├── modal.tsx               # Modal screen component
│   └── (tabs)/
│       ├── _layout.tsx         # Tab navigation layout
│       ├── index.tsx           # Home tab screen
│       └── explore.tsx         # Explore tab screen
├── services/
│   ├── api.ts                  # API client for backend communication
│   └── supabase.ts             # Supabase initialization (authentication)
├── assets/
│   └── images/                 # Static images and assets
├── scripts/
│   └── app/                    # Additional app scripts
├── package.json                # npm dependencies and scripts
├── .env                        # Environment variables (DO NOT commit)
├── app.json                    # Expo app configuration
├── tsconfig.json               # TypeScript configuration
├── eslint.config.js            # ESLint configuration
├── Dockerfile                  # Docker configuration for frontend
└── .expo/                      # Expo configuration (auto-generated)
```

**Key Files:**
- `app/_layout.tsx` - Root navigation and session management
- `app/auth.tsx` - Authentication UI and logic
- `app/(tabs)/` - Tab-based screens (Home, Explore)
- `services/api.ts` - Modify to add API calls to the backend
- `services/supabase.ts` - Supabase client configuration
- `package.json` - Add new npm packages here and run `npm install`

---

## Git Workflow with GitHub Desktop

### Pulling Latest Changes

1. Open GitHub Desktop
2. Ensure you're on the correct repository (top-left dropdown)
3. Click the "Fetch origin" button
4. If there are new changes, click "Pull origin" to download them
5. The status will show "This branch is up to date" when complete

### Creating a New Branch

1. Click "Current Branch" at the top
2. Click "New Branch"
3. Enter branch name (e.g., `feature/add-user-auth`)
4. Choose "main" as the base branch
5. Click "Create Branch"
6. Click "Publish branch" to push it to GitHub

### Committing Changes

1. Make changes to files in your editor
2. In GitHub Desktop, you'll see changed files in the "Changes" tab
3. Check the files you want to commit
4. Enter a commit message (e.g., "Add authentication endpoints")
5. Click "Commit to [branch-name]"

### Pushing Changes

1. After committing, click "Push origin" to upload changes to GitHub
2. Status bar will show "No local changes" when complete

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
