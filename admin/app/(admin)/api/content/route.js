import { NextResponse } from "next/server";
import db from "../../../../lib/db.js";

export const dynamic = "force-dynamic";

function noCache(res) {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  return res;
}

export async function GET() {
  try {
    const result = await db.execute("SELECT * FROM content ORDER BY section, key");
    return noCache(NextResponse.json(result.rows));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const items = await request.json();
    for (const item of items) {
      await db.execute({
        sql: "INSERT OR REPLACE INTO content (section, key, value, updated_at) VALUES (?,?,?,datetime('now'))",
        args: [item.section, item.key, item.value],
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
