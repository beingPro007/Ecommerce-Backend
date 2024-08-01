import Router from "express"
import { checkRole } from "../middlewares/verifyRole.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addProduct,
  getCategoryProducts,
} from '../controllers/product.controller.js';
import { verifyJwt } from "../middlewares/verifyJWT.miidleware.js";

const router = Router();

router.route('/addProduct').post(
  verifyJwt,
  checkRole(['admin',]),
  upload.fields([
    {
      name: 'prodImages',
      maxCount: 10,
    },
  ]),
  addProduct
);

router
  .route('/:category')
  .get(verifyJwt, checkRole(['admin', 'customer']), getCategoryProducts);

export default router;