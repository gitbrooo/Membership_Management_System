# Membership Management System (MMS)

A complete, production-ready web-based Membership Management System built with React, Supabase, and TypeScript. This system automates member management, payments, events, and reporting for organizations with role-based access control and comprehensive audit logging.

## Features

### Core Functionality

- **Member Management**: Register, update, view, and manage member profiles with membership plan assignments and renewal tracking
- **Payment Management**: Record payments, track payment history, support multiple payment methods, and export payment reports
- **Event Management**: Create and manage events, handle member registrations, track attendance with check-in functionality
- **Reporting & Analytics**: Generate daily and monthly reports with visual charts, member growth trends, and revenue summaries
- **Staff Account Management**: Admin-controlled user management with role assignment and permission control
- **Audit Logging**: Complete audit trail for logins, data changes, payments, and event actions

### User Roles

- **Administrator**: Full system access including staff management, system configuration, and audit log viewing
- **Staff**: Manage members, payments, and events; generate reports
- **Viewer**: Read-only access to view members, payments, events, and reports

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

### Backend
- Supabase (PostgreSQL database)
- Supabase Auth for authentication
- Row Level Security (RLS) for data protection
- Real-time subscriptions

### Database
- PostgreSQL with comprehensive schema
- Indexed and normalized tables
- Soft deletes for data integrity
- Audit logging system

## Architecture

The system follows a modern three-tier architecture:

1. **Frontend Layer**: React SPA with component-based design and role-based UI rendering
2. **API Layer**: Supabase provides RESTful API access with built-in authentication and authorization
3. **Database Layer**: PostgreSQL with RLS policies ensuring data security at the database level

## Database Schema

### Core Tables

- `user_profiles`: Extended user information with roles
- `members`: Member information and membership details
- `membership_plans`: Available membership plan definitions
- `payments`: Payment records with full transaction history
- `events`: Event details and capacity management
- `event_registrations`: Member event registrations
- `attendance`: Event attendance tracking
- `audit_logs`: Complete system audit trail

## Installation & Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account

### Environment Configuration

The Supabase connection is already configured. The following environment variables are available in your `.env` file:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Access the application at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Production Deployment

The application can be deployed to any static hosting service:

- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## Getting Started

### First Time Setup

When you first access the application, you'll automatically see a **First-Time Setup** page that lets you create the initial administrator account.

1. **Create Admin Account**:
   - Open the application in your browser
   - Fill in the setup form with your details:
     - Full Name
     - Email
     - Password (minimum 6 characters)
     - Confirm Password
   - Click "Create Administrator Account"
   - You'll be automatically logged in with full admin access

2. **Initial Configuration**:
   - Review the pre-loaded membership plans or create custom ones
   - Add staff members with appropriate roles (Admin/Staff/Viewer)
   - Begin adding your organization's members
   - Configure events and start tracking payments

### Adding New Users

After the initial setup, new users can join the system in two ways:

1. **Self-Registration** (Recommended for team members):
   - On the login page, click "Don't have an account? Sign up"
   - Fill in the registration form with:
     - Full Name
     - Email
     - Password
     - Select Role (Viewer, Staff, or Administrator)
   - Click "Create Account"
   - Automatically logged in and ready to use

2. **Admin Creation**:
   - Administrators can create accounts through Staff Management
   - Navigate to Staff Management
   - Click "Add Staff Member"
   - Fill in user details and assign role

### Logging In

Use your email and password to sign in. If you don't have an account, click "Don't have an account? Sign up" on the login page.

## User Guide

### Administrator Tasks

- **Dashboard**: View system-wide statistics and metrics
- **Member Management**: Add, edit, and manage all members
- **Payment Tracking**: Record and view payment history
- **Event Management**: Create events and manage registrations
- **Staff Management**: Create staff accounts and assign roles
- **Reports**: Generate and export comprehensive reports
- **Audit Logs**: Review system activity and changes

### Staff Tasks

- **Member Management**: Register and update member information
- **Payment Processing**: Record member payments
- **Event Management**: Create events and handle registrations
- **Attendance Tracking**: Mark member attendance at events
- **Report Generation**: View and export reports

### Viewer Tasks

- **View Members**: Browse member directory
- **View Payments**: Review payment history
- **View Events**: See upcoming and past events
- **View Reports**: Access system reports

## Security Features

### Authentication
- Secure password hashing (bcrypt via Supabase Auth)
- JWT-based session management
- Automatic session refresh

### Authorization
- Role-based access control (RBAC)
- Row Level Security (RLS) policies
- Permission checks at both frontend and database levels

### Data Protection
- Input validation and sanitization
- Soft deletes for data recovery
- Audit logging for all critical operations
- HTTPS enforcement in production

## API Documentation

The system uses Supabase's auto-generated REST API. Key endpoints include:

### Members
- `GET /rest/v1/members`: List all members
- `POST /rest/v1/members`: Create a new member
- `PATCH /rest/v1/members?id=eq.{id}`: Update a member
- `DELETE /rest/v1/members?id=eq.{id}`: Soft delete a member

### Payments
- `GET /rest/v1/payments`: List all payments
- `POST /rest/v1/payments`: Record a new payment

### Events
- `GET /rest/v1/events`: List all events
- `POST /rest/v1/events`: Create a new event
- `POST /rest/v1/event_registrations`: Register a member for an event

All API requests require authentication via the Supabase client.

## Troubleshooting

### Common Issues

**Cannot Login**
- Verify your credentials are correct
- Ensure your account is active
- Check that your user profile exists in the database

**Permission Denied Errors**
- Verify you have the correct role assigned
- Check that RLS policies are properly configured
- Ensure you're authenticated

**Data Not Appearing**
- Check browser console for errors
- Verify database connection
- Ensure RLS policies allow data access for your role

## Performance Considerations

- The system is optimized for 50+ concurrent users
- Database indexes are in place for frequently queried columns
- Efficient queries with proper JOIN usage
- Pagination can be implemented for large datasets

## Backup and Recovery

### Database Backups

Supabase provides automatic daily backups. For additional protection:

1. Use Supabase's point-in-time recovery feature
2. Export data regularly using the reporting feature
3. Maintain separate backups of critical data

### Data Recovery

- Soft deletes allow recovery of accidentally deleted records
- Audit logs provide a complete history of changes
- Contact your Supabase administrator for database restoration

## Maintenance

### Regular Tasks

- Review audit logs weekly
- Update expired memberships
- Generate and archive monthly reports
- Clean up old audit logs (older than required retention period)
- Review and update membership plans as needed

### Updates

To update the application:

1. Pull the latest changes
2. Run `npm install` to update dependencies
3. Run `npm run build` to create a new production build
4. Deploy the new build to your hosting service

## Support

For technical support:
- Review this documentation
- Check the audit logs for system issues
- Contact your system administrator

## License

This project is proprietary software. All rights reserved.

## Credits

Built with modern web technologies:
- React for the user interface
- Supabase for backend and database
- Tailwind CSS for styling
- TypeScript for type safety
