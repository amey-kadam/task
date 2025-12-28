import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  const { item_id } = await req.json();

  await pool.query("DELETE FROM cart WHERE id = $1 AND user_id = $2", [item_id, userId]);

  return Response.json({ message: "Item removed" }, { status: 200 });
}
