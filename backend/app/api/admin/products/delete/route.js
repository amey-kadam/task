import { pool } from "@/app/lib/db";
import { verifyAdmin } from "@/app/middleware/checkAdmin";

export async function POST(req) {
  const check = verifyAdmin(req);
  if (check.error) return Response.json({ error: check.error }, { status: check.status });

  const { id } = await req.json();

  await pool.query("DELETE FROM products WHERE id = $1", [id]);

  return Response.json({ message: "Product deleted" }, { status: 200 });
}
