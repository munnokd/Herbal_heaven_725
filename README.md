Product Management API – Herbal Haven
Base URL: http://localhost:3000/api/products

Admin routes require Bearer token:
Authorization: Bearer <JWT_TOKEN>

1. Get All Products-
GET /api/products
Access: Public
Description: Retrieves all products

2. Get Product by ID-
GET /api/products/:id
Access: Public
Description: Retrieve a specific product by its ID

3. Add New Product-
POST /api/products
Access: Admin
Description: Creates a new product

4. Update Product-
PUT /api/products/:id
Access: Admin
Description: Updates an existing product

5. Delete Product-
DELETE /api/products/:id
Access: Admin
Description: Deletes a product by ID
