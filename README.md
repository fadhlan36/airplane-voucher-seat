# Installation

## 1. Clone the repository

```bash
git clone https://github.com/fadhlan36/airplane-voucher-seat.git
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

```
http://127.0.0.1:8000
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
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### 4. Start the development server

```bash
npm run dev
```

Open the URL displayed in the terminal (usually):

```
http://localhost:5173
```
