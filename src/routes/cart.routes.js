import Router from 'express';
import { verifyJwt } from '../middlewares/verifyJWT.miidleware.js';
import { checkRole } from '../middlewares/verifyRole.middleware.js';
import { addToCart, getCartItems } from '../controllers/cart.controllers.js';

const router = Router();

router
  .route('/addTocart/:prodId')
  .post(verifyJwt, checkRole(['customer']), addToCart);

router
  .route('/cartBag/:pageNo')
  .get(verifyJwt, checkRole(['customer']), getCartItems);

export default router;
