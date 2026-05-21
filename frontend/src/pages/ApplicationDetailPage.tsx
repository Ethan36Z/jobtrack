import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteApplication, getApplication } from "../api/applications";
import { useApplicationStore } from "../store/applicationStore";
import type { Application } from "../types";
import { getFollowUpLabel, getFollowUpStatus, parseApiDateAsLocalDay } from "../utils/followUp";

function display(value: string | null) {
  return value || "Not set";
}

function formatDate(date: string | null) {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(parseApiDateAsLocalDay(date));
}

export function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { removeApplication, upsertApplication } = useApplicationStore();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing application id");
      setIsLoading(false);
      return;
    }

    getApplication(id)
      .then((data) => {
        setApplication(data);
        upsertApplication(data);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id, upsertApplication]);

  async function handleDelete() {
    if (!application) {
      return;
    }

    const confirmed = window.confirm("Delete this application? This cannot be undone.");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteApplication(String(application.id));
      removeApplication(application.id);
      navigate("/applications");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <p className="muted">Loading application...</p>;
  }

  if (error || !application) {
    return <p className="error">Could not load application: {error || "Not found"}</p>;
  }

  const followUpStatus = getFollowUpStatus(application.followUpDate);

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">{application.status}</p>
          <h2>{application.companyName}</h2>
          <p className="subtitle">{application.jobTitle}</p>
        </div>
        <div className="actions">
          <Link className="button secondary" to="/applications">
            Back to Applications
          </Link>
          <Link className="button secondary" to={`/applications/${application.id}/edit`}>
            Edit
          </Link>
          <button className="button danger" type="button" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {deleteError && <p className="error">Could not delete application: {deleteError}</p>}

      <section className="follow-up-panel">
        <div>
          <p className="eyebrow">Next Step</p>
          <h3>Follow-up</h3>
        </div>
        <dl className="follow-up-summary">
          <div>
            <dt>Next action</dt>
            <dd>{display(application.nextAction)}</dd>
          </div>
          <div>
            <dt>Follow-up date</dt>
            <dd>{formatDate(application.followUpDate)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span className={`follow-up-label ${followUpStatus}`}>{getFollowUpLabel(followUpStatus)}</span>
            </dd>
          </div>
        </dl>
      </section>

      <dl className="detail-grid">
        <div>
          <dt>Company</dt>
          <dd>{application.companyName}</dd>
        </div>
        <div>
          <dt>Job title</dt>
          <dd>{application.jobTitle}</dd>
        </div>
        <div>
          <dt>Job URL</dt>
          <dd>{application.jobUrl ? <a href={application.jobUrl}>{application.jobUrl}</a> : "Not set"}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{display(application.location)}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{display(application.source)}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <span className="status">{application.status}</span>
          </dd>
        </div>
        <div>
          <dt>Applied date</dt>
          <dd>{formatDate(application.appliedDate)}</dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{formatDate(application.createdAt)}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{formatDate(application.updatedAt)}</dd>
        </div>
      </dl>

      <section className="notes">
        <h3>Notes</h3>
        <p>{display(application.notes)}</p>
      </section>
    </section>
  );
}
