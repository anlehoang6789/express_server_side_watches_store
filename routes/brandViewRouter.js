const express = require("express");
const brandRouter = express.Router();
const { requireAdmin } = require("../middleware/authenticate");
const brandController = require("../controller/brandController");

brandRouter.get("/new", requireAdmin, brandController.renderAddPage);

brandRouter
  .route("/")
  .get(brandController.getAllBrands)
  .post(requireAdmin, brandController.createBrand);
brandRouter
  .route("/:brandId")
  .get(brandController.renderEditPage)
  .put(requireAdmin, brandController.updateBrand)
  .delete(requireAdmin, brandController.deleteBrand);

module.exports = brandRouter;
