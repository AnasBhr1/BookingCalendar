
# 📅 Booking Calendar

A comprehensive **MERN-stack appointment scheduling application** with real-time updates, Google Calendar integration, and role-based access control.

![Booking Calendar Screenshot](https://via.placeholder.com/800x400?text=Booking+Calendar+Screenshot)

---

## 🚀 Overview

This Booking Calendar application provides a modern solution for scheduling and managing appointments. Built with the **MERN stack** (MongoDB, Express.js, React, Node.js), it features a responsive UI, role-based access control, and real-time updates for a seamless booking experience.

---

## ✨ Features

### ✅ Core Features

| Feature | Description |
|--------|-------------|
| **User Authentication** | JWT-based authentication with secure login and registration |
| **Role-Based Access** | Permissions based on roles: Admin and User |
| **Interactive Calendar** | Week/month views using React calendar components |
| **Real-Time Updates** | Socket.IO for instant booking notifications |
| **Google Calendar Sync** | OAuth 2.0 integration with Google Calendar |

### 👤 User Capabilities

- Browse available appointment slots
- Book, reschedule, and cancel appointments
- Receive real-time conflict feedback
- Access dashboard with upcoming appointments
- Sync bookings with Google Calendar

### 🛡️ Admin Features

- Manage users and roles
- Create recurring or one-time availability slots
- View and manage all bookings
- Access analytics dashboard with metrics
- Generate reports on usage patterns

### ⚙️ Advanced Functionality

- **Smart Time Suggestions** using AI-style logic
- **Responsive Design** (Mobile-first with Tailwind CSS)
- **Dark/Light Mode** with localStorage persistence
- **Data Visualization** via charts and graphs
- **Email Notifications** using Nodemailer
- **Drag-and-Drop Rescheduling** for appointments

---

## 🛠️ Technology Stack

| Frontend | Backend |
|----------|---------|
| React, React Router, Context API | Node.js, Express.js |
| React-Big-Calendar / FullCalendar | MongoDB & Mongoose |
| Tailwind CSS | JWT Authentication |
| Recharts (Analytics) | Socket.IO |
| Socket.IO Client | Nodemailer |
|  | Google Calendar API |

---

## 📂 Project Structure

<details>
<summary><strong>🔙 Backend</strong></summary>

```
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
```

</details>

<details>
<summary><strong>🖥️ Frontend</strong></summary>

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.js
│   │   │   ├── Navigation.js
│   │   ├── BookingCard.js
│   │   ├── BookingForm.js
│   │   ├── DarkModeToggle.js
│   │   ├── GoogleCalendarSettings.js
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
│   ├── services/
│   │   ├── availability.service.js
│   │   ├── booking.service.js
│   ├── App.js
│   └── index.js
├── package.json
```

</details>

---

## ⚙️ Installation & Setup

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
```

### Environment Setup

Create a `.env` file in the `backend/` directory with the following:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/google/callback
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

---

## 📸 Screenshots

<details>
<summary>View Application Screenshots</summary>

**Calendar View**  
![Calendar View](https://via.placeholder.com/800x400?text=Calendar+View)

**Admin Dashboard**  
![Admin Dashboard](https://via.placeholder.com/800x400?text=Admin+Dashboard)

**Booking Process**  
![Booking Process](https://via.placeholder.com/800x400?text=Booking+Process)

</details>

---

## 💡 Usage Examples

<details>
<summary><strong>👥 For Users</strong></summary>

### Booking an Appointment

1. Log in to your account  
2. Navigate to the Calendar page  
3. Available slots appear in green, booked slots in gray  
4. Click on a time slot  
5. Fill in the appointment details  
6. Submit to confirm your booking  
7. Receive confirmation via email

### Managing Your Bookings

- Go to **"My Bookings"**
- View upcoming appointments
- Click **Reschedule** or **Cancel**
- Follow prompts to complete the action

</details>

<details>
<summary><strong>🛠️ For Admins</strong></summary>

### Setting Availability

- Log in as admin
- Go to **Dashboard > Availability**
- Create new slots (recurring or one-time)
- Set time ranges and day constraints
- Save to update availability

### Viewing Analytics

- Visit **Admin Dashboard**
- Analyze booking stats, peak times, and trends
- Filter by date or user group

</details>

---

## 👨‍💻 Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to fork the repo and submit a pull request. 🎉

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for more information.

---

## 📬 Contact

- GitHub: [AnasBhr1](https://github.com/AnasBhr1)
- Email: [anasbhr1@hotmail.com](mailto:anasbhr1@hotmail.com)

---

⭐️ Made with passion by **Anas**
