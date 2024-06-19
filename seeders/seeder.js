// seeder.js
const seedBrands = require("./seedBrand");
const seedMembers = require("./seedMember");
const seedWatches = require("./seedWatches");
const seedComments = require("./seedComment");
const mongoose = require("mongoose");

// Kết nối tới MongoDB
const url = "mongodb://127.0.0.1:27017/assignment_final_db";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const seedAllData = async () => {
  // await seedBrands();
  await seedMembers();
  // await seedWatches();
  // await seedComments();
};

// seedAllData()
//   .then(() => {
//     console.log("Database seeding completed.");
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error("Error seeding database:", error.message);
//     process.exit(1);
//   });

// Chạy hàm seedAllData
seedAllData()
  .then(() => {
    console.log("Database seeding completed.");
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error("Error seeding database:", error.message);
    mongoose.disconnect();
  });
