# CoFi MVP - Walkthrough

This document outlines the features implemented in the CoFi MVP and provides instructions on how to verify them manually.

## Prerequisites

- Node.js 18+
- PostgreSQL Database (configured in `.env`)

## Getting Started

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Setup Database**:
    Ensure your `.env` file has a valid `DATABASE_URL`.

    ```bash
    npx prisma generate
    npx prisma db push
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:3000`.

## Features & Verification Steps

### 1. User Management

- **Registration**:
  - Go to `/register`.
  - Fill in Name, Email, Password, and optional Income.
  - Submit. You should be redirected to Login.
- **Login**:
  - Go to `/login`.
  - Enter credentials.
  - Submit. You should be redirected to `/dashboard`.
- **Profile**:
  - Go to `/settings`.
  - Update Name or Income.
  - Verify the changes are saved and reflected in the sidebar.

### 2. Shared Groups & Invites

- **Create Group (via Invite)**:
  - Go to `/shared-group`.
  - If you have no group, you'll see an invite form.
  - Enter an email (e.g., `partner@example.com`).
  - **Dev Mode**: Check the browser console for the generated Invite Link (since emails are mocked).
- **Accept Invite**:
  - Open the Invite Link in a new browser/incognito window (or logout first).
  - Login as the invited user (register if needed).
  - Click "Aceitar" on the invite page.
  - You will be redirected to the dashboard and added to the group.
- **View Group**:
  - Go to `/shared-group`.
  - You should see all members listed with their division percentages (default 50/50).

### 3. Financial Management

- **Create Transaction**:
  - Go to `/transactions`.
  - Click "Nova Transação".
  - Fill in details (Amount, Description, Category).
  - Toggle "Compartilhar" to make it a group expense.
  - Submit.
- **View Transactions**:
  - The list should update with the new transaction.
  - Use tabs to filter "Pessoais" vs "Compartilhadas".
  - Verify that shared transactions show the "Compartilhado" badge.

### 4. Dashboard & Visualizations

- **Personal View**:
  - Go to `/dashboard`.
  - "Minhas Finanças" tab shows your personal income/expense/balance.
  - Chart shows your spending by category.
- **Shared View**:
  - Switch to "Finanças em Conjunto".
  - Shows group totals.
  - **Pending Balances**: Shows who owes whom based on shared transactions.
  - **Chart**: Shows group spending by category.

### 5. Notifications

- **In-App Alerts**:
  - Click the Bell icon in the header.
  - It shows unread notifications (e.g., "Invite Accepted", "New Shared Transaction").
  - Opening the popover marks them as read.

## Known Limitations (MVP)

- **Email Sending**: Emails are mocked and logged to the console.
- **Recurring Transactions**: Not yet implemented.
- **Open Finance**: Pluggy integration planned for Phase 2.
- **Automated Tests**: Skipped for MVP speed.

## Next Steps

1.  Deploy to Vercel + Neon/Supabase.
2.  Implement recurring transactions.
3.  Start Java backend migration planning.
