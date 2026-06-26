import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/carousels", label: "Carousels" },
  { href: "/admin/enquiries", label: "Enquiries" },
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
          <strong>AHD</strong>
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
          <a href="/" target="_blank" rel="noopener" className="sidebar__link sidebar__link--view">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View Site
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
