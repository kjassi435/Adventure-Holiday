import { NextResponse } from "next/server";
import db from "../../../../../lib/db.js";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await db.execute({ sql: "SELECT * FROM carousel_items WHERE id = ?", args: [id] });
    if (!result.rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    await db.execute({
      sql: "UPDATE carousel_items SET section=?,sort_order=?,data_dest=?,name=?,tag=?,meta=?,image=?,link=?,updated_at=datetime('now') WHERE id=?",
      args: [body.section, body.sort_order, body.data_dest, body.name, body.tag, body.meta, body.image, body.link, id],
    });
    const result = await db.execute({ sql: "SELECT * FROM carousel_items WHERE id = ?", args: [id] });
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await db.execute({ sql: "DELETE FROM carousel_items WHERE id = ?", args: [id] });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
