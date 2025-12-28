import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return Response.json({ error: "No token" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);

  // Get user's cart items
  const cart = await pool.query(
    `SELECT cart.product_id, cart.quantity, products.price 
     FROM cart 
     JOIN products ON cart.product_id = products.id
     WHERE cart.user_id = $1`,
    [userId]
  );

  if (cart.rows.length === 0) {
    return Response.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Calculate total
  const total = cart.rows.reduce((sum, item) => {
    return sum + Number(item.price) * item.quantity;
  }, 0);

  // Create order
  const orderResult = await pool.query(
    "INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id",
    [userId, total]
  );

  const orderId = orderResult.rows[0].id;

  // Add order items
  for (const item of cart.rows) {
    await pool.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
      [orderId, item.product_id, item.quantity, item.price]
    );
  }

  // Clear cart
  await pool.query("DELETE FROM cart WHERE user_id = $1", [userId]);

  return Response.json({ message: "Order placed successfully", orderId }, { status: 201 });
}
