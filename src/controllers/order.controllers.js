import { Order } from '../models/orders.models.js';
import { Cart } from '../models/cart.model.js';
import { ApiError } from '../utils/ApiError';
import { asynchandler } from '../utils/asynchandler';
import { ApiResponse } from '../utils/ApiResponse.js';

const getOrders = asynchandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = 3;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(400, 'User not found you need to login first');
  }

  const allOrders = Order.aggregate([
    {
      $match: {
        orderedBy: ObjectId(`${userId}`),
      },
    },
    {
      $project: {
        prodName: 1,
        images: 1,
        orderStatus: 1,
        price: 1,
        qty: 1,
        grandTotal: 1,
        createdAt: 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: pageSize * (page - 1),
    },
    {
      $limit: 3,
    },
  ]);

  if (!allOrders) {
    throw new ApiError(400, 'No order found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'All Order fetched Successfully!', allOrders));
});

export { getOrders };
