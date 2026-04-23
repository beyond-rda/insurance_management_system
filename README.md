# Insurance Management System

This project is an end-to-end Insurance Management System built with React, SCSS, MUI, React Router, and Recharts. It supports policy registration, client management, claim processing, premium payment tracking, and analytics reporting.

## Stack

- React + Vite
- SCSS
- MUI
- MUI DataGrid
- React Router
- Recharts

## Modules

- `Policies`: register policy types, upload brochures, search, filter, sort, paginate, view, edit, and delete.
- `Clients`: register clients, validate inputs, view full details, edit, and delete.
- `Applications`: review submitted insurance applications and inspect their policy-specific fields.
- `Claims`: submit claims with document uploads, preview files, and approve or reject claims.
- `Payments`: track payments in a DataGrid and add new payment records through a validated form.
- `Reports`: visualize policy distribution, claim status, premium trends, branch performance, and risk levels using Recharts.

## Routing

- `/` - Login
- `/register` - Client registration
- `/admin/dashboard`
- `/admin/policies`
- `/admin/clients`
- `/admin/applications`
- `/admin/claims`
- `/admin/payments`
- `/admin/reports`
- `/client/home`
- `/client/policies`
- `/client/claims`

## Features Mapped to Assessment

- Component-based React architecture across layouts, pages, and context
- SCSS-based styling with shared global structure
- Dark and Light mode through MUI Theme Provider
- Theme toggle in the header and sidebar
- React Router navigation with admin and client dashboards
- MUI DataGrid with sorting, filtering, pagination, and search
- Dialogs for View and Delete actions
- Add New forms in Policies, Clients, Claims, Payments, and Reports
- File uploads with preview and validation
- Form validation for email, phone, numeric values, required fields, file type, and file size
- Recharts analytics dashboards
- Claim approval and rejection workflow
- Responsive admin and client layouts

## Demo Credentials

Use any valid email and any password with at least 4 characters.

## How to Run

```bash
npm install
npm run dev
```

## Presentation Tip

Use the admin role first to show full system control, then switch to the client role to show customer-facing policy application and claim submission.
