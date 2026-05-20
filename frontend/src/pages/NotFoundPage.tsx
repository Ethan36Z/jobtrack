import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="empty-state">
      <h2>Page not found</h2>
      <p>The page you requested does not exist.</p>
      <Link className="button" to="/">
        Back to dashboard
      </Link>
    </section>
  );
}
