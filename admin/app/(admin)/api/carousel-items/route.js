import { NextResponse } from "next/server";
import db from "../../../../lib/db.js";

export const dynamic = "force-dynamic";

function noCache(res) {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  return res;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") || "all";
    let sql = "SELECT * FROM carousel_items";
    const args = [];
    if (section !== "all") {
      sql += " WHERE section = ?";
      args.push(section);
    }
    sql += " ORDER BY sort_order ASC";
    const result = await db.execute({ sql, args });
    return noCache(NextResponse.json(result.rows));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await db.execute({
      sql: "INSERT INTO carousel_items (section, sort_order, data_dest, name, tag, meta, image, link) VALUES (?,?,?,?,?,?,?,?)",
      args: [body.section || "popular", body.sort_order || 0, body.data_dest || "", body.name || "", body.tag || "", body.meta || "", body.image || "", body.link || ""],
    });
    const id = result.lastInsertRowid?.toString() || (await db.execute("SELECT last_insert_rowid() as id")).rows[0].id;
    const item = await db.execute({ sql: "SELECT * FROM carousel_items WHERE id = ?", args: [id] });
    return NextResponse.json(item.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
