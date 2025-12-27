import { pool } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
    const { name, email, password } = await req.json();

    const userCheck = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
        return Response.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
        [name, email, hashedPassword]
    );

    return Response.json({ message: "User registered successfully" }, { status: 201 });
}
