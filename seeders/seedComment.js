const Comment = require("../models/commentModel");

const seedComments = async () => {
  try {
    await Comment.deleteMany(); // Xóa hết các comment hiện có để tránh trùng lặp

    const comments = [
      {
        rating: 3,
        content: "Great watch!",
        author: "616f1919c3e32d3e5f4d20e5", // ID của Member tương ứng trong MongoDB
        watch: "616f1aaac3e32d3e5f4d20eb", // ID của Watch tương ứng trong MongoDB
      },
      {
        rating: 2,
        content: "Nice design.",
        author: "616f1919c3e32d3e5f4d20e6",
        watch: "616f1aaac3e32d3e5f4d20ec",
      },
      // Thêm các comment khác tùy ý bạn
    ];

    const insertedComments = await Comment.insertMany(comments);
    console.log("Inserted Comments:", insertedComments);
  } catch (error) {
    console.error("Error seeding comments:", error.message);
  }
};

module.exports = seedComments;
