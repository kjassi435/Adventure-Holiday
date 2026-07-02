import { NextResponse } from "next/server";
import db from "../../../../lib/db.js";

export async function POST() {
  try {
    await db.executeMultiple(`
      CREATE TABLE IF NOT EXISTS hotels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uid TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'hotel',
        location TEXT DEFAULT '',
        region TEXT DEFAULT '',
        image TEXT DEFAULT '',
        gallery TEXT DEFAULT '[]',
        description TEXT DEFAULT '',
        rating REAL DEFAULT 4.5,
        amenities TEXT DEFAULT '[]',
        meal_plans TEXT DEFAULT '[]',
        room_types TEXT DEFAULT '[]',
        highlights TEXT DEFAULT '[]',
        policies TEXT DEFAULT '',
        how_to_reach TEXT DEFAULT '',
        featured INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS hotel_enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT DEFAULT '',
        email TEXT DEFAULT '',
        hotel TEXT DEFAULT '',
        hotel_uid TEXT DEFAULT '',
        room_type TEXT DEFAULT '',
        check_in TEXT DEFAULT '',
        check_out TEXT DEFAULT '',
        guests TEXT DEFAULT '1',
        message TEXT DEFAULT '',
        status TEXT DEFAULT 'new',
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    const hotels = [
      {
        uid: "h1", name: "Hotel Abhyudyam Ganga", type: "hotel",
        location: "Har Ki Pauri, Haridwar", region: "Uttarakhand",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
        ]),
        description: "A premium riverside hotel steps away from the sacred Har Ki Pauri ghat. Enjoy panoramic Ganga views, world-class amenities, and easy access to Haridwar's spiritual landmarks.",
        rating: 4.7,
        amenities: JSON.stringify(["Free WiFi", "Restaurant", "Room Service", "Ganga View Rooms", "AC Rooms", "Parking", "Travel Desk", "Laundry"]),
        meal_plans: JSON.stringify([
          { name: "EP (European Plan)", description: "Room only — no meals included", price: "" },
          { name: "CP (Continental Plan)", description: "Room + breakfast for all guests", price: "+₹500/night" },
          { name: "MAP (Modified American Plan)", description: "Room + breakfast + one meal (lunch or dinner)", price: "+₹1,200/night" }
        ]),
        room_types: JSON.stringify([
          { name: "Deluxe Room", price: "₹3,200", plan: "EP", guests: "2", bed: "Queen Bed", size: "280 sq ft", amenities: ["AC", "WiFi", "TV", "Minibar", "Garden View"] },
          { name: "Super Deluxe Room", price: "₹4,500", plan: "EP", guests: "2", bed: "King Bed", size: "350 sq ft", amenities: ["AC", "WiFi", "TV", "Minibar", "Ganga View", "Sofa"] },
          { name: "Executive Suite", price: "₹6,800", plan: "EP", guests: "2", bed: "King Bed", size: "480 sq ft", amenities: ["AC", "WiFi", "TV", "Minibar", "Ganga View", "Living Area", "Balcony"] },
          { name: "Family Room", price: "₹5,500", plan: "EP", guests: "4", bed: "2 Queen Beds", size: "420 sq ft", amenities: ["AC", "WiFi", "TV", "Minibar", "Garden View", "Extra Beds Available"] }
        ]),
        highlights: JSON.stringify(["Walking distance to Har Ki Pauri", "Panoramic Ganga river views", "Rooftop restaurant with Aarti view", "Complimentary yoga sessions", "24/7 room service"]),
        policies: "Check-in: 2:00 PM | Check-out: 12:00 PM. Valid ID proof required. Extra bed charges: ₹1,000/night. Children under 5 stay free. Cancellation: Free cancellation up to 48 hours before check-in.",
        how_to_reach: "Nearest airport: Jolly Grant Airport, Dehradun (35 km). Nearest railway station: Haridwar Junction (2 km). Auto/taxi available from station.",
        featured: 1
      },
      {
        uid: "h2", name: "Maulik Mansion Resort", type: "resort",
        location: "Ramnagar, Jim Corbett", region: "Uttarakhand",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80"
        ]),
        description: "Nestled in the wilderness of Jim Corbett National Park, Maulik Mansion Resort offers an immersive jungle experience with luxury amenities.",
        rating: 4.8,
        amenities: JSON.stringify(["Free WiFi", "Swimming Pool", "Spa", "Restaurant", "Bar", "Jungle Safari", "Bonfire", "Parking", "Conference Hall", "Kids Play Area"]),
        meal_plans: JSON.stringify([
          { name: "EP (European Plan)", description: "Room only — no meals included", price: "" },
          { name: "CP (Continental Plan)", description: "Room + breakfast buffet", price: "+₹800/night" },
          { name: "MAP (Modified American Plan)", description: "Room + breakfast + lunch or dinner", price: "+₹1,800/night" },
          { name: "AP (American Plan)", description: "Room + all meals (breakfast, lunch, dinner)", price: "+₹2,800/night" }
        ]),
        room_types: JSON.stringify([
          { name: "Deluxe Cottage", price: "₹5,500", plan: "EP", guests: "2", bed: "Queen Bed", size: "320 sq ft", amenities: ["AC", "WiFi", "TV", "Balcony", "Garden View"] },
          { name: "Super Deluxe Cottage", price: "₹7,200", plan: "EP", guests: "2", bed: "King Bed", size: "400 sq ft", amenities: ["AC", "WiFi", "TV", "Balcony", "River View", "Sitting Area"] },
          { name: "Superior Bath Tub", price: "₹8,500", plan: "EP", guests: "2", bed: "King Bed", size: "450 sq ft", amenities: ["AC", "WiFi", "TV", "Bathtub", "Balcony", "River View"] },
          { name: "Superior Jacuzzi", price: "₹10,000", plan: "EP", guests: "2", bed: "King Bed", size: "500 sq ft", amenities: ["AC", "WiFi", "TV", "Jacuzzi", "Balcony", "River View", "Minibar"] },
          { name: "Cottage", price: "₹6,000", plan: "EP", guests: "2", bed: "Queen Bed", size: "350 sq ft", amenities: ["AC", "WiFi", "TV", "Private Sit-out", "Garden"] },
          { name: "Terrace Garden", price: "₹9,000", plan: "EP", guests: "2", bed: "King Bed", size: "480 sq ft", amenities: ["AC", "WiFi", "TV", "Terrace", "Garden", "Outdoor Seating"] },
          { name: "Luxury Suite Plunge Pool", price: "₹15,000", plan: "EP", guests: "2", bed: "King Bed", size: "700 sq ft", amenities: ["AC", "WiFi", "TV", "Private Plunge Pool", "Balcony", "River View", "Minibar", "Living Area"] }
        ]),
        highlights: JSON.stringify(["Inside Jim Corbett buffer zone", "Riverside location", "Guided jungle safari", "Outdoor swimming pool", "Bonfire & barbecue evenings", "Nature walks with expert naturalist"]),
        policies: "Check-in: 2:00 PM | Check-out: 11:00 AM. Valid ID proof required. Safari bookings subject to forest department availability. Cancellation: Free cancellation up to 72 hours before check-in.",
        how_to_reach: "Nearest airport: Pantnagar Airport (80 km). Nearest railway station: Ramnagar (5 km). Resort provides pickup/drop on request.",
        featured: 1
      }
    ];

    let count = 0;
    for (const h of hotels) {
      try {
        await db.execute({
          sql: "INSERT OR IGNORE INTO hotels (uid,name,type,location,region,image,gallery,description,rating,amenities,meal_plans,room_types,highlights,policies,how_to_reach,featured) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          args: [h.uid, h.name, h.type, h.location, h.region, h.image, h.gallery, h.description, h.rating, h.amenities, h.meal_plans, h.room_types, h.highlights, h.policies, h.how_to_reach, h.featured]
        });
        count++;
      } catch (e) {
        console.error("Hotel seed error:", e.message);
      }
    }

    const testimonials = [
      { name: "Priya Sharma", location: "New Delhi", rating: "5", text: "Amazing experience with Adventure Holiday Destination! The Jim Corbett package was perfectly planned — from the jeep safari to the riverside resort. Our family had a wonderful time. Highly recommend their services." },
      { name: "Rohit & Neha Agarwal", location: "Gurgaon", rating: "5", text: "We booked the Kerala honeymoon package and it was beyond our expectations. The houseboat stay in Alleppey, the candle-lit dinner, and the Munnar tea gardens — everything was seamless. Thank you for making our trip so special!" },
      { name: "Amit Verma", location: "Noida", rating: "5", text: "Third time booking with Adventure Holiday Destination — this time for our corporate team retreat to Jaipur. The itinerary, hotel quality, and on-ground coordination were all excellent. Professional, reliable, and always available. Our go-to travel partner." },
    ];

    await db.execute({
      sql: "INSERT OR REPLACE INTO content (section, key, value, updated_at) VALUES (?,?,?,datetime('now'))",
      args: ["testimonials", "list", JSON.stringify(testimonials)],
    });

    return NextResponse.json({ success: true, hotels: count, testimonials: testimonials.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
