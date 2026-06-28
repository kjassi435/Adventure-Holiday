import { NextResponse } from "next/server";
import db from "../../../../lib/db.js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const contentResult = await db.execute("SELECT * FROM content WHERE section='carousels'");
    const headings = {};
    contentResult.rows.forEach((r) => { headings[r.key] = r.value; });

    const itemsResult = await db.execute("SELECT * FROM carousel_items ORDER BY section, sort_order ASC");
    const items = { popular: [], spiritual: [] };
    itemsResult.rows.forEach((r) => {
      if (r.section === "popular") items.popular.push(r);
      else items.spiritual.push(r);
    });

    const res = NextResponse.json({
      headings: {
        popular_heading: headings.popular_heading || "Popular Destinations",
        popular_subtitle: headings.popular_subtitle || "Where India goes to holiday",
        spiritual_heading: headings.spiritual_heading || "Spiritual Journeys",
        spiritual_subtitle: headings.spiritual_subtitle || "Divine destinations await",
      },
      items,
    });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    return res;
  } catch (error) {
    return NextResponse.json({
      headings: {
        popular_heading: "Popular Destinations",
        popular_subtitle: "Where India goes to holiday",
        spiritual_heading: "Spiritual Journeys",
        spiritual_subtitle: "Divine destinations await",
      },
      items: { popular: [], spiritual: [] },
    });
  }
}
