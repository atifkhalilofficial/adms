const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

router.use(protect);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authorize("super_admin", "warehouse_manager"), createProduct);
router.put(
  "/:id",
  authorize("super_admin", "warehouse_manager"),
  updateProduct,
);
router.delete("/:id", authorize("super_admin"), deleteProduct);
router.post(
  "/:id/image",
  authorize("super_admin", "warehouse_manager"),
  upload.single("image"),
  async (req, res) => {
    try {
      const Product = require("../models/Product");
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { image: req.file.path },
        { new: true },
      );
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

module.exports = router;
