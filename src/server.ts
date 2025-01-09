import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import requestRoutes from "@/server/routes/requestRoutes";

const DATABSSE_LOCAL = "mongodb://localhost:27017/crisis-corner";

mongoose.connect(DATABSSE_LOCAL).then(() => {
  // console.log(con.connections);
  console.log("===== 🌉 DB connection successful! =====");
});

const app = express();

app.use(morgan("dev")); // morgan: HTTP request LOGGER

app.use(express.json()); // Middleware for JSON parsing
app.use("/api", requestRoutes); // Mount the routes under /api

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
