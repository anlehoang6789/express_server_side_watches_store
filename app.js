var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const mongoose = require("mongoose");
const watchesRouter = require("./routes/watchesViewRouter");
const memberRouter = require("./routes/memberViewRouter");
const brandRouter = require("./routes/brandViewRouter");
// Middleware xử lý xác thực
const { authenticate } = require("./middleware/authenticate");
require("dotenv").config();
const methodOverride = require("method-override");

var app = express();

const url = "mongodb://127.0.0.1:27017/assignment_final_db";
const connect = mongoose.connect(url);

connect
  .then((db) => {
    console.log("connect successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the application if connection fails
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));

app.use(authenticate);

app.use("/", watchesRouter); // Dùng watchesRouter cho đường dẫn /
app.use("/brands", brandRouter);
app.use("/members", memberRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { message: err.message, error: err });
});

module.exports = app;
