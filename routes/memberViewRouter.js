const express = require("express");
const memberRouter = express.Router();
const memberController = require("../controller/memberController");
const { requireAuth, requireAdmin } = require("../middleware/authenticate");

memberRouter.get("/register", memberController.showRegisterPage);
memberRouter.post("/register", memberController.register);
memberRouter.get("/login", memberController.showLoginPage);
memberRouter.post("/login", memberController.login);
memberRouter.get("/profile", requireAuth, memberController.showProfilePage);
memberRouter.get("/logout", memberController.logout);
memberRouter.post(
  "/:memberId/edit-profile",
  requireAuth,
  memberController.update
);
memberRouter.post(
  "/:memberId/change-password",
  requireAuth,
  memberController.changePassword
);
memberRouter.get(
  "/:memberId/edit-profile",
  requireAuth,
  memberController.showEditProfilePage
);
memberRouter.get(
  "/:memberId/change-password",
  requireAuth,
  memberController.showChangePasswordPage
);

memberRouter.get("/accounts", requireAdmin, memberController.getAllMembers);

memberRouter.delete("/:memberId", requireAdmin, memberController.deleteMember);

module.exports = memberRouter;
