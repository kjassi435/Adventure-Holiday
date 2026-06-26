import { NextResponse } from "next/server";
import db from "../../../../lib/db.js";

export async function GET() {
  try {
    const result = await db.execute("SELECT * FROM settings ORDER BY key");
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const items = await request.json();
    for (const item of items) {
      await db.execute({
        sql: "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?,?,datetime('now'))",
        args: [item.key, item.value],
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
