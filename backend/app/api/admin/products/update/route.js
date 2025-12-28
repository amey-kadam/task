import { pool } from "@/app/lib/db";
import { verifyAdmin } from "@/app/middleware/checkAdmin";

export async function POST(req) {
  // Validate admin token
  const check = verifyAdmin(req);
  if (check.error) return Response.json({ error: check.error }, { status: check.status });

  // Get product fields from request
  const { id, name, description, price, image_url } = await req.json();

  // Validate ID
  if (!id) {
    return Response.json({ error: "Product ID is required" }, { status: 400 });
  }

  // Update query
  await pool.query(
    `UPDATE products 
     SET name = $1, description = $2, price = $3, image_url = $4
     WHERE id = $5`,
    [name, description, price, image_url, id]
  );

  return Response.json({ message: "Product updated successfully" }, { status: 200 });
}
