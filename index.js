const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const restaurantRoutes = require("./routes/restaurantRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const addressRoutes = require("./routes/addressRoutes");
const paymentMethodRoutes = require("./routes/paymentMethodRoutes");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS middleware
// app.use(cors());

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
    credentials: true, // Allow credentials (cookies, tokens)
  })
);

// Handle preflight requests for all routes
app.options("*", cors());

// Body parser
app.use(express.json());

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);

// Home page route (protected)
app.get(
  "/api/home",
  require("./middleware/authMiddleware").protect,
  (req, res) => {
    res.json({ message: "Welcome to the homepage!", user: req.user });
  }
);

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Products page route (protected)
app.get(
  "/api/products",
  require("./middleware/authMiddleware").protect,
  (req, res) => {
    res.json({ message: "Welcome to the products page!", products: [] });
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
