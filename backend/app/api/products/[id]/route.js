import { pool } from "@/app/lib/db";

export async function GET(req, { params }) {
  const { id } = await params;

  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json(result.rows[0], { status: 200 });
}
