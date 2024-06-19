const jwt = require("jsonwebtoken");
const Member = require("../models/memberModel");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.locals.user = null; // No user logged in
      return next(); // Allow access if no token
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const member = await Member.findById(decoded.memberId);
    if (!member) {
      return res
        .status(404)
        .render("error", { message: "Member not found", error: {} });
    }
    req.user = member;
    res.locals.user = member; // Set the user object for use in views
    res.locals.isAdmin = member.isAdmin; // Set the isAdmin flag for use in views
    next();
  } catch (err) {
    res
      .status(500)
      .render("error", { message: "Authentication error", error: err });
  }
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .render("members/login", { message: "Unauthorized", error: {} });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).render("error", { message: "Forbidden", error: {} });
  }
  next();
};

module.exports = { authenticate, requireAuth, requireAdmin };
