import { pool } from "@/app/lib/db";
import { verifyAdmin } from "@/app/middleware/checkAdmin";

export async function POST(req) {
  const check = verifyAdmin(req);
  if (check.error) return Response.json({ error: check.error }, { status: check.status });

  const { name, description, price, image_url } = await req.json();

  await pool.query(
    "INSERT INTO products (name, description, price, image_url) VALUES ($1, $2, $3, $4)",
    [name, description, price, image_url]
  );

  return Response.json({ message: "Product added by admin" }, { status: 201 });
}
