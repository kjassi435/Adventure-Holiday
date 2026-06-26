import { NextResponse } from "next/server";
import db from "../../../../lib/db.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let sql = "SELECT * FROM enquiries";
    const args = [];
    const conditions = [];

    if (status && status !== "all") {
      conditions.push("status = ?");
      args.push(status);
    }
    if (search) {
      conditions.push("(name LIKE ? OR email LIKE ? OR package LIKE ?)");
      const s = `%${search}%`;
      args.push(s, s, s);
    }

    if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
    sql += " ORDER BY id DESC";

    const result = await db.execute({ sql, args });
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const ref = "AHD-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    const message = [
      body.message || "",
      body.travel_date ? "Travel Date: " + body.travel_date : "",
      body.travellers ? "Travellers: " + body.travellers : "",
      "Ref: " + ref
    ].filter(Boolean).join(" | ");

    await db.execute({
      sql: "INSERT INTO enquiries (name, email, phone, package, message, status) VALUES (?,?,?,?,?,?)",
      args: [body.name || "", body.email || "", body.phone || "", body.destination || body.package || "", message, "new"],
    });
    return NextResponse.json({ success: true, ref: ref });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
