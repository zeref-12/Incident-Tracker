import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header className="app-header">
        <h1>
          <Link to="/incidents" style={{ color: "inherit", textDecoration: "none" }}>
            ⚡ Incident Tracker
          </Link>
        </h1>
        <nav>
          <Link to="/incidents">Incidents</Link>
          <Link to="/incidents/new">+ New</Link>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}
