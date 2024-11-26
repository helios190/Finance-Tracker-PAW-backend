Here’s an updated version of your README based on the API functionalities you’ve provided:

---

# Personal Finance Tracker

## 1. Summary of CRUD Operations

The Personal Finance Tracker is a web-based application designed to help users manage their income, expenses, and keep track of their personal finances. The application uses full CRUD (Create, Read, Update, Delete) functionality, allowing users to manage their financial records. Users can create new income and expense entries, update existing records when necessary, and remove outdated or incorrect entries.

The app also includes the ability to categorize income and expenses, offering users a more organized way to view their financial data. Furthermore, it enables users to track monthly, weekly, daily summaries, and calculate the balance based on income and expenses over time. To ensure security, the app uses JWT-based authentication, requiring users to log in or register before performing any financial transactions.

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
- **Balance Recalculation**: Recalculate and update user's balance based on income and expenses.
- **Monthly, Weekly, and Daily Summaries**: View income and expense summaries with additional features like income surge percentage (week-to-week or month-to-month).
- **Date Range Filtering**: Retrieve financial records within a specific date range.
- **Progress Tracking**: Track the user's balance progress towards a target goal.
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

---

## 4. API Endpoints

### Authentication:
- **Register User**: `POST /api/users/register`
- **Login User**: `POST /api/users/login`

### Income Management:
- **Get All Income**: `GET /api/income/:userId`
- **Add Income**: `POST /api/income/:userId`
- **Update Income**: `PUT /api/income/:userId/:id`
- **Delete Income**: `DELETE /api/income/:userId/:id`
- **Get Monthly Income Summary**: `GET /api/income/summary/:userId/:year`
- **Get Weekly Income Summary**: `GET /api/income/weekly/:userId/:year/:month`
- **Get Daily Income Summary**: `GET /api/income/daily/:userId/:year/:month`

### Expense Management:
- **Get All Expenses**: `GET /api/expenses/:userId`
- **Add Expense**: `POST /api/expenses/:userId`
- **Update Expense**: `PUT /api/expenses/:userId/:id`
- **Delete Expense**: `DELETE /api/expenses/:userId/:id`

### Financial Insights:
- **Get Balance**: `GET /api/balance/:userId`
- **Recalculate Balance**: `POST /api/balance/recalculate/:userId`
- **Get Balance Progress**: `GET /api/balance/progress/:userId`

### Date Range Filtering:
- **Get Income by Date Range**: `GET /api/income/range/:userId?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- **Get Expense by Date Range**: `GET /api/expenses/range/:userId?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

---

## 5. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Additional Notes:
- You can use **Postman** or any other API testing tool to interact with these endpoints.
- **JWT** tokens are required for accessing protected routes, so remember to pass the `Authorization` header in your requests with the token received after login.

This README now reflects all the endpoints and features based on the API functions you shared.
