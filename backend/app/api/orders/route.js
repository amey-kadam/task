import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return Response.json({ error: "No token" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);

  const orders = await pool.query(
    "SELECT * FROM orders WHERE user_id = $1",
    [userId]
  );

  return Response.json(orders.rows, { status: 200 });
}
