import { NextResponse } from "next/server";
import db from "../../../../../lib/db.js";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await db.execute({ sql: "SELECT * FROM hotel_enquiries WHERE id = ?", args: [id] });
    if (result.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const res = NextResponse.json(result.rows[0]);
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    await db.execute({ sql: "UPDATE hotel_enquiries SET status = ? WHERE id = ?", args: [status, id] });
    const res = NextResponse.json({ success: true });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
