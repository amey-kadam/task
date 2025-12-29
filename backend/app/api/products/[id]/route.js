import { pool } from "@/app/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req, { params }) {
  const { id } = await params;

  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json(result.rows[0], { status: 200 });
}

export async function PUT(req, { params }) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return Response.json({ error: "Forbidden: Admins only" }, { status: 403 });

    const { id } = await params;
    const { name, description, price, image_url } = await req.json();

    const result = await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3, image_url = $4 WHERE id = $5 RETURNING *",
      [name, description, price, image_url, id]
    );

    if (result.rowCount === 0) return Response.json({ error: "Product not found" }, { status: 404 });

    return Response.json({ message: "Product updated successfully", product: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return Response.json({ error: "Forbidden: Admins only" }, { status: 403 });

    const { id } = await params;
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) return Response.json({ error: "Product not found" }, { status: 404 });

    return Response.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
