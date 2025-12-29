import { pool } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function PUT(req) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { name, email, password } = await req.json();

        let query = "UPDATE users SET name = $1, email = $2";
        let params = [name, email];
        let paramIndex = 3;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += `, password = $${paramIndex}`;
            params.push(hashedPassword);
            paramIndex++;
        }

        query += ` WHERE id = $${paramIndex} RETURNING id, name, email`;
        params.push(decoded.id);

        const result = await pool.query(query, params);

        if (result.rowCount === 0) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        return Response.json({ message: "Profile updated successfully", user: result.rows[0] }, { status: 200 });

    } catch (error) {
        return Response.json({ error: "Invalid token or server error" }, { status: 401 });
    }
}

export async function GET(req) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const result = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [decoded.id]);

        if (result.rows.length === 0) return Response.json({ error: "User not found" }, { status: 404 });

        return Response.json(result.rows[0], { status: 200 });
    } catch (error) {
        return Response.json({ error: "Invalid token" }, { status: 401 });
    }
}
