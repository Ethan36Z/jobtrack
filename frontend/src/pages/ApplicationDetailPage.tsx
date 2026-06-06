import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import {
  createCompanyResearch,
  createInterviewNote,
  deleteApplication,
  deleteCompanyResearch,
  deleteInterviewNote,
  getApplication,
  getCompanyResearch,
  getInterviewNotes,
  updateCompanyResearch,
  updateInterviewNote
} from "../api/applications";
import { useApplicationStore } from "../store/applicationStore";
import type { Application, CompanyResearch, CompanyResearchInput, InterviewNote, InterviewNoteInput } from "../types";
import { formatDisplayDate } from "../utils/dateFormat";
import { getFollowUpLabel, getFollowUpStatus } from "../utils/followUp";
import { getStatusBadgeClass } from "../utils/statusBadge";

//===============================helper functions===============================

function display(value: string | null) {
  return value || "Not set";
}

function toDateInput(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

const interviewNoteSchema = z.object({
  roundName: z.string().optional(),
  interviewDate: z.string().optional(),
  interviewer: z.string().optional(),
  format: z.string().optional(),
  summary: z.string().optional(),
  questions: z.string().optional(),
  nextSteps: z.string().optional(),
  result: z.string().optional()
});

type InterviewNoteFormValues = z.infer<typeof interviewNoteSchema>;

const emptyInterviewNoteValues: InterviewNoteFormValues = {
  roundName: "",
  interviewDate: "",
  interviewer: "",
  format: "",
  summary: "",
  questions: "",
  nextSteps: "",
  result: ""
};

const companyResearchSchema = z.object({
  companyWebsite: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  companySize: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  mission: z.string().optional(),
  products: z.string().optional(),
  techStack: z.string().optional(),
  cultureNotes: z.string().optional(),
  interviewTips: z.string().optional(),
  redFlags: z.string().optional(),
  whyInterested: z.string().optional()
});

type CompanyResearchFormValues = z.infer<typeof companyResearchSchema>;

const emptyCompanyResearchValues: CompanyResearchFormValues = {
  companyWebsite: "",
  companySize: "",
  industry: "",
  location: "",
  mission: "",
  products: "",
  techStack: "",
  cultureNotes: "",
  interviewTips: "",
  redFlags: "",
  whyInterested: ""
};

//===============================main component===============================

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

//===============================rendering===============================

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

{/*===============================pipeline stepper===============================*/}

      <ApplicationPipelineStepper status={application.status} />

{/*===============================follow-up panel===============================*/}

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
            <dd>{formatDisplayDate(application.followUpDate)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span className={`follow-up-label ${followUpStatus}`}>{getFollowUpLabel(followUpStatus)}</span>
            </dd>
          </div>
        </dl>
      </section>

{/*===============================application details===============================*/}

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
            <span className={getStatusBadgeClass(application.status)}>{application.status}</span>
          </dd>
        </div>
        <div>
          <dt>Applied date</dt>
          <dd>{formatDisplayDate(application.appliedDate)}</dd>
        </div>
        <div>
          <dt>Resume version</dt>
          <dd>
            {application.resumeVersion ? (
              <>
                {application.resumeVersion.fileUrl ? (
                  <a href={application.resumeVersion.fileUrl}>{application.resumeVersion.name}</a>
                ) : (
                  application.resumeVersion.name
                )}
                {application.resumeVersion.targetRole ? ` - ${application.resumeVersion.targetRole}` : ""}
              </>
            ) : (
              "Not set"
            )}
          </dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{formatDisplayDate(application.createdAt)}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{formatDisplayDate(application.updatedAt)}</dd>
        </div>
      </dl>

      <section className="notes">
        <h3>Notes</h3>
        <p>{display(application.notes)}</p>
      </section>

      <CompanyResearchSection applicationId={application.id} />

      <InterviewNotesSection applicationId={application.id} />
    </section>
  );
}

//===============================pipeline stepper===============================

const pipelineSteps = ["SAVED", "APPLIED", "INTERVIEWING", "OFFER"] as const;

function ApplicationPipelineStepper({ status }: { status: Application["status"] }) {
  const activeIndex = pipelineSteps.indexOf(status as (typeof pipelineSteps)[number]);
  const isTerminal = status === "REJECTED" || status === "ARCHIVED";

  return (
    <section className={`pipeline-stepper ${isTerminal ? "terminal" : ""}`}>
      <div>
        <p className="eyebrow">Pipeline</p>
        <h3>Application Status</h3>
      </div>
      <ol>
        {pipelineSteps.map((step, index) => {
          const state = isTerminal ? "muted" : index < activeIndex ? "complete" : index === activeIndex ? "current" : "future";

          return (
            <li className={state} key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </li>
          );
        })}
        {isTerminal && (
          <li className={`terminal-${status.toLowerCase()}`}>
            <span>{status === "REJECTED" ? "!" : "-"}</span>
            <strong>{status}</strong>
          </li>
        )}
      </ol>
    </section>
  );
}

//===============================company research section===============================

function CompanyResearchSection({ applicationId }: { applicationId: number }) {
  const [companyResearch, setCompanyResearch] = useState<CompanyResearch | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CompanyResearchFormValues>({
    resolver: zodResolver(companyResearchSchema),
    defaultValues: emptyCompanyResearchValues
  });

  useEffect(() => {
    setIsLoading(true);
    getCompanyResearch(String(applicationId))
      .then((research) => {
        setCompanyResearch(research);
        setLoadError(null);
      })
      .catch((err: Error) => setLoadError(err.message))
      .finally(() => setIsLoading(false));
  }, [applicationId]);

  function startEditing() {
    setIsEditing(true);
    setSaveError(null);
    reset(companyResearch ? toCompanyResearchFormValues(companyResearch) : emptyCompanyResearchValues);
  }

  function cancelEditing() {
    setIsEditing(false);
    setSaveError(null);
    reset(companyResearch ? toCompanyResearchFormValues(companyResearch) : emptyCompanyResearchValues);
  }

  async function onSubmit(values: CompanyResearchFormValues) {
    const payload: CompanyResearchInput = values;

    try {
      setSaveError(null);

      if (companyResearch) {
        const updated = await updateCompanyResearch(String(companyResearch.id), payload);
        setCompanyResearch(updated);
        setIsEditing(false);
        reset(toCompanyResearchFormValues(updated));
        return;
      }

      const created = await createCompanyResearch(String(applicationId), payload);
      setCompanyResearch(created);
      setIsEditing(false);
      reset(toCompanyResearchFormValues(created));
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function handleDelete() {
    if (!companyResearch) {
      return;
    }

    const confirmed = window.confirm("Delete this company research? This cannot be undone.");

    if (!confirmed) {
      return;
    }

    try {
      setDeleteError(null);
      await deleteCompanyResearch(String(companyResearch.id));
      setCompanyResearch(null);
      setIsEditing(false);
      reset(emptyCompanyResearchValues);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <section className="company-research-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Company Context</p>
          <h3>Company Research</h3>
        </div>
        {!isLoading && !loadError && !isEditing && !companyResearch && (
          <button className="button secondary" type="button" onClick={startEditing}>
            Add research
          </button>
        )}
      </div>

      {isLoading && <p className="muted">Loading company research...</p>}
      {loadError && <p className="error">Could not load company research: {loadError}</p>}
      {saveError && <p className="error">Could not save company research: {saveError}</p>}
      {deleteError && <p className="error">Could not delete company research: {deleteError}</p>}

      {!isLoading && !loadError && !companyResearch && !isEditing && (
        <div className="empty-state">
          <h3>No company research yet</h3>
          <p>Add useful company context for interview prep and application decisions.</p>
        </div>
      )}

{/*===============================company research display===============================*/}

      {!isLoading && !loadError && companyResearch && !isEditing && (
        <article className="company-research-card">
          <dl className="company-research-grid">
            <div>
              <dt>Website</dt>
              <dd>
                {companyResearch.companyWebsite ? (
                  <a href={companyResearch.companyWebsite}>{companyResearch.companyWebsite}</a>
                ) : (
                  "Not set"
                )}
              </dd>
            </div>
            <div>
              <dt>Company size</dt>
              <dd>{display(companyResearch.companySize)}</dd>
            </div>
            <div>
              <dt>Industry</dt>
              <dd>{display(companyResearch.industry)}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{display(companyResearch.location)}</dd>
            </div>
            <div>
              <dt>Mission</dt>
              <dd>{display(companyResearch.mission)}</dd>
            </div>
            <div>
              <dt>Products</dt>
              <dd>{display(companyResearch.products)}</dd>
            </div>
            <div>
              <dt>Tech stack</dt>
              <dd>{display(companyResearch.techStack)}</dd>
            </div>
            <div>
              <dt>Culture notes</dt>
              <dd>{display(companyResearch.cultureNotes)}</dd>
            </div>
            <div>
              <dt>Interview tips</dt>
              <dd>{display(companyResearch.interviewTips)}</dd>
            </div>
            <div>
              <dt>Red flags</dt>
              <dd>{display(companyResearch.redFlags)}</dd>
            </div>
            <div>
              <dt>Why interested</dt>
              <dd>{display(companyResearch.whyInterested)}</dd>
            </div>
          </dl>
          <div className="form-actions">
            <button className="button secondary small" type="button" onClick={startEditing}>
              Edit
            </button>
            <button className="button danger small" type="button" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </article>
      )}

{/*===============================company research form===============================*/}

      {!isLoading && !loadError && isEditing && (
        <form className="company-research-form" onSubmit={handleSubmit(onSubmit)}>
          <label>
            Company website
            <input placeholder="https://..." {...register("companyWebsite")} />
            {errors.companyWebsite && <span>{errors.companyWebsite.message}</span>}
          </label>

          <label>
            Company size
            <input {...register("companySize")} />
          </label>

          <label>
            Industry
            <input {...register("industry")} />
          </label>

          <label>
            Location
            <input {...register("location")} />
          </label>

          <label className="wide">
            Mission
            <textarea rows={3} {...register("mission")} />
          </label>

          <label className="wide">
            Products
            <textarea rows={3} {...register("products")} />
          </label>

          <label className="wide">
            Tech stack
            <textarea rows={3} {...register("techStack")} />
          </label>

          <label className="wide">
            Culture notes
            <textarea rows={3} {...register("cultureNotes")} />
          </label>

          <label className="wide">
            Interview tips
            <textarea rows={3} {...register("interviewTips")} />
          </label>

          <label className="wide">
            Red flags
            <textarea rows={3} {...register("redFlags")} />
          </label>

          <label className="wide">
            Why interested
            <textarea rows={3} {...register("whyInterested")} />
          </label>

          <div className="form-actions wide">
            <button className="button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : companyResearch ? "Save research" : "Add research"}
            </button>
            <button className="button secondary" type="button" onClick={cancelEditing}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

//===============================company research data to form values===============================

function toCompanyResearchFormValues(research: CompanyResearch): CompanyResearchFormValues {
  return {
    companyWebsite: research.companyWebsite || "",
    companySize: research.companySize || "",
    industry: research.industry || "",
    location: research.location || "",
    mission: research.mission || "",
    products: research.products || "",
    techStack: research.techStack || "",
    cultureNotes: research.cultureNotes || "",
    interviewTips: research.interviewTips || "",
    redFlags: research.redFlags || "",
    whyInterested: research.whyInterested || ""
  };
}

//===============================interview notes section===============================

function InterviewNotesSection({ applicationId }: { applicationId: number }) {
  const [interviewNotes, setInterviewNotes] = useState<InterviewNote[]>([]);
  const [editingNote, setEditingNote] = useState<InterviewNote | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<InterviewNoteFormValues>({
    resolver: zodResolver(interviewNoteSchema),
    defaultValues: emptyInterviewNoteValues
  });

  useEffect(() => {
    setIsLoading(true);
    getInterviewNotes(String(applicationId))
      .then((notes) => {
        setInterviewNotes(notes);
        setLoadError(null);
      })
      .catch((err: Error) => setLoadError(err.message))
      .finally(() => setIsLoading(false));
  }, [applicationId]);

  function startAdding() {
    setEditingNote(null);
    setSaveError(null);
    reset(emptyInterviewNoteValues);
    setIsFormOpen(true);
  }

  function startEditing(note: InterviewNote) {
    setEditingNote(note);
    setSaveError(null);
    reset({
      roundName: note.roundName || "",
      interviewDate: toDateInput(note.interviewDate),
      interviewer: note.interviewer || "",
      format: note.format || "",
      summary: note.summary || "",
      questions: note.questions || "",
      nextSteps: note.nextSteps || "",
      result: note.result || ""
    });
    setIsFormOpen(true);
  }

  function cancelEditing() {
    setEditingNote(null);
    setSaveError(null);
    reset(emptyInterviewNoteValues);
    setIsFormOpen(false);
  }

  async function onSubmit(values: InterviewNoteFormValues) {
    const payload: InterviewNoteInput = values;

    try {
      setSaveError(null);

      if (editingNote) {
        const updated = await updateInterviewNote(String(editingNote.id), payload);
        setInterviewNotes((notes) => notes.map((note) => (note.id === updated.id ? updated : note)));
        cancelEditing();
        return;
      }

      const created = await createInterviewNote(String(applicationId), payload);
      setInterviewNotes((notes) => [created, ...notes]);
      cancelEditing();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function handleDelete(noteId: number) {
    const confirmed = window.confirm("Delete this interview note? This cannot be undone.");

    if (!confirmed) {
      return;
    }

    try {
      setDeleteError(null);
      await deleteInterviewNote(String(noteId));
      setInterviewNotes((notes) => notes.filter((note) => note.id !== noteId));

      if (editingNote?.id === noteId) {
        cancelEditing();
      }
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <section className="interview-notes-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Interview Prep</p>
          <h3>Interview Notes</h3>
        </div>
        {!isLoading && !loadError && !isFormOpen && (
          <button className="button secondary" type="button" onClick={startAdding}>
            Add note
          </button>
        )}
      </div>

      {isLoading && <p className="muted">Loading interview notes...</p>}
      {loadError && <p className="error">Could not load interview notes: {loadError}</p>}
      {saveError && <p className="error">Could not save interview note: {saveError}</p>}
      {deleteError && <p className="error">Could not delete interview note: {deleteError}</p>}

      {!isLoading && !loadError && interviewNotes.length === 0 && (
        <div className="empty-state">
          <h3>No interview notes yet</h3>
          <p>Add notes after recruiter screens, technical interviews, or final rounds.</p>
        </div>
      )}

      {!isLoading && !loadError && interviewNotes.length > 0 && (
        <div className="interview-note-list">
          {interviewNotes.map((note) => (
            <article className="interview-note-card" key={note.id}>
              <div className="interview-note-header">
                <div>
                  <h4>{note.roundName || "Interview note"}</h4>
                  <p>
                    {formatDisplayDate(note.interviewDate)}
                    {note.interviewer ? ` - ${note.interviewer}` : ""}
                    {note.format ? ` - ${note.format}` : ""}
                  </p>
                </div>
              </div>

              <dl className="interview-note-details">
                <div>
                  <dt>Summary</dt>
                  <dd>{display(note.summary)}</dd>
                </div>
                <div>
                  <dt>Questions</dt>
                  <dd>{display(note.questions)}</dd>
                </div>
                <div>
                  <dt>Next steps</dt>
                  <dd>{display(note.nextSteps)}</dd>
                </div>
                <div>
                  <dt>Result</dt>
                  <dd>{display(note.result)}</dd>
                </div>
              </dl>
              <div className="form-actions">
                <button className="button secondary small" type="button" onClick={() => startEditing(note)}>
                  Edit
                </button>
                <button className="button danger small" type="button" onClick={() => handleDelete(note.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {isFormOpen && (
        <form className="interview-note-form" onSubmit={handleSubmit(onSubmit)}>
          <h4>{editingNote ? "Edit interview note" : "Add interview note"}</h4>

          <label>
            Round name
            <input placeholder="Recruiter screen, onsite, final round" {...register("roundName")} />
          </label>

          <label>
            Interview date
            <input type="date" {...register("interviewDate")} />
          </label>

          <label>
            Interviewer
            <input {...register("interviewer")} />
          </label>

          <label>
            Format
            <input placeholder="Phone, video, onsite" {...register("format")} />
          </label>

          <label className="wide">
            Summary
            <textarea rows={3} {...register("summary")} />
          </label>

          <label className="wide">
            Questions
            <textarea rows={3} {...register("questions")} />
          </label>

          <label className="wide">
            Next steps
            <textarea rows={3} {...register("nextSteps")} />
          </label>

          <label className="wide">
            Result
            <input placeholder="Pending, moved forward, rejected, offer" {...register("result")} />
          </label>

          <div className="form-actions wide">
            <button className="button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingNote ? "Save changes" : "Add note"}
            </button>
            <button className="button secondary" type="button" onClick={cancelEditing}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
