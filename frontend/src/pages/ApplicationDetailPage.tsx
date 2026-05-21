import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import {
  createInterviewNote,
  deleteApplication,
  deleteInterviewNote,
  getApplication,
  getInterviewNotes,
  updateInterviewNote
} from "../api/applications";
import { useApplicationStore } from "../store/applicationStore";
import type { Application, InterviewNote, InterviewNoteInput } from "../types";
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

      <InterviewNotesSection applicationId={application.id} />
    </section>
  );
}

function InterviewNotesSection({ applicationId }: { applicationId: number }) {
  const [interviewNotes, setInterviewNotes] = useState<InterviewNote[]>([]);
  const [editingNote, setEditingNote] = useState<InterviewNote | null>(null);
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
  }

  function cancelEditing() {
    setEditingNote(null);
    setSaveError(null);
    reset(emptyInterviewNoteValues);
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
      reset(emptyInterviewNoteValues);
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
                    {formatDate(note.interviewDate)}
                    {note.interviewer ? ` · ${note.interviewer}` : ""}
                    {note.format ? ` · ${note.format}` : ""}
                  </p>
                </div>
                <div className="actions">
                  <button className="button secondary small" type="button" onClick={() => startEditing(note)}>
                    Edit
                  </button>
                  <button className="button danger small" type="button" onClick={() => handleDelete(note.id)}>
                    Delete
                  </button>
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
            </article>
          ))}
        </div>
      )}

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
          {editingNote && (
            <button className="button secondary" type="button" onClick={cancelEditing}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
