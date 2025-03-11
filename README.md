
# Bootminds Ticketing System

A full-stack support ticketing system built with React, TypeScript, and Supabase. This application allows users to submit support tickets, view their ticket status, and chat with support staff. Administrators can manage tickets, respond to user inquiries, and track support metrics.

## Features

- **User Features**
  - Submit support tickets with issue categories
  - View all submitted tickets
  - Track ticket status and progress
  - Real-time chat with support staff
  - Responsive design for mobile and desktop

- **Admin Features**
  - Secure admin authentication
  - Comprehensive dashboard with ticket metrics
  - Manage and update ticket status
  - Filter and search through tickets
  - Live chat with users
  - Add private notes to tickets

- **Technical Features**
  - Real-time updates using Supabase's real-time API
  - Secure data storage with Row Level Security
  - Clean, modern UI with responsive design
  - Type safety with TypeScript

## Technologies Used

- **Frontend**
  - React
  - TypeScript
  - TailwindCSS
  - React Router
  - React Query
  - Lucide Icons
  - shadcn/ui components

- **Backend**
  - Supabase (PostgreSQL database)
  - Supabase Authentication
  - Supabase Real-time API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Undead6969/Ticketing-system.git
   cd Ticketing-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Admin Login

- Username: admin
- Password: bootminds2024

## Project Structure

```
/src
  /components        # UI components
  /contexts          # React Context providers
  /hooks             # Custom React hooks
  /lib               # Utility functions
  /pages             # Page components
  /integrations      # Supabase integration
```

## Database Structure

### Tables

- **tickets** - Stores ticket information
- **messages** - Stores chat messages between users and admin
- **admins** - Stores admin login information

## License

This project is licensed under the MIT License.

## Credits

Developed by Bootminds.
