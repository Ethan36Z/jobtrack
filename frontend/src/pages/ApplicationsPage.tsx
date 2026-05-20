import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApplications } from "../api/applications";
import { useApplicationStore } from "../store/applicationStore";

function formatDate(date: string | null) {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export function ApplicationsPage() {
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

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Pipeline</p>
          <h2>Applications</h2>
        </div>
        <Link className="button" to="/applications/new">
          Add application
        </Link>
      </div>

      {isLoading && <p className="muted">Loading applications...</p>}
      {error && <p className="error">Could not load applications: {error}</p>}

      {!isLoading && !error && applications.length === 0 && (
        <div className="empty-state">
          <h3>No applications yet</h3>
          <p>Add your first role to start tracking the pipeline.</p>
        </div>
      )}

      {!isLoading && !error && applications.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Applied</th>
                <th>Follow up</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>
                    <Link to={`/applications/${application.id}`}>{application.companyName}</Link>
                  </td>
                  <td>{application.jobTitle}</td>
                  <td>
                    <span className="status">{application.status}</span>
                  </td>
                  <td>{formatDate(application.appliedDate)}</td>
                  <td>{formatDate(application.followUpDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
