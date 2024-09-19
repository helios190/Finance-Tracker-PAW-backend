# Personal Finance Tracker

## 1. Summary of CRUD Operations

The Personal Finance Tracker is a web-based application designed to help users manage their income, expenses, and keep track of their personal finances. The application uses full CRUD (Create, Read, Update, Delete) functionality, allowing users to manage their financial records. Users can create new income and expense entries, update existing records when necessary, and remove outdated or incorrect entries.

The app also includes the ability to categorize income and expenses, offering users a more organized way to view their financial data. Furthermore, it enables users to track monthly summaries to see how much they've earned and spent over time. To ensure security, the app uses JWT-based authentication, requiring users to log in or register before performing any financial transactions.

Through this intuitive system, users can efficiently manage their finances, analyze spending patterns, and make informed decisions. The RESTful API provided is built using Express.js for routing, MongoDB for database management, and JWT for secure authentication.

---

## 2. Tech Stack and Features

### Tech Stack:
- **Backend Framework**: Node.js (Express)
- **Database**: MongoDB (via MongoDB Atlas)
- **Authentication**: JSON Web Tokens (JWT)
- **Password Encryption**: Bcrypt
- **Middleware**: Express.js

### Features:
- **User Authentication**: Register, login, and protect routes using JWT.
- **Income Management**: Create, read, update, delete income entries.
- **Expense Management**: Create, read, update, delete expense entries.
- **Categorization**: Income and expenses can be categorized.
- **Monthly Summaries**: View total income and expenses per month.
- **Date Range Filtering**: Retrieve financial records within a specific date range.
- **Responsive API**: RESTful API routes to manage all CRUD operations.

---

## 3. Tutorial on How to Start

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/personal-finance-tracker.git
cd personal-finance-tracker
```

### Step 2: Install Dependencies
Use `npm` to install all necessary dependencies:
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the project’s root directory and set the following environment variables:
```env
MONGO_URI=mongodb+srv://<your_username>:<your_password>@<your_cluster>/finance-tracker?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Step 4: Start the MongoDB Server
Make sure your MongoDB instance is running. If you're using **MongoDB Atlas**, ensure that your connection string is correctly placed in the `.env` file.

### Step 5: Run the Application
Start the application using **nodemon** or **node**:
```bash
nodemon app.js
```

### Step 6: Access the API
Your app will run on `http://localhost:5000`. You can test the API using tools like **Postman** or **curl**.

### Sample Endpoints:
- **Register User**: `POST /api/users/register`
- **Login User**: `POST /api/users/login`
- **Get Income**: `GET /api/income`
- **Add Income**: `POST /api/income`
- **Update Income**: `PUT /api/income/:id`
- **Delete Income**: `DELETE /api/income/:id`
- **Get Expense**: `GET /api/expenses`
- **Add Expense**: `POST /api/expenses`
- **Update Expense**: `PUT /api/expenses/:id`
- **Delete Expense**: `DELETE /api/expenses/:id`
- **Monthly Summary**: `GET /api/income/summary/:year/:month`
