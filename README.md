# Voucher Seat Assignment App

A web application for randomly generating airline seat vouchers as part of a promotional campaign. Crew members can enter flight information, and the system will generate **three unique random seats** based on the selected aircraft's seating layout.

<p align="center">
  <img src="https://github.com/user-attachments/assets/3be96148-7bfd-4afc-95e5-abe2ba7b13c9" alt="App Preview" width="700" style="border-radius: 12px; border: 1px solid #e2e8f0;" />
</p>

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

### Backend
- Laravel 12 (PHP)

### Database
- SQLite

---

## Project Structure

```text
project/
├── frontend/      # React application
├── backend/       # Laravel application
└── README.md
```

---

## Prerequisites

Before running the project, make sure the following software is installed:

- PHP 8.2 or later
- Composer
- Node.js 18 or later
- npm

---

# Installation

## 1. Clone the repository

```bash
git clone [https://github.com/fadhlan36/airplane-voucher-seat.git](https://github.com/fadhlan36/airplane-voucher-seat.git)
cd airplane-voucher-seat
```

---

## Backend Setup (Laravel)

### 1. Navigate to the backend directory

```bash
cd backend
```

### 2. Install dependencies

```bash
composer install
```

### 3. Create the environment file

```bash
cp .env.example .env
```

### 4. Generate the application key

```bash
php artisan key:generate
```

### 5. Create the SQLite database

```bash
touch database/database.sqlite
```

### 6. Configure the database

Open the `.env` file and update the SQLite configuration.

Leave the `DB_DATABASE` value empty and comment it out, as Laravel will automatically use the default SQLite database file located at `database/database.sqlite`.

```env
DB_CONNECTION=sqlite

# DB_DATABASE=
```

### 7. Run database migrations

```bash
php artisan migrate
```

### 8. Start the backend server

```bash
php artisan serve
```

The backend will be available at:

```text
[http://127.0.0.1:8000](http://127.0.0.1:8000)
```

---

## Frontend Setup (React)

### 1. Navigate to the frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

```bash
cp .env.example .env
```

Update the API URL:

```env
VITE_API_BASE_URL=[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
```

### 4. Start the development server

```bash
npm run dev
```

Open the URL displayed in the terminal (usually):

```text
http://localhost:5173
```

---

# Usage

1. **Fill in the flight & crew information:**
   - Crew Name
   - Crew ID
   - Flight Number
   - Flight Date
   - Aircraft Type

   <p align="center">
     <img src="https://github.com/user-attachments/assets/7f42c88c-ccb1-4f7b-ae41-486437f4866f" alt="Fill in form" width="600" style="border-radius: 8px;" />
   </p>

2. **Click "Generate Vouchers":**

   <p align="center">
     <img src="https://github.com/user-attachments/assets/3be96148-7bfd-4afc-95e5-abe2ba7b13c9" alt="Generated Vouchers" width="600" style="border-radius: 8px;" />
   </p>

3. **Application Behavior:**
   - Checks whether a voucher already exists for the specified flight number and date.
   - Generates **three unique random seats** if no voucher exists.
   - Displays an error message if a voucher has already been generated for that specific flight and date.

   <p align="center">
     <img src="https://github.com/user-attachments/assets/e20f17e8-d0da-45cc-8b8b-256100a8e61a" alt="Error validation" width="600" style="border-radius: 8px;" />
   </p>

---

# API Endpoints

## POST `/api/check`

Checks whether a voucher assignment already exists for the specified flight number and date.

### Request

```json
{
  "flightNumber": "GA102",
  "date": "2025-07-12"
}
```

### Response

```json
{
  "exists": false
}
```

---

## POST `/api/generate`

Generates three unique random seats and stores the voucher in the database.

### Request

```json
{
  "name": "Sarah",
  "id": "98123",
  "flightNumber": "GA102",
  "date": "2025-07-12",
  "aircraft": "Airbus 320"
}
```

### Success Response (201 Created)

```json
{
  "success": true,
  "seats": [
    "3B",
    "7C",
    "14D"
  ]
}
```

### Conflict Response (409 Conflict)

```json
{
  "success": false,
  "message": "A voucher has already been generated for this flight and date."
}
```

---

# Aircraft Seat Layout

| Aircraft Type | Row Range | Seat Columns |
|---------------|----------:|--------------|
| **ATR** | 1–18 | A, C, D, F |
| **Airbus 320** | 1–32 | A, B, C, D, E, F |
| **Boeing 737 Max** | 1–32 | A, B, C, D, E, F |

---

# Technical Notes

- Backend validation is handled using **Laravel Form Request** classes.
- Seat generation logic is implemented in `App\Services\SeatGeneratorService`.
- A database-level **unique constraint** is applied to the combination of `flight_number` and `flight_date`. This prevents duplicate voucher assignments, even if multiple requests are submitted simultaneously (race condition).
