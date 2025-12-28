import { pool } from "@/app/lib/db";
import { verifyAdmin } from "@/app/middleware/checkAdmin";

export async function POST(req) {
  try {
    const check = verifyAdmin(req);
    if (check.error) return Response.json({ error: check.error }, { status: check.status });

    const body = await req.json();

    // Support both single object and array of objects
    const products = Array.isArray(body) ? body : [body];

    if (products.length === 0) {
      return Response.json({ error: "No products provided" }, { status: 400 });
    }

    // Validate all products first
    for (const prod of products) {
      if (!prod.name || !prod.price) {
        return Response.json({ error: "Name and price are required for all items" }, { status: 400 });
      }
    }

    // Insert all products
    for (const prod of products) {
      const { name, description, price, image_url } = prod;
      await pool.query(
        "INSERT INTO products (name, description, price, image_url) VALUES ($1, $2, $3, $4)",
        [name, description, price, image_url]
      );
    }

    return Response.json({ message: `${products.length} product(s) added by admin` }, { status: 201 });
  } catch (error) {
    console.error("Admin add product error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
