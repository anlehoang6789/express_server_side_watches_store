const Brand = require("../models/brandModel");

const seedBrands = async () => {
  try {
    await Brand.deleteMany(); // Xóa hết các brand hiện có để tránh trùng lặp

    const brands = [
      { brandName: "Rolex" },
      { brandName: "Omega" },
      { brandName: "Seiko" },
      // Thêm các brand khác tùy ý bạn
    ];

    const insertedBrands = await Brand.insertMany(brands);
    console.log("Inserted Brands:", insertedBrands);
  } catch (error) {
    console.error("Error seeding brands:", error.message);
  }
};

module.exports = seedBrands;
