import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getApplications } from "../api/applications";
import type { Application } from "../types";
import { formatDisplayDate } from "../utils/dateFormat";
import { getFollowUpLabel, getFollowUpStatus } from "../utils/followUp";
import { getStatusBadgeClass } from "../utils/statusBadge";

export function InterviewPrepPage() {
  const [applications, setApplications] = useState<Application[]>([]);
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
  }, []);

  const interviewingApplications = useMemo(
    () => applications.filter((application) => application.status === "INTERVIEWING"),
    [applications]
  );

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Preparation</p>
          <h2>Interview Prep</h2>
        </div>
      </div>

      {isLoading && <p className="muted">Loading interview prep...</p>}
      {error && <p className="error">Could not load applications: {error}</p>}

      {!isLoading && !error && interviewingApplications.length === 0 && (
        <div className="empty-state">
          <h3>No active interviews</h3>
          <p>Applications with INTERVIEWING status will appear here for focused prep.</p>
        </div>
      )}

      {!isLoading && !error && interviewingApplications.length > 0 && (
        <>
          <section className="panel-section">
            <div className="section-header">
              <div>
                <p className="eyebrow">Upcoming Interviews</p>
                <h3>Interviewing Applications</h3>
              </div>
            </div>

            <div className="interview-prep-grid">
              {interviewingApplications.map((application) => (
                <InterviewPrepCard application={application} key={application.id} />
              ))}
            </div>
          </section>

          <section className="panel-section">
            <div className="section-header">
              <div>
                <p className="eyebrow">Prep Focus</p>
                <h3>What to Review</h3>
              </div>
            </div>
            <div className="prep-focus-grid">
              <article className="prep-focus-card">
                <h4>Company context</h4>
                <p>Review company research, why you are interested, red flags, and interview tips on each application detail page.</p>
              </article>
              <article className="prep-focus-card">
                <h4>Interview history</h4>
                <p>Revisit recent questions, next steps, and results from interview notes before the next round.</p>
              </article>
              <article className="prep-focus-card">
                <h4>Resume alignment</h4>
                <p>Check which resume version is attached so your examples match the story you applied with.</p>
              </article>
            </div>
          </section>
        </>
      )}
    </section>
  );
}

function InterviewPrepCard({ application }: { application: Application }) {
  const followUpStatus = getFollowUpStatus(application.followUpDate);

  return (
    <article className="interview-prep-card">
      <div className="interview-prep-card-header">
        <div>
          <h3>{application.companyName}</h3>
          <p>{application.jobTitle}</p>
        </div>
        <span className={getStatusBadgeClass(application.status)}>{application.status}</span>
      </div>

      <dl className="interview-prep-details">
        <div>
          <dt>Follow-up date</dt>
          <dd>{formatDisplayDate(application.followUpDate)}</dd>
        </div>
        <div>
          <dt>Follow-up status</dt>
          <dd>
            <span className={`follow-up-label ${followUpStatus}`}>{getFollowUpLabel(followUpStatus)}</span>
          </dd>
        </div>
        <div>
          <dt>Next action</dt>
          <dd>{application.nextAction || "Not set"}</dd>
        </div>
        <div>
          <dt>Resume version</dt>
          <dd>
            {application.resumeVersion ? (
              application.resumeVersion.fileUrl ? (
                <a href={application.resumeVersion.fileUrl}>{application.resumeVersion.name}</a>
              ) : (
                application.resumeVersion.name
              )
            ) : (
              "Not set"
            )}
          </dd>
        </div>
      </dl>

      <div className="quick-links">
        <Link className="button secondary small" to={`/applications/${application.id}`}>
          Open detail
        </Link>
      </div>
    </article>
  );
}
