import { pool } from "@/app/lib/db";

export async function POST(req) {
  try {
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
