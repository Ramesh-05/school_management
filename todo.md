# School Management System - MVP Todo

## Overview
Building a comprehensive School Management System with role-based dashboards and core functionality.

## MVP Implementation Plan (8 files max)

### 1. Core Files to Create/Modify:

1. **src/pages/Index.tsx** - Landing page with navigation to different sections
2. **src/pages/Dashboard.tsx** - Main dashboard with role-based views
3. **src/pages/Admissions.tsx** - Admissions enquiry form and CRM
4. **src/pages/Academics.tsx** - Academic management (timetable, attendance, homework)
5. **src/pages/Finance.tsx** - Fee management and financial overview
6. **src/components/RoleBasedLayout.tsx** - Layout component with role-based navigation
7. **src/lib/auth.ts** - Authentication and role management utilities
8. **src/lib/data.ts** - Mock data and data management utilities

### 2. Key Features to Implement:

#### Public Site (Landing Page)
- Navigation: About, Courses, Admissions, Contact
- "Apply Now" button leading to admissions pipeline
- Modern, responsive design

#### Role-Based Dashboards
- **Admin Dashboard**: Fees snapshot, admissions funnel, attendance overview, announcements
- **Teacher Dashboard**: Today's timetable, classes, attendance marking, homework assignment
- **Student/Parent Dashboard**: Timetable view, homework, fees status, announcements
- **Accountant Dashboard**: Collections vs outstanding, dues overview

#### Core Modules (Simplified MVP)
- **Admissions CRM**: Lead form, application status tracking
- **Academic Management**: Basic timetable, attendance tracking, homework assignment
- **Fee Management**: Fee structure, payment status, basic reports
- **Communication**: Announcements system

### 3. Technical Implementation:
- Use localStorage for data persistence (MVP approach)
- Role-based routing and component rendering
- Modern UI with Shadcn-UI components
- Responsive design for mobile compatibility
- Form validation and state management

### 4. Data Structure (localStorage based):
- Users with roles (admin, teacher, student, parent, accountant)
- Students with academic and fee information
- Classes, subjects, and timetables
- Attendance records
- Fee structures and payment records
- Announcements and communications

This MVP focuses on the most essential features while maintaining the core architecture for future expansion.