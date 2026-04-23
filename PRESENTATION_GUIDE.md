# Presentation Guide

## 1. Project Introduction

Say:

"This project is an Insurance Management System built with React, SCSS, MUI, React Router, and Recharts. It digitalizes policy registration, client management, claims processing, payments, and analytics."

## 2. Technologies Used

Say:

"I used React for component-based architecture, SCSS for styling, MUI for modern UI components, MUI DataGrid for advanced tables, React Router for page navigation, and Recharts for analytics dashboards."

## 3. Admin Demo Flow

1. Login as `Admin`
2. Open `Dashboard`
3. Explain summary cards and policy distribution
4. Open `Policies`
5. Show:
   - Add new policy
   - Search and filter
   - View dialog
   - Edit and delete dialogs
   - Brochure upload validation
6. Open `Clients`
7. Show:
   - Add client
   - Validation
   - View client details
8. Open `Claims`
9. Show:
   - Add claim
   - File upload preview
   - Approve and reject buttons
10. Open `Payments`
11. Show:
   - Payment table
   - Add payment form
12. Open `Reports`
13. Show:
   - Policy distribution chart
   - Claims status chart
   - Premium income trend
   - Branch performance
   - Risk levels chart

## 4. Client Demo Flow

1. Login as `Client`
2. Open `Client Home`
3. Open `Policies`
4. Show:
   - Browse plans
   - Filter by type
   - Open details dialog
   - Apply using the policy-specific form
5. Open `My Claims`
6. Show claim submission and tracking

## 5. Key Logic to Explain

- `AppContext` stores the shared state for policies, clients, claims, payments, and applications.
- Each module is a separate React page.
- `DataGrid` is used for structured records with sorting, search, filtering, and pagination.
- `Dialog` is used for View, Add, Edit, and Delete flows.
- Validation is done before data is saved.
- `Recharts` converts system data into visual analytics.
- Dark/Light mode is controlled globally using `ThemeProvider`.

## 6. Short Closing

Say:

"In summary, this system provides a complete insurance workflow from registration to reporting, with responsive design, validation, analytics, and role-based navigation."
