const Watch = require("../models/watchesModel");

const seedWatches = async () => {
  try {
    await Watch.deleteMany(); // Xóa hết các watch hiện có để tránh trùng lặp

    const watches = [
      {
        watchName: "Submariner",
        image: "https://example.com/submariner.jpg",
        price: 10000,
        Automatic: true,
        watchDescription: "Iconic diving watch from Rolex.",
        brand: "6670471adb3f159a9a372751", // ID của Brand tương ứng trong MongoDB
      },
      {
        watchName: "Speedmaster",
        image: "https://example.com/speedmaster.jpg",
        price: 8000,
        Automatic: false,
        watchDescription: "Legendary chronograph from Omega.",
        brand: "6670471adb3f159a9a372752", // ID của Brand tương ứng trong MongoDB
      },
      // Thêm các watch khác tùy ý bạn
    ];

    const insertedWatches = await Watch.insertMany(watches);
    console.log("Inserted Watches:", insertedWatches);
  } catch (error) {
    console.error("Error seeding watches:", error.message);
  }
};

module.exports = seedWatches;
