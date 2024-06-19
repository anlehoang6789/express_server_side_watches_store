const Member = require("../models/memberModel");
const bcrypt = require("bcrypt");

const seedMembers = async () => {
  try {
    await Member.deleteMany(); // Xóa hết các member hiện có để tránh trùng lặp

    const members = [
      {
        memberName: "user1",
        password: await bcrypt.hash("password1", 10),
        name: "User One",
      },
      {
        memberName: "user2",
        password: await bcrypt.hash("password2", 10), // Hash the password
        name: "User Two",
      },
      {
        memberName: "admin",
        password: await bcrypt.hash("adminpassword", 10), // Password của Admin
        name: "Admin User",
        isAdmin: true,
      },
      // Thêm các member khác tùy ý bạn
    ];

    const insertedMembers = await Member.insertMany(members);
    console.log("Inserted Members:", insertedMembers);
  } catch (error) {
    console.error("Error seeding members:", error.message);
  }
};

module.exports = seedMembers;
