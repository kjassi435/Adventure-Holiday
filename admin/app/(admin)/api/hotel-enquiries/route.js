import { NextResponse } from "next/server";
import db from "../../../../lib/db.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let sql = "SELECT * FROM hotel_enquiries";
    const args = [];
    const conditions = [];

    if (status && status !== "all") {
      conditions.push("status = ?");
      args.push(status);
    }

    if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
    sql += " ORDER BY id DESC";

    const result = await db.execute({ sql, args });
    const res = NextResponse.json(result.rows);
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    await db.execute({
      sql: `INSERT INTO hotel_enquiries (name, phone, email, hotel, hotel_uid, room_type, check_in, check_out, guests, message, status)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        body.name || "",
        body.phone || "",
        body.email || "",
        body.hotel || "",
        body.hotel_uid || "",
        body.room_type || "",
        body.check_in || "",
        body.check_out || "",
        body.guests || "1",
        body.message || "",
        "new"
      ],
    });

    const res = NextResponse.json({ success: true });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
