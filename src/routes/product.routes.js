import Router from 'express';
import { checkRole } from '../middlewares/verifyRole.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import {
  addProduct,
  deleteProduct,
  getCategoryProducts,
  updateProductDetails,
  getProdById,
  addReviews,
  getAllProductReviews,
} from '../controllers/product.controller.js';
import { verifyJwt } from '../middlewares/verifyJWT.miidleware.js';

const router = Router();

//admin and customer both are allowed.
router.route('/:category').get(getCategoryProducts);

router.route('/getProdById/:prodId').get(getProdById);

//Admin Roles only

//Add product
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

//Update Product
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

//Delete Product
router
  .route('/deleteProduct/:prodName')
  .delete(verifyJwt, checkRole(['admin']), deleteProduct);

router
  .route('/addReview/:prodId')
  .post(verifyJwt, checkRole(['customer', 'admin']), addReviews);

router.route('/productReview/:prodId').get(getAllProductReviews);

export default router;
