import { createClient } from "@libsql/client/http";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Map carousel item names to package IDs
// Items without a matching package will stay on the listing page
const linkMap = {
  "Jim Corbett": "detail.html?id=d10",
  "Kerala": "detail.html?id=d8",
  "Manali": "detail.html?id=d12",
  "Goa": "detail.html?id=d6",
  "Jaipur": "detail.html?id=d5",
  "Shimla": "detail.html?id=d13",
  "Nainital": "detail.html?id=d3",
  "Andaman": "detail.html?id=d7",
  "Kedarnath": "detail.html?id=sp3",
  "Varanasi": "detail.html?id=sp2",
  "Tirupati": "detail.html?id=sp6",
  "Rameshwaram": "detail.html?id=sp12",
  "Dwarka": "detail.html?id=sp11",
  "Haridwar": "detail.html?id=d3",
};

async function fixLinks() {
  const rows = await db.execute("SELECT id, name, link FROM carousel_items");
  for (const row of rows.rows) {
    const name = row.name;
    const newLink = linkMap[name];
    if (newLink && row.link !== newLink) {
      await db.execute({ sql: "UPDATE carousel_items SET link = ? WHERE id = ?", args: [newLink, row.id] });
      console.log(`Updated: ${name} (id=${row.id}) → ${newLink}`);
    } else if (!newLink) {
      console.log(`No mapping for: ${name} (id=${row.id})`);
    } else {
      console.log(`Already correct: ${name} (id=${row.id}) → ${row.link}`);
    }
  }
  console.log("Done!");
}

fixLinks().catch(console.error);
