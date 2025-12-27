import { pool } from "@/app/lib/db";

export async function GET() {
  const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
  return Response.json(result.rows, { status: 200 });
}
