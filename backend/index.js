const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./database/db.js');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require("./routes/transactionRoutes.js");
const settingsRoutes = require("./routes/settingsRoutes.js")
const dashboardRoutes =  require("./routes/dashboard.js");
const cookieParser = require('cookie-parser');


const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both ports
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', userRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/profile", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
