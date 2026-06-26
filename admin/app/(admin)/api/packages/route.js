import { NextResponse } from "next/server";
import db from "../../../../lib/db.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    let sql = "SELECT * FROM packages";
    const args = [];
    const conditions = [];

    if (type && type !== "all") {
      conditions.push("type = ?");
      args.push(type);
    }
    if (search) {
      conditions.push("(title LIKE ? OR region LIKE ? OR tag LIKE ?)");
      const s = `%${search}%`;
      args.push(s, s, s);
    }

    if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
    sql += " ORDER BY id ASC";

    const result = await db.execute({ sql, args });
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const uid = body.uid || "d" + Date.now();

    await db.execute({
      sql: `INSERT INTO packages (uid,title,type,region,price,orig_price,duration,guests,tag,img,rating,reviews,description,highlights,inclusions,exclusions,itinerary,how_to_reach,things_to_carry,important_info,eligibility,location,cancellation)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        uid, body.title || "", body.type || "domestic", body.region || "", body.price || "", body.orig_price || "",
        body.duration || "", body.guests || "2", body.tag || "", body.img || "", body.rating || 4.5, body.reviews || 0,
        body.description || "", JSON.stringify(body.highlights || []), JSON.stringify(body.inclusions || []),
        JSON.stringify(body.exclusions || []), JSON.stringify(body.itinerary || []), body.how_to_reach || "",
        body.things_to_carry || "", body.important_info || "", body.eligibility || "", body.location || "", body.cancellation || ""
      ],
    });

    return NextResponse.json({ success: true, uid });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
