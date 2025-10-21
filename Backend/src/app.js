const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const routes = require("./routes/routes");
const cors = require("cors");
const connectDB = require("./config");



app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", routes);

connectDB();


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});