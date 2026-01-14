# MMS Backend API

Node.js + Express + PostgreSQL backend for the Membership Management System.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure your database credentials and JWT secret.

4. Create the PostgreSQL database:
```bash
createdb membership_db
```

5. Initialize the database schema:
```bash
npm run init-db
```

This will create all tables, indexes, and load sample data.

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (requires auth)
- `POST /api/auth/logout` - Logout (requires auth)

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create member (admin/staff only)
- `PUT /api/members/:id` - Update member (admin/staff only)
- `DELETE /api/members/:id` - Delete member (admin/staff only)
- `GET /api/members/stats` - Get member statistics

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Record payment (admin/staff only)
- `GET /api/payments/revenue` - Get total revenue
- `GET /api/payments/revenue/monthly` - Get monthly revenue

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin/staff only)
- `PUT /api/events/:id` - Update event (admin/staff only)
- `DELETE /api/events/:id` - Delete event (admin/staff only)
- `POST /api/events/register` - Register member to event
- `DELETE /api/events/:eventId/unregister/:memberId` - Unregister member
- `GET /api/events/:id/registrations` - Get event registrations
- `POST /api/events/checkin` - Check-in member to event
- `GET /api/events/:id/attendance` - Get event attendance

### Staff (Admin only)
- `GET /api/staff` - Get all staff
- `PUT /api/staff/:id` - Update staff member

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Reports
- `GET /api/reports/daily` - Get daily statistics
- `GET /api/reports/monthly` - Get monthly statistics

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database Schema

The database includes the following tables:
- user_profiles - User accounts and authentication
- membership_plans - Membership plan definitions
- members - Member records
- payments - Payment transactions
- events - Event information
- event_registrations - Event registrations
- attendance - Event attendance records
- audit_logs - System audit trail

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── memberController.js  # Member management
│   ├── paymentController.js # Payment management
│   ├── eventController.js   # Event management
│   ├── staffController.js   # Staff management
│   ├── dashboardController.js
│   └── reportController.js
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── validation.js        # Input validation
│   └── auditLog.js          # Audit logging
├── models/
│   ├── User.js
│   ├── Member.js
│   ├── Payment.js
│   ├── Event.js
│   └── MembershipPlan.js
├── routes/
│   ├── auth.js
│   ├── members.js
│   ├── payments.js
│   ├── events.js
│   ├── staff.js
│   ├── dashboard.js
│   └── reports.js
├── database/
│   ├── schema.sql           # Database schema
│   └── init.js              # Database initialization script
├── app.js                   # Express app configuration
├── server.js                # Server entry point
└── package.json
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (admin, staff, viewer)
- Input validation and sanitization
- SQL injection prevention
- CORS protection
- Helmet.js security headers
- Audit logging for all actions

## Error Handling

The API returns standardized error responses:
```json
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

## Development

Run with nodemon for auto-reload:
```bash
npm run dev
```

## License

MIT
