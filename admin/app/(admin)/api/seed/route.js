import { NextResponse } from "next/server";
import db from "../../../../lib/db.js";

export async function POST() {
  try {
    const testimonials = [
      {
        name: "Priya Sharma",
        location: "New Delhi",
        rating: "5",
        text: "Amazing experience with Adventure Holiday Destination! The Jim Corbett package was perfectly planned — from the jeep safari to the riverside resort. Our family had a wonderful time. Highly recommend their services.",
      },
      {
        name: "Rohit & Neha Agarwal",
        location: "Gurgaon",
        rating: "5",
        text: "We booked the Kerala honeymoon package and it was beyond our expectations. The houseboat stay in Alleppey, the candle-lit dinner, and the Munnar tea gardens — everything was seamless. Thank you for making our trip so special!",
      },
      {
        name: "Amit Verma",
        location: "Noida",
        rating: "5",
        text: "Third time booking with Adventure Holiday Destination — this time for our corporate team retreat to Jaipur. The itinerary, hotel quality, and on-ground coordination were all excellent. Professional, reliable, and always available. Our go-to travel partner.",
      },
    ];

    await db.execute({
      sql: "INSERT OR REPLACE INTO content (section, key, value, updated_at) VALUES (?,?,?,datetime('now'))",
      args: ["testimonials", "list", JSON.stringify(testimonials)],
    });

    return NextResponse.json({ success: true, count: testimonials.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
