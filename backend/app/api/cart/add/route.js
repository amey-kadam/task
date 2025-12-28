import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return Response.json({ error: "Login required to add to cart" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = decoded.id;
  
  const { product_id, quantity } = await req.json();

  await pool.query(
    "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)",
    [userId, product_id, quantity || 1]
  );

  return Response.json({ message: "Added to cart" }, { status: 201 });
}
