import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";

export async function GET() {
  const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
  return Response.json(result.rows, { status: 200 });
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return Response.json({ error: "Forbidden: Admins only" }, { status: 403 });

    const { name, description, price, image_url } = await req.json();

    if (!name || !price) {
      return Response.json({ error: "Name and Price are required" }, { status: 400 });
    }

    await pool.query(
      "INSERT INTO products (name, description, price, image_url) VALUES ($1, $2, $3, $4)",
      [name, description, price, image_url]
    );

    return Response.json({ message: "Product added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
