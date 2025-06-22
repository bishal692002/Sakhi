# Sakhi - Period Tracking Application

Sakhi is a comprehensive period tracking application that helps users track their menstrual cycles, predict future periods, and log symptoms.

## Project Setup

### Prerequisites
- Node.js (v14.x or higher)
- MongoDB Atlas account (or local MongoDB installation)
- Modern web browser

## Running the Application

### Step 1: Start the Backend Server
1. Open a terminal and navigate to the backend directory:
```
cd z:\Sakhi\backend
```

2. Install the dependencies (first time only):
```
npm install
```

3. Start the server:
```
npm run dev
```
This will start the server on http://localhost:5000

### Step 2: Start the Frontend (in a separate terminal)
1. For development, you can use a simple HTTP server like the Live Server extension in VS Code
   - Install Live Server extension in VS Code
   - Right click on z:\Sakhi\frontend\index.html and select "Open with Live Server"

2. Alternatively, use Python's built-in server:
```
cd z:\Sakhi\frontend
python -m http.server 8080
```
Or if you're using Python 3:
```
cd z:\Sakhi\frontend
python3 -m http.server 8080
```

3. The application will be available at http://localhost:8080 (or the port assigned by Live Server)

## API Documentation

The backend provides the following endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user info (requires authentication)

### Period Tracking
- `POST /api/period` - Save period data (requires authentication)
- `GET /api/period/latest` - Get latest period data (requires authentication)
- `GET /api/period/predict` - Get period predictions (requires authentication)

### Symptom Tracking
- `POST /api/symptoms` - Save symptom data (requires authentication)
- `GET /api/symptoms` - Get all symptom logs (requires authentication)
- `GET /api/symptoms/:id` - Get specific symptom log (requires authentication)
- `DELETE /api/symptoms/:id` - Delete symptom log (requires authentication)

## Folder Structure

```
sakhi/
├── backend/             # Backend Node.js + Express application
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── .env             # Environment variables
│   ├── package.json     # Backend dependencies
│   └── server.js        # Entry point
├── frontend/            # Frontend HTML, CSS, JavaScript
│   ├── js/              # JavaScript files
│   ├── services/        # API services
│   ├── index.html       # Home page
│   ├── login.html       # Login page
│   ├── register.html    # Registration page
│   ├── dashboard.html   # User dashboard
│   ├── styles.css       # CSS styles
│   └── sakhi.png        # Logo image
└── README.md            # Project documentation
```
