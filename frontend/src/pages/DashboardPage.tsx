import { useEffect, useMemo, useState } from "react";
import { getApplications } from "../api/applications";
import { useApplicationStore } from "../store/applicationStore";
import type { ApplicationStatus } from "../types";

const trackedStatuses: ApplicationStatus[] = ["SAVED", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED", "ARCHIVED"];

export function DashboardPage() {
  const { applications, setApplications } = useApplicationStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getApplications()
      .then((data) => {
        setApplications(data);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [setApplications]);

  const stats = useMemo(() => {
    const byStatus = Object.fromEntries(trackedStatuses.map((status) => [status, 0])) as Record<ApplicationStatus, number>;

    for (const application of applications) {
      if (application.status in byStatus) {
        byStatus[application.status] += 1;
      }
    }

    return {
      total: applications.length,
      byStatus
    };
  }, [applications]);

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Dashboard</h2>
        </div>
      </div>

      {isLoading && <p className="muted">Loading dashboard...</p>}
      {error && <p className="error">Could not load applications: {error}</p>}

      {!isLoading && !error && (
        <div className="stat-grid">
          <article className="stat-card">
            <span>Total</span>
            <strong>{stats.total}</strong>
          </article>
          {trackedStatuses.map((status) => (
            <article className="stat-card" key={status}>
              <span>{status.toLowerCase()}</span>
              <strong>{stats.byStatus[status]}</strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
