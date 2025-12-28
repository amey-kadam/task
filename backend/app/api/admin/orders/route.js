import { pool } from "@/app/lib/db";
import { verifyAdmin } from "@/app/middleware/checkAdmin";

export async function GET(req) {
  // Only admin can access
  const check = verifyAdmin(req);
  if (check.error) return Response.json({ error: check.error }, { status: check.status });

  // Fetch all orders with user info
  const orders = await pool.query(`
    SELECT 
      orders.id AS order_id,
      users.name AS customer_name,
      users.email AS customer_email,
      orders.total_price,
      orders.created_at
    FROM orders
    JOIN users ON orders.user_id = users.id
    ORDER BY orders.id DESC
  `);

  return Response.json(orders.rows, { status: 200 });
}
