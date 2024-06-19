const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const memberSchema = new Schema(
  {
    memberName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
memberSchema.pre("save", async function (next) {
  const member = this;
  if (!member.isModified("password")) return next();
  const hash = await bcrypt.hash(member.password, 10);
  member.password = hash;
  next();
});

// Method to compare password
memberSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
