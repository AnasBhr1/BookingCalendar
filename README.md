# Booking Calendar

A comprehensive MERN-stack appointment scheduling application with real-time updates, Google Calendar integration, and role-based access control.

![Booking Calendar Screenshot](https://via.placeholder.com/800x400?text=Booking+Calendar+Screenshot)

## 🚀 Overview

This Booking Calendar application provides a modern solution for scheduling and managing appointments. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it features a responsive UI, role-based access control, and real-time updates for a seamless booking experience.

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| **User Authentication** | JWT-based authentication with secure login and registration |
| **Role-Based Access** | Different permissions for Admin and User roles |
| **Interactive Calendar** | Week/month views using React calendar components |
| **Real-Time Updates** | Socket.IO implementation for instant booking notifications |
| **Google Calendar Sync** | OAuth 2.0 integration with Google Calendar |

### User Capabilities
- Browse and view available appointment slots
- Book, reschedule, and cancel appointments
- Receive real-time feedback on booking conflicts
- Access personalized dashboard of upcoming appointments
- Sync bookings with Google Calendar

### Admin Features
- Comprehensive user and role management
- Create recurring or one-time availability slots
- View, filter, and manage all system bookings
- Access analytics dashboard with booking metrics
- Generate reports on usage patterns

### Advanced Functionality
- **Smart Time Suggestions**: AI-style logic for optimal booking times
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Data Visualization**: Charts and graphs for booking analytics
- **Notifications**: Email confirmations via Nodemailer
- **Drag-and-Drop**: Interactive appointment rescheduling

## 🛠️ Technology Stack

<table>
  <tr>
    <th>Frontend</th>
    <th>Backend</th>
  </tr>
  <tr>
    <td>
      <ul>
        <li>React</li>
        <li>React Router</li>
        <li>Context API</li>
        <li>React-Big-Calendar/FullCalendar</li>
        <li>Tailwind CSS</li>
        <li>Recharts for data visualization</li>
        <li>Socket.IO Client</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Node.js</li>
        <li>Express.js</li>
        <li>MongoDB & Mongoose</li>
        <li>JWT Authentication</li>
        <li>Socket.IO</li>
        <li>Nodemailer</li>
        <li>Google Calendar API</li>
      </ul>
    </td>
  </tr>
</table>

## 📂 Project Structure

<details>
<summary><strong>Backend Structure</strong></summary>
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
</details>

<details>
<summary><strong>Frontend Structure</strong></summary>
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
│   │   └── ...
│   ├── services/
│   │   ├── availability.service.js
│   │   ├── booking.service.js
│   │   └── ...
│   ├── App.js
│   └── index.js
└── package.json
</details>

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/AnasBhr1/booking-calendar.git
cd booking-calendar

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Run both frontend and backend (from root directory)
cd ..
npm run dev
Environment Setup
Create a .env file in the backend directory:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/google/callback
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
📸 Screenshots
<details>
<summary>View Application Screenshots</summary>
Calendar View
Show Image
Admin Dashboard
Show Image
Booking Process
Show Image
</details>
💡 Usage Examples
<details>
<summary><strong>For Users</strong></summary>
Booking an Appointment

Log in to your account
Navigate to the Calendar page
Available slots appear in green, booked slots in gray
Click on an available time slot
Fill in the appointment details form
Submit to confirm your booking
Receive email confirmation automatically

Managing Your Bookings

Go to "My Bookings" from the navigation menu
View all your upcoming appointments
Click "Reschedule" or "Cancel" on any appointment
Follow the prompts to complete your action

</details>
<details>
<summary><strong>For Admins</strong></summary>
Setting Availability

Log in with admin credentials
Go to Admin Dashboard > Availability
Create new availability slots (single or recurring)
Set time ranges, days of week, and date limits
Save to update the system

Viewing Analytics

Access the Admin Dashboard
View booking statistics, popular time slots, and usage patterns
Use filters to analyze specific date ranges or user groups

</details>
👨‍💻 Development
bash# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
📬 Contact

GitHub: https://github.com/AnasBhr1/
Email: Anasbhr1@hotmail.com


⭐️ From Anas
