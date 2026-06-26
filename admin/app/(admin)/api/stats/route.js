import { NextResponse } from "next/server";
import db from "../../../../lib/db.js";

export async function GET() {
  try {
    const [totalPkgs, domesticPkgs, spiritualPkgs, totalEnq, newEnq, contactedEnq, confirmedEnq, completedEnq] = await Promise.all([
      db.execute("SELECT COUNT(*) as c FROM packages"),
      db.execute("SELECT COUNT(*) as c FROM packages WHERE type='domestic'"),
      db.execute("SELECT COUNT(*) as c FROM packages WHERE type='spiritual'"),
      db.execute("SELECT COUNT(*) as c FROM enquiries"),
      db.execute("SELECT COUNT(*) as c FROM enquiries WHERE status='new'"),
      db.execute("SELECT COUNT(*) as c FROM enquiries WHERE status='contacted'"),
      db.execute("SELECT COUNT(*) as c FROM enquiries WHERE status='confirmed'"),
      db.execute("SELECT COUNT(*) as c FROM enquiries WHERE status='completed'"),
    ]);

    const recentEnquiries = await db.execute("SELECT * FROM enquiries ORDER BY id DESC LIMIT 5");

    return NextResponse.json({
      packages: { total: totalPkgs.rows[0].c, domestic: domesticPkgs.rows[0].c, spiritual: spiritualPkgs.rows[0].c },
      enquiries: { total: totalEnq.rows[0].c, new: newEnq.rows[0].c, contacted: contactedEnq.rows[0].c, confirmed: confirmedEnq.rows[0].c, completed: completedEnq.rows[0].c },
      recentEnquiries: recentEnquiries.rows,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
