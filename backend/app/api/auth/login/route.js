import { pool } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    const { email, password } = await req.json();

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return Response.json({ error: "Invalid password" }, { status: 401 });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return Response.json({ message: "Login successful", token }, { status: 200 });
}
