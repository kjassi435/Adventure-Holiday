import { NextResponse } from "next/server";
import db from "../../../../../lib/db.js";

export async function GET(request, { params }) {
  try {
    const { uid } = await params;
    const result = await db.execute({ sql: "SELECT * FROM packages WHERE uid = ?", args: [uid] });
    if (result.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { uid } = await params;
    const body = await request.json();

    await db.execute({
      sql: `UPDATE packages SET title=?,type=?,region=?,price=?,orig_price=?,duration=?,guests=?,tag=?,img=?,rating=?,reviews=?,
            description=?,highlights=?,inclusions=?,exclusions=?,itinerary=?,how_to_reach=?,things_to_carry=?,important_info=?,eligibility=?,location=?,cancellation=?,updated_at=datetime('now')
            WHERE uid=?`,
      args: [
        body.title, body.type, body.region, body.price, body.orig_price, body.duration, body.guests, body.tag, body.img,
        body.rating, body.reviews, body.description, JSON.stringify(body.highlights), JSON.stringify(body.inclusions),
        JSON.stringify(body.exclusions), JSON.stringify(body.itinerary), body.how_to_reach, body.things_to_carry,
        body.important_info, body.eligibility, body.location, body.cancellation, uid
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { uid } = await params;
    await db.execute({ sql: "DELETE FROM packages WHERE uid = ?", args: [uid] });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
