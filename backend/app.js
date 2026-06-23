const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const scheduleRoutes =
  require("./routes/schedule");
const queueRoutes =
  require("./routes/queue");
const queueStateRoutes =
  require("./routes/queueState");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use(
  "/api/schedules",
  scheduleRoutes
);
app.use(
  "/api/queue",
  queueRoutes
);

app.use(
  "/api/queue-state",
  queueStateRoutes
);
// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CaneFlow API Running"
  });
});

module.exports = app;