import { pool } from "@/app/lib/db";
import { verifyAdmin } from "@/app/middleware/checkAdmin";

export async function GET(req, { params }) {
  const check = verifyAdmin(req);
  if (check.error) return Response.json({ error: check.error }, { status: check.status });

  const { id } = params; // <-- this is correct

  const order = await pool.query(
    `SELECT 
        orders.id AS order_id,
        users.name AS customer_name,
        users.email AS customer_email,
        orders.total_price,
        orders.created_at
     FROM orders
     JOIN users ON orders.user_id = users.id
     WHERE orders.id = $1`,
    [id]
  );

  if (order.rows.length === 0) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  const items = await pool.query(
    `SELECT 
        order_items.product_id,
        products.name,
        order_items.price,
        order_items.quantity
     FROM order_items
     JOIN products ON order_items.product_id = products.id
     WHERE order_items.order_id = $1`,
    [id]
  );

  return Response.json(
    {
      ...order.rows[0],
      items: items.rows
    },
    { status: 200 }
  );
}
