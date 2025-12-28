import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return Response.json({ error: "No token provided" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  const result = await pool.query(
    `SELECT cart.id, products.name, products.price, cart.quantity 
     FROM cart 
     JOIN products ON cart.product_id = products.id
     WHERE cart.user_id = $1`,
    [userId]
  );

  return Response.json(result.rows, { status: 200 });
}
