import { pool } from "@/app/lib/db";
import { verifyAdmin } from "@/app/middleware/checkAdmin";

export async function GET(req) {
  // Check if the requester is admin
  const check = verifyAdmin(req);
  if (check.error) return Response.json({ error: check.error }, { status: check.status });

  // Fetch all products
  const result = await pool.query(
    "SELECT id, name, description, price, image_url, created_at FROM products ORDER BY id DESC"
  );

  return Response.json(result.rows, { status: 200 });
}
