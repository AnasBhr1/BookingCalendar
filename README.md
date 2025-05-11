Booking Calendar
📅 Modern Full-Stack Booking Application
A comprehensive MERN-stack booking calendar application with real-time updates, Google Calendar integration, and advanced admin features. Designed for managing appointments across multiple users with role-based access control.


✨ Features
Core Functionality
User Authentication: Secure JWT-based authentication system
Role-Based Access Control: Different permissions for Admins and Users
Interactive Calendar Interface: Week and month views using React calendar components
Booking Management: Create, reschedule, and cancel appointments
Real-Time Feedback: Instant notification of booking conflicts
User Features
View available time slots
Book new appointments
Reschedule existing appointments
Cancel bookings with notifications
Personal dashboard of upcoming appointments
Admin Features
User and role management
Create recurring or one-time availability slots
Comprehensive booking overview with filtering options
Analytics dashboard with booking metrics
Advanced Features
Real-Time Updates: WebSocket implementation using Socket.IO for instant availability updates
Google Calendar Integration: Sync appointments with Google Calendar (OAuth 2.0)
Smart Time Slot Suggestions: Intelligent booking time recommendations
Responsive Design: Mobile-first approach with clean UI
Dark Mode: Toggle with preferences saved in localStorage
Admin Analytics: Visual data representation using charts
Notifications: Email confirmation via Nodemailer
Drag-and-Drop: Interactive rescheduling of appointments
🛠️ Technology Stack
Frontend
React: UI component library
React Router: Client-side routing
Context API: State management
React-Big-Calendar/FullCalendar: Calendar interface
Tailwind CSS: Styling and responsiveness
Chart.js/Recharts: Data visualization
Socket.IO Client: Real-time communication
Backend
Node.js: Runtime environment
Express.js: Web application framework
MongoDB: Database
Mongoose: ODM for MongoDB
JWT: Authentication
Socket.IO: WebSocket implementation
Nodemailer: Email notifications
Google Calendar API: Calendar integration
📂 Project Structure
Backend
backend/
├── config/
│   └── googleOAuth.js
├── controllers/
│   ├── authController.js
│   ├── availabilityController.js
│   ├── bookingController.js
│   ├── googleCalendarController.js
│   └── userController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── AvailabilitySlots.js
│   ├── Booking.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── availabilityRoutes.js
│   ├── bookingRoutes.js
│   ├── googleCalendarRoutes.js
│   └── userRoutes.js
├── utils/
├── .env
├── package.json
└── server.js
Frontend
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.js
│   │   │   ├── Navigation.js
│   │   │   └── ...
│   │   ├── BookingCard.js
│   │   ├── BookingForm.js
│   │   ├── DarkModeToggle.js
│   │   ├── GoogleCalendarSettings.js
│   │   ├── Modal.js
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.js
│   │   ├── DarkModeContext.js
│   │   └── SocketContext.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useAvailability.js
│   │   ├── useBookings.js
│   │   └── useDarkMode.js
│   ├── pages/
│   │   ├── AdminAvailabilityPage.js
│   │   ├── AdminBookingsPage.js
│   │   ├── AdminDashboardPage.js
│   │   ├── AdminUsersPage.js
│   │   ├── CalendarPage.js
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── ProfilePage.js
│   │   ├── RegisterPage.js
│   │   └── UserBookingsPage.js
│   ├── services/
│   │   ├── availability.service.js
│   │   ├── booking.service.js
│   │   ├── googleCalendarService.js
│   │   └── userService.js
│   ├── utils/
│   ├── App.css
│   ├── App.js
│   └── index.js
├── package.json
└── tailwind.config.js
🚀 Installation & Setup
Prerequisites
Node.js (v14 or higher)
MongoDB
npm or yarn
Environment Variables
Create a .env file in the backend directory with the following variables:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/google/callback
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
Backend Setup
bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
Frontend Setup
bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
💡 Usage
User Registration & Login
Navigate to the registration page
Create an account with email and password
Log in with credentials
Booking an Appointment (User)
Navigate to the Calendar page
Select an available time slot
Fill in appointment details
Confirm booking
Managing Availability (Admin)
Log in as an admin
Navigate to Admin Dashboard > Availability
Create new availability slots or modify existing ones
Set recurring availability patterns if needed
Google Calendar Integration
Navigate to Profile page
Click on "Connect Google Calendar"
Complete the OAuth authentication process
Select which calendars to sync
🧪 Testing
bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
🤝 Contributing
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

# Run backend & front end 
cd booking-calendar-app
npm start

📬 Contact
Via Github : https://github.com/AnasBhr1/
email : Anasbhr1@hotmail.com

⭐️ From Anas

