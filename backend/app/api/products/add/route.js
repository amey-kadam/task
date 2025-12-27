import { pool } from "@/app/lib/db";

export async function POST(req) {
  const { name, description, price, image_url } = await req.json();

  await pool.query(
    "INSERT INTO products (name, description, price, image_url) VALUES ($1, $2, $3, $4)",
    [name, description, price, image_url]
  );

  return Response.json({ message: "Product added successfully" }, { status: 201 });
}
