import Router from 'express';
import { checkRole } from '../middlewares/verifyRole.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import {
  addProduct,
  deleteProduct,
  getCategoryProducts,
  updateProductDetails,
} from '../controllers/product.controller.js';
import { verifyJwt } from '../middlewares/verifyJWT.miidleware.js';

const router = Router();

//admin and customer both are allowed.
router
  .route('/:category')
  .get(verifyJwt, checkRole(['admin', 'customer']), getCategoryProducts);

//Admin Roles only
router.route('/addProduct').post(
  verifyJwt,
  checkRole(['admin']),
  upload.fields([
    {
      name: 'prodImages',
      maxCount: 10,
    },
  ]),
  addProduct
);
router.route('/updateProduct/:prodName').patch(
  verifyJwt,
  checkRole(['admin']),
  upload.fields([
    {
      name: 'prodImages',
      maxCount: 5,
    },
  ]),
  updateProductDetails
);
router
  .route('/deleteProduct/:prodName')
  .delete(verifyJwt, checkRole(['admin']), deleteProduct);

export default router;
