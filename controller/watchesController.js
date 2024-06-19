const Watch = require("../models/watchesModel");
const Comment = require("../models/commentModel");
const Brand = require("../models/brandModel");
const mongoose = require("mongoose");

class WatchController {
  async getAllWatches(req, res) {
    try {
      const watches = await Watch.find().populate("brand", "brandName");
      const brands = await Brand.find().select("brandName");
      res.render("watches/index", { watches, brands });
    } catch (err) {
      res
        .status(500)
        .render("error", { message: "Failed to retrieve watches", error: err });
    }
  }

  async getWatchById(req, res) {
    const { id } = req.params;
    // Kiểm tra xem ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .render("error", { message: "Invalid watch ID", error: {} });
    }
    try {
      const watch = await Watch.findById(id)
        .populate("brand", "brandName")
        .populate({
          path: "comments",
          populate: {
            path: "author",
            select: "memberName", // Chỉ chọn các trường cần thiết từ tác giả
          },
        });

      if (!watch) {
        return res
          .status(404)
          .render("error", { message: "Watch not found", error: {} });
      }

      // Kiểm tra nếu người dùng đã bình luận
      const userComment = req.user
        ? watch.comments.find((comment) =>
            comment.author._id.equals(req.user._id)
          )
        : null;

      res.render("watches/detail", {
        watch,
        userComment,
        message: req.query.message,
      });
    } catch (err) {
      res.status(500).render("error", {
        message: "Failed to retrieve watch details",
        error: err,
      });
    }
  }

  async submitComment(req, res) {
    const { id } = req.params;
    const { rating, content } = req.body;
    try {
      // Kiểm tra xem người dùng đã bình luận chưa
      const existingComment = await Comment.findOne({
        watch: id,
        author: req.user._id,
      });
      if (existingComment) {
        return res
          .status(400)
          .redirect(`/watches/${id}?message=already_commented`);
      }

      const comment = new Comment({
        rating,
        content,
        author: req.user._id,
        watch: id,
      });
      await comment.save();

      await Watch.findByIdAndUpdate(id, { $push: { comments: comment._id } });

      res.redirect(`/watches/${id}`);
    } catch (err) {
      res
        .status(500)
        .render("error", { message: "Failed to submit comment", error: err });
    }
  }

  async searchWatchByName(req, res) {
    const { name, brand } = req.query;

    // Validate search query
    if (!name || name.trim() === "") {
      return res.status(400).render("error", {
        message: "Invalid search query",
        error: { message: "Name parameter is missing or empty" },
      });
    }

    try {
      let query = { watchName: { $regex: name, $options: "i" } };

      // If brand is selected, add filter condition
      if (brand && mongoose.Types.ObjectId.isValid(brand)) {
        query.brand = brand;
      }

      // Fetch watches and brands
      const watches = await Watch.find(query).populate("brand", "brandName");
      const brands = await Brand.find().select("brandName");

      if (watches.length === 0) {
        return res.render("watches/index", {
          watches: [],
          brands,
          message: "No watches found.",
        });
      }

      // Pass watches and brands to the view
      res.render("watches/index", { watches, brands });
    } catch (err) {
      console.error("Error searching watches:", err);
      return res.status(500).render("error", {
        message: "Failed to search watches",
        error: err,
      });
    }
  }

  async filterWatchesByBrand(req, res) {
    const { brandId } = req.params;
    try {
      const watches = await Watch.find({ brand: brandId }).populate(
        "brand",
        "brandName"
      );
      res.render("watches/index", { watches });
    } catch (err) {
      res.status(500).render("error", {
        message: "Failed to filter watches by brand",
        error: err,
      });
    }
  }

  async createWatchForm(req, res) {
    try {
      const brands = await Brand.find().select("brandName");
      res.render("watches/new", { brands });
    } catch (err) {
      res.status(500).render("error", {
        message: "Failed to render watch form",
        error: err,
      });
    }
  }

  async createWatch(req, res) {
    const { watchName, image, price, brand, watchDescription, automatic } =
      req.body;
    try {
      const newWatch = new Watch({
        watchName,
        image,
        price,
        brand,
        watchDescription,
        automatic,
      });
      await newWatch.save();
      res.redirect("/");
    } catch (err) {
      res
        .status(500)
        .render("error", { message: "Failed to create watch", error: err });
    }
  }

  async updateWatch(req, res) {
    const { id } = req.params;
    const { watchName, image, price, watchDescription, automatic, brand } =
      req.body;
    try {
      const updatedWatch = await Watch.findByIdAndUpdate(
        id,
        {
          watchName,
          image,
          price,
          watchDescription,
          automatic,
          brand,
        },
        { new: true }
      ).populate("brand", "brandName");

      if (!updatedWatch) {
        throw new Error("Watch not found");
      }

      res.redirect(`/watches/${id}`);
    } catch (err) {
      res.status(500).render("error", {
        message: "Failed to update watch",
        error: err,
      });
    }
  }

  async deleteWatch(req, res) {
    const { id } = req.params;
    try {
      const deletedWatch = await Watch.findByIdAndDelete(id);
      if (!deletedWatch) {
        return res.status(404).render("error", { message: "Watch not found" });
      }
      res.redirect("/");
    } catch (err) {
      res
        .status(500)
        .render("error", { message: "Failed to delete watch", error: err });
    }
  }

  async renderEditWatch(req, res) {
    const { id } = req.params;
    try {
      const watch = await Watch.findById(id).populate("brand", "brandName");
      const brands = await Brand.find().select("brandName");
      if (!watch) {
        return res.status(404).render("error", { message: "Watch not found" });
      }
      res.render("watches/edit", { watch, brands });
    } catch (err) {
      res.status(500).render("error", {
        message: "Failed to retrieve watch for editing",
        error: err,
      });
    }
  }

  async getAllBrands(req, res) {
    try {
      const brands = await Brand.find().select("brandName");
      res.render("watches/index", { brands });
    } catch (err) {
      res.status(500).render("error", {
        message: "Failed to retrieve brands",
        error: err,
      });
    }
  }
}

module.exports = new WatchController();
