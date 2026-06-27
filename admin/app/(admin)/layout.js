import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/carousels", label: "Carousels" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <img src="/images/logo.jpg" alt="AHD" style={{ height: 36, width: "auto", marginBottom: 4 }} />
          <span>Admin Panel</span>
        </div>
        <nav className="sidebar__nav">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="sidebar__link">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="sidebar__footer">
          <a href="/" className="sidebar__link sidebar__link--back">
            ← Back to Site
          </a>
          <a href="/api/auth/logout" className="sidebar__link sidebar__link--logout">
            Logout
          </a>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
