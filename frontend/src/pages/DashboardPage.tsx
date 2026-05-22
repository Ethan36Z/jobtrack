import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getApplications } from "../api/applications";
import { useApplicationStore } from "../store/applicationStore";
import type { ApplicationStatus } from "../types";
import { formatDisplayDate } from "../utils/dateFormat";
import { compareFollowUps, getFollowUpLabel, getFollowUpStatus } from "../utils/followUp";
import { getStatusBadgeClass } from "../utils/statusBadge";

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

  const followUps = useMemo(
    () =>
      applications
        .filter((application) => application.followUpDate || application.nextAction?.trim())
        .sort((a, b) => compareFollowUps(a.followUpDate, b.followUpDate)),
    [applications]
  );

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
        <>
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

          <section className="panel-section">
            <div className="section-header">
              <div>
                <p className="eyebrow">Workflow</p>
                <h3>Upcoming Follow-ups</h3>
              </div>
            </div>

            {followUps.length === 0 ? (
              <div className="empty-state">
                <h3>No follow-ups yet</h3>
                <p>Add a next action or follow-up date to an application to track it here.</p>
              </div>
            ) : (
              <div className="follow-up-list">
                {followUps.map((application) => {
                  const followUpStatus = getFollowUpStatus(application.followUpDate);

                  return (
                    <article className="follow-up-item" key={application.id}>
                      <div>
                        <Link to={`/applications/${application.id}`}>{application.companyName}</Link>
                        <p>{application.jobTitle}</p>
                      </div>
                      <span className={getStatusBadgeClass(application.status)}>{application.status}</span>
                      <p>{application.nextAction || "No next action set"}</p>
                      <p>{formatDisplayDate(application.followUpDate)}</p>
                      <span className={`follow-up-label ${followUpStatus}`}>{getFollowUpLabel(followUpStatus)}</span>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}
