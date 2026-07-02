import { NextResponse } from "next/server";
import db from "../../../../../lib/db.js";

export async function GET(request, { params }) {
  try {
    const { uid } = await params;
    const result = await db.execute({ sql: "SELECT * FROM hotels WHERE uid = ?", args: [uid] });
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
    const { uid } = await params;
    const body = await request.json();

    await db.execute({
      sql: `UPDATE hotels SET name=?, type=?, location=?, region=?, image=?, gallery=?, description=?, rating=?,
            amenities=?, meal_plans=?, room_types=?, highlights=?, policies=?, how_to_reach=?, featured=?,
            updated_at=datetime('now')
            WHERE uid=?`,
      args: [
        body.name, body.type, body.location, body.region, body.image,
        JSON.stringify(body.gallery || []), body.description, body.rating,
        JSON.stringify(body.amenities || []), JSON.stringify(body.meal_plans || []),
        JSON.stringify(body.room_types || []), JSON.stringify(body.highlights || []),
        body.policies, body.how_to_reach, body.featured || 0, uid
      ],
    });

    const res = NextResponse.json({ success: true });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { uid } = await params;
    await db.execute({ sql: "DELETE FROM hotels WHERE uid = ?", args: [uid] });
    const res = NextResponse.json({ success: true });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
