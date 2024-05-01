import { Router } from "express";
const router = Router();
import {
  addProduct,
  getProducts,
  getProductById,
  getProductsByMostReviewed,
  getProductsByTopRatings,
  addRatingToProduct,
  addReviewToProduct,
  getNewProducts,
  searchProducts,
  addVariant,
  deleteProductById,
  updateProductById,
  getProductByCode,
  getProductSkuByCode

} from "../controllers/product.controller.js";
// import { uploadProductfiles } from "../middleware/uploader.js";

router.post("/", addProduct);
router.get("/all", getProducts);
router.get("/", getProductById);
router.post("/rate/:productId", addRatingToProduct);
router.post("/review/:productId", addReviewToProduct);
router.delete("/:productId", deleteProductById);
router.patch("/:productId", updateProductById);
router.get("/mostReviewed", getProductsByMostReviewed);
router.get("/topRated", getProductsByTopRatings);
// /new-arrival?limit=10000
router.get("/new-arrival", getNewProducts);
// /search?query={query}
router.get("/search", searchProducts);
// /add-variant?productId
router.post('/add-variant', addVariant);

router.get('/get-by-code/:code',getProductByCode)
router.get('/get-by-sku-code/:code',getProductSkuByCode)
export default router;
