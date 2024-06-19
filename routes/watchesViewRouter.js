const express = require("express");
const watchRouter = express.Router();
const { requireAuth, requireAdmin } = require("../middleware/authenticate");
const watchesController = require("../controller/watchesController");

// Render form to add new watch
watchRouter.get(
  "/watches/new",
  requireAdmin,
  watchesController.createWatchForm
);

// Handle form submission to create a new watch
// watchRouter.post("/watches", requireAdmin, watchesController.createWatch);

watchRouter
  .route("/")
  .get(watchesController.getAllWatches)
  .post(requireAdmin, watchesController.createWatch);
// .get(watchesController.searchWatchByName);
watchRouter.route("/watches/search").get(watchesController.searchWatchByName);

watchRouter
  .route("/watches/:id")
  .get(watchesController.getWatchById)
  .put(requireAdmin, watchesController.updateWatch)
  .delete(requireAdmin, watchesController.deleteWatch);
watchRouter
  .route("/watches/brand/:brandId")
  .get(watchesController.filterWatchesByBrand);

watchRouter
  .route("/watches/:id/comment")
  .post(requireAuth, watchesController.submitComment);

watchRouter
  .route("/watches/:id/edit")
  .get(requireAdmin, watchesController.renderEditWatch);

// watchRouter.get("/brands", watchesController.getAllBrands);

module.exports = watchRouter;
