---

# E-Commerce Backend

This is a fully-fledged production-based eCommerce backend built using Node.js, Express, MongoDB, and various other technologies. It provides features such as user authentication, product management, file upload with Cloudinary, payment integration with Razorpay (under development), and more.

## Features

- **User Authentication**: Sign up, login, JWT-based authentication, and role-based access control.
- **Product Management**: CRUD operations for products including categories, stock, and pricing.
- **Order Management**: Users can place orders, view order history, and manage order statuses.
- **File Upload**: Supports image and file uploads for product images using **Multer** and **Cloudinary** for storage.
- **Payment Gateway**: Integration with **Razorpay** for secure and seamless payments (in progress).
- **Cart Management**: Users can add/remove products from the cart.
- **Wishlist**: Allows users to add products to their wishlist.
- **Discounts and Coupons**: Admins can create and apply discount codes and offers (future enhancement).
  
## Tech Stack

- **Node.js**: Backend runtime environment.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing products, orders, users, etc.
- **JWT**: For handling secure authentication and authorization.
- **Multer**: For handling file uploads (e.g., product images).
- **Cloudinary**: For image and file hosting in the cloud.
- **Razorpay**: Payment gateway integration (in development).

## Installation

To run the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-repo-name/ecommerce-backend.git
   cd ecommerce-backend
   ```

2. **Install dependencies**:

   Run the following command to install the required dependencies:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and add the following variables:

   ```bash
   MONGO_URI=your_mongo_db_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Start the server**:

   To start the development server, run:

   ```bash
   npm run dev
   ```

   This will start the server on `http://localhost:5000`.

## API Endpoints

- **User Routes**:
  - `POST /api/users/register`: Register a new user.
  - `POST /api/users/login`: Log in a user.
  - `GET /api/users/profile`: Get user profile (authentication required).

- **Product Routes**:
  - `GET /api/products`: Get all products.
  - `POST /api/products`: Add a new product (Admin only).
  - `PUT /api/products/:id`: Update product (Admin only).
  - `DELETE /api/products/:id`: Delete a product (Admin only).

- **Order Routes**:
  - `POST /api/orders`: Create a new order.
  - `GET /api/orders`: Get all orders (Admin only).
  - `GET /api/orders/user`: Get user's order history.

- **Payment Route** (Under development):
  - `POST /api/payments/razorpay`: Handle payment initiation with Razorpay.

## Future Enhancements

- Full integration of Razorpay payment gateway.
- Admin dashboard for managing users, products, and orders.
- Advanced search and filtering for products.
- Notification system (emails, SMS).
  
## Contributing

If you'd like to contribute to this project, please create a pull request with a description of your changes.

---
