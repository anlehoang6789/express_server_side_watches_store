const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Member = require("../models/memberModel");

class MemberController {
  async register(req, res) {
    try {
      const { memberName, password, name } = req.body;
      const member = new Member({ memberName, password, name });
      await member.save();
      res.redirect("/members/login");
    } catch (err) {
      res.status(500).render("register", { error: err.message });
    }
  }

  async showRegisterPage(req, res) {
    res.render("members/register", { error: null });
  }

  async showLoginPage(req, res) {
    res.render("members/login", { message: null });
  }

  async login(req, res) {
    try {
      const { memberName, password } = req.body;
      const member = await Member.findOne({ memberName });
      if (!member) {
        return res
          .status(404)
          .render("members/login", { message: "Member not found" });
      }
      const isMatch = await bcrypt.compare(password, member.password);
      if (!isMatch) {
        return res
          .status(401)
          .render("members/login", { message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { memberId: member._id, isAdmin: member.isAdmin },
        process.env.JWT_SECRET
      );
      res.cookie("token", token, { httpOnly: true });

      if (member.isAdmin) {
        res.redirect("/members/accounts");
      } else {
        res.redirect("/members/profile");
      }
    } catch (err) {
      res.status(500).render("members/login", { message: err.message });
    }
  }

  async showProfilePage(req, res) {
    try {
      const member = req.user;
      res.render("members/profile", { member });
    } catch (err) {
      res.status(500).render("error", { error: err.message });
    }
  }

  async logout(req, res) {
    res.clearCookie("token");
    res.redirect("/");
  }

  async update(req, res) {
    const { memberId } = req.params;
    const { newName } = req.body;
    try {
      const updatedMember = await Member.findByIdAndUpdate(
        memberId,
        { name: newName },
        { new: true }
      );
      if (!updatedMember) {
        return res.status(404).render("error", { message: "Member not found" });
      }
      res.redirect("/members/profile");
    } catch (err) {
      res.status(500).render("error", { error: err.message });
    }
  }

  async changePassword(req, res) {
    const { memberId } = req.params;
    const { currentPassword, newPassword } = req.body;
    try {
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).render("error", { message: "Member not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, member.password);
      if (!isMatch) {
        return res.status(401).render("members/change-password", {
          member,
          error: "Invalid current password",
        });
      }

      const isSamePassword = await bcrypt.compare(newPassword, member.password);
      if (isSamePassword) {
        return res.status(400).render("members/change-password", {
          member,
          error: "New password cannot be the same as the current password",
        });
      }

      member.password = newPassword; // Mongoose pre-save hook will hash the new password
      await member.save();
      res.redirect("/members/profile");
    } catch (err) {
      res.status(500).render("error", { error: err.message });
    }
  }

  async getAllMembers(req, res) {
    try {
      const members = await Member.find();
      res.render("members/accounts", { members });
    } catch (err) {
      res.status(500).render("error", { error: err.message });
    }
  }

  async showEditProfilePage(req, res) {
    try {
      const { memberId } = req.params;
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).render("error", { message: "Member not found" });
      }
      res.render("members/edit-profile", { member });
    } catch (err) {
      res.status(500).render("error", { error: err.message });
    }
  }

  async showChangePasswordPage(req, res) {
    try {
      const { memberId } = req.params;
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).render("error", { message: "Member not found" });
      }
      res.render("members/change-password", { member, error: null });
    } catch (err) {
      res.status(500).render("error", { error: err.message });
    }
  }

  async deleteMember(req, res) {
    const { memberId } = req.params;
    try {
      const memberToDelete = await Member.findById(memberId);
      if (!memberToDelete) {
        return res.status(404).render("error", { message: "Member not found" });
      }

      if (memberToDelete.isAdmin) {
        return res
          .status(403)
          .render("error", { message: "Cannot delete admin user" });
      }

      await Member.findByIdAndDelete(memberId);
      res.redirect("/members/accounts");
    } catch (err) {
      res.status(500).render("error", { error: err.message });
    }
  }
}

module.exports = new MemberController();
