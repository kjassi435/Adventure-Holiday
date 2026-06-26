import { NextResponse } from "next/server";
import db from "../../../../../lib/db.js";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    await db.execute({ sql: "UPDATE enquiries SET status = ? WHERE id = ?", args: [status, id] });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await db.execute({ sql: "DELETE FROM enquiries WHERE id = ?", args: [id] });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
