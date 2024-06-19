const Brand = require("../models/brandModel");

class BrandController {
  async createBrand(req, res) {
    const { brandName } = req.body;
    try {
      const brand = new Brand({ brandName });
      await brand.save();
      res.redirect("/brands"); // Redirect to the brands list page
    } catch (err) {
      res
        .status(500)
        .render("error", { message: "Failed to create brand", error: err });
    }
  }

  async getAllBrands(req, res) {
    try {
      const brands = await Brand.find();
      res.render("brands/index", { brands });
    } catch (err) {
      res
        .status(500)
        .render("error", { message: "Failed to retrieve brands", error: err });
    }
  }

  async updateBrand(req, res) {
    const { brandId } = req.params;
    const { brandName } = req.body;
    try {
      const updatedBrand = await Brand.findByIdAndUpdate(
        brandId,
        { brandName },
        { new: true }
      );
      if (!updatedBrand) {
        return res
          .status(404)
          .render("error", { message: "Brand not found", error: {} });
      }
      res.redirect("/brands");
    } catch (err) {
      res
        .status(500)
        .render("error", { message: "Failed to update brand", error: err });
    }
  }

  async deleteBrand(req, res) {
    const { brandId } = req.params;
    try {
      const deletedBrand = await Brand.findByIdAndDelete(brandId);
      if (!deletedBrand) {
        return res
          .status(404)
          .render("error", { message: "Brand not found", error: {} });
      }
      res.redirect("/brands");
    } catch (err) {
      res
        .status(500)
        .render("error", { message: "Failed to delete brand", error: err });
    }
  }

  async renderEditPage(req, res) {
    const { brandId } = req.params;
    try {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        return res
          .status(404)
          .render("error", { message: "Brand not found", error: {} });
      }
      res.render("brands/edit", { brand });
    } catch (err) {
      res
        .status(500)
        .render("error", { message: "Failed to load edit page", error: err });
    }
  }

  async renderAddPage(req, res) {
    try {
      res.render("brands/new");
    } catch (err) {
      res
        .status(500)
        .render("error", { message: "Failed to load add page", error: err });
    }
  }
}

module.exports = new BrandController();
