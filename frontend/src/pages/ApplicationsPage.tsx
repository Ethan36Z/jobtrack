import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteApplication, getApplications } from "../api/applications";
import { useApplicationStore } from "../store/applicationStore";
import type { ApplicationStatus } from "../types";
import { getFollowUpLabel, getFollowUpStatus, parseApiDateAsLocalDay } from "../utils/followUp";

const statuses: Array<ApplicationStatus | "ALL"> = ["ALL", "SAVED", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED", "ARCHIVED"];

function formatDate(date: string | null) {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(parseApiDateAsLocalDay(date));
}

export function ApplicationsPage() {
  const { applications, removeApplication, setApplications } = useApplicationStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">("ALL");

  useEffect(() => {
    getApplications()
      .then((data) => {
        setApplications(data);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [setApplications]);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        !normalizedSearch ||
        application.companyName.toLowerCase().includes(normalizedSearch) ||
        application.jobTitle.toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusFilter === "ALL" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Delete this application? This cannot be undone.");

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setDeleteError(null);

    try {
      await deleteApplication(String(id));
      removeApplication(id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

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
      {deleteError && <p className="error">Could not delete application: {deleteError}</p>}

      {!isLoading && !error && applications.length === 0 && (
        <div className="empty-state">
          <h3>No applications yet</h3>
          <p>Add your first role to start tracking the pipeline.</p>
        </div>
      )}

      {!isLoading && !error && applications.length > 0 && (
        <>
          <div className="filters">
            <label>
              Search
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Company or job title"
              />
            </label>

            <label>
              Status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as ApplicationStatus | "ALL")}>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "ALL" ? "All" : status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="empty-state">
              <h3>No matches</h3>
              <p>Try a different search term or status.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th>Next action</th>
                    <th>Follow up</th>
                    <th>Follow-up status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application) => (
                    <tr key={application.id}>
                      <td>
                        <Link to={`/applications/${application.id}`}>{application.companyName}</Link>
                      </td>
                      <td>{application.jobTitle}</td>
                      <td>
                        <span className="status">{application.status}</span>
                      </td>
                      <td>{formatDate(application.appliedDate)}</td>
                      <td>{application.nextAction || "Not set"}</td>
                      <td>{formatDate(application.followUpDate)}</td>
                      <td>
                        <span className={`follow-up-label ${getFollowUpStatus(application.followUpDate)}`}>
                          {application.followUpDate ? getFollowUpLabel(getFollowUpStatus(application.followUpDate)) : "No follow-up"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="button danger small"
                          type="button"
                          onClick={() => handleDelete(application.id)}
                          disabled={deletingId === application.id}
                        >
                          {deletingId === application.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
