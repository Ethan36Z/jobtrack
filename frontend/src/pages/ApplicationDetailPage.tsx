import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApplication } from "../api/applications";
import type { Application } from "../types";

function display(value: string | null) {
  return value || "Not set";
}

function formatDate(date: string | null) {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(date));
}

export function ApplicationDetailPage() {
  const { id } = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing application id");
      setIsLoading(false);
      return;
    }

    getApplication(id)
      .then((data) => {
        setApplication(data);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <p className="muted">Loading application...</p>;
  }

  if (error || !application) {
    return <p className="error">Could not load application: {error || "Not found"}</p>;
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">{application.status}</p>
          <h2>{application.companyName}</h2>
          <p className="subtitle">{application.jobTitle}</p>
        </div>
        <Link className="button secondary" to={`/applications/${application.id}/edit`}>
          Edit
        </Link>
      </div>

      <dl className="detail-grid">
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
          <dt>Applied date</dt>
          <dd>{formatDate(application.appliedDate)}</dd>
        </div>
        <div>
          <dt>Next action</dt>
          <dd>{display(application.nextAction)}</dd>
        </div>
        <div>
          <dt>Follow-up date</dt>
          <dd>{formatDate(application.followUpDate)}</dd>
        </div>
      </dl>

      <section className="notes">
        <h3>Notes</h3>
        <p>{display(application.notes)}</p>
      </section>
    </section>
  );
}
