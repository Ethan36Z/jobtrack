import { Link, Outlet, useLocation } from "react-router-dom";

export function Layout() {
  const { pathname } = useLocation();
  const isDashboardActive = pathname === "/" || pathname === "/dashboard";
  const isNewApplicationActive = pathname === "/applications/new";
  const isApplicationsActive = pathname === "/applications" || (pathname.startsWith("/applications/") && !isNewApplicationActive);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Portfolio Project</p>
          <h1>JobTrack</h1>
        </div>
        <nav>
          <Link className={isDashboardActive ? "active" : undefined} to="/">
            Dashboard
          </Link>
          <Link className={isApplicationsActive ? "active" : undefined} to="/applications">
            Applications
          </Link>
          <Link className={isNewApplicationActive ? "active" : undefined} to="/applications/new">
            New Application
          </Link>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
