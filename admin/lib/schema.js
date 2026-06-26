import db from "./db.js";

export async function initSchema() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT 'Admin',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'domestic',
      region TEXT DEFAULT '',
      price TEXT DEFAULT '',
      orig_price TEXT DEFAULT '',
      duration TEXT DEFAULT '',
      guests TEXT DEFAULT '2',
      tag TEXT DEFAULT '',
      img TEXT DEFAULT '',
      rating REAL DEFAULT 4.5,
      reviews INTEGER DEFAULT 0,
      description TEXT DEFAULT '',
      highlights TEXT DEFAULT '[]',
      inclusions TEXT DEFAULT '[]',
      exclusions TEXT DEFAULT '[]',
      itinerary TEXT DEFAULT '[]',
      how_to_reach TEXT DEFAULT '',
      things_to_carry TEXT DEFAULT '',
      important_info TEXT DEFAULT '',
      eligibility TEXT DEFAULT '',
      location TEXT DEFAULT '',
      cancellation TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      package TEXT DEFAULT '',
      message TEXT DEFAULT '',
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(section, key)
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS carousel_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL DEFAULT 'popular',
      sort_order INTEGER DEFAULT 0,
      data_dest TEXT NOT NULL DEFAULT '',
      name TEXT NOT NULL DEFAULT '',
      tag TEXT DEFAULT '',
      meta TEXT DEFAULT '',
      image TEXT DEFAULT '',
      link TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
}
