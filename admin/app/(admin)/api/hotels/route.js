import { NextResponse } from "next/server";
import db from "../../../../lib/db.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const featured = searchParams.get("featured");

    let sql = "SELECT * FROM hotels";
    const args = [];
    const conditions = [];

    if (type && type !== "all") {
      conditions.push("type = ?");
      args.push(type);
    }
    if (featured) {
      conditions.push("featured = ?");
      args.push(Number(featured));
    }

    if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
    sql += " ORDER BY created_at DESC";

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
    const uid = body.uid || "h" + Date.now();

    await db.execute({
      sql: `INSERT INTO hotels (uid, name, type, location, region, image, gallery, description, rating, amenities, meal_plans, room_types, highlights, policies, how_to_reach, featured)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        uid,
        body.name || "",
        body.type || "hotel",
        body.location || "",
        body.region || "",
        body.image || "",
        JSON.stringify(body.gallery || []),
        body.description || "",
        body.rating || 4.5,
        JSON.stringify(body.amenities || []),
        JSON.stringify(body.meal_plans || []),
        JSON.stringify(body.room_types || []),
        JSON.stringify(body.highlights || []),
        body.policies || "",
        body.how_to_reach || "",
        body.featured || 0
      ],
    });

    const res = NextResponse.json({ success: true, uid });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
