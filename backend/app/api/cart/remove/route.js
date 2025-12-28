import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return Response.json({ error: "Login required" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const userId = decoded.id;

  const { item_id } = await req.json();

  await pool.query("DELETE FROM cart WHERE id = $1 AND user_id = $2", [item_id, userId]);

  return Response.json({ message: "Item removed" }, { status: 200 });
}
