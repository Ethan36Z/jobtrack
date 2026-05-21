import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createResumeVersion, deleteResumeVersion, getResumeVersions, updateResumeVersion } from "../api/applications";
import type { ResumeVersion, ResumeVersionInput } from "../types";

const resumeVersionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  targetRole: z.string().optional(),
  fileUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  notes: z.string().optional()
});

type ResumeVersionFormValues = z.infer<typeof resumeVersionSchema>;

const defaultValues: ResumeVersionFormValues = {
  name: "",
  targetRole: "",
  fileUrl: "",
  notes: ""
};

function display(value: string | null) {
  return value || "Not set";
}

export function ResumeVersionsPage() {
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>([]);
  const [editingVersion, setEditingVersion] = useState<ResumeVersion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ResumeVersionFormValues>({
    resolver: zodResolver(resumeVersionSchema),
    defaultValues
  });

  useEffect(() => {
    getResumeVersions()
      .then((versions) => {
        setResumeVersions(versions);
        setLoadError(null);
      })
      .catch((err: Error) => setLoadError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  function startEditing(version: ResumeVersion) {
    setEditingVersion(version);
    setSaveError(null);
    reset({
      name: version.name,
      targetRole: version.targetRole || "",
      fileUrl: version.fileUrl || "",
      notes: version.notes || ""
    });
  }

  function cancelEditing() {
    setEditingVersion(null);
    setSaveError(null);
    reset(defaultValues);
  }

  async function onSubmit(values: ResumeVersionFormValues) {
    const payload: ResumeVersionInput = values;

    try {
      setSaveError(null);

      if (editingVersion) {
        const updated = await updateResumeVersion(String(editingVersion.id), payload);
        setResumeVersions((versions) => versions.map((version) => (version.id === updated.id ? updated : version)));
        cancelEditing();
        return;
      }

      const created = await createResumeVersion(payload);
      setResumeVersions((versions) => [created, ...versions]);
      reset(defaultValues);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Delete this resume version? Applications using it will be set to Not set.");

    if (!confirmed) {
      return;
    }

    try {
      setDeleteError(null);
      await deleteResumeVersion(String(id));
      setResumeVersions((versions) => versions.filter((version) => version.id !== id));

      if (editingVersion?.id === id) {
        cancelEditing();
      }
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Materials</p>
          <h2>Resume Versions</h2>
        </div>
      </div>

      {isLoading && <p className="muted">Loading resume versions...</p>}
      {loadError && <p className="error">Could not load resume versions: {loadError}</p>}
      {saveError && <p className="error">Could not save resume version: {saveError}</p>}
      {deleteError && <p className="error">Could not delete resume version: {deleteError}</p>}

      {!isLoading && !loadError && resumeVersions.length === 0 && (
        <div className="empty-state">
          <h3>No resume versions yet</h3>
          <p>Add the resumes you use for different roles.</p>
        </div>
      )}

      {!isLoading && !loadError && resumeVersions.length > 0 && (
        <div className="resume-version-list">
          {resumeVersions.map((version) => (
            <article className="resume-version-card" key={version.id}>
              <div>
                <h3>{version.fileUrl ? <a href={version.fileUrl}>{version.name}</a> : version.name}</h3>
                <p>{display(version.targetRole)}</p>
              </div>
              <p>{display(version.notes)}</p>
              <div className="actions">
                <button className="button secondary small" type="button" onClick={() => startEditing(version)}>
                  Edit
                </button>
                <button className="button danger small" type="button" onClick={() => handleDelete(version.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <form className="resume-version-form" onSubmit={handleSubmit(onSubmit)}>
        <h3>{editingVersion ? "Edit resume version" : "Add resume version"}</h3>

        <label>
          Name
          <input placeholder="Backend resume, product resume" {...register("name")} />
          {errors.name && <span>{errors.name.message}</span>}
        </label>

        <label>
          Target role
          <input placeholder="Backend Engineer, Product Manager" {...register("targetRole")} />
        </label>

        <label className="wide">
          File URL
          <input placeholder="https://..." {...register("fileUrl")} />
          {errors.fileUrl && <span>{errors.fileUrl.message}</span>}
        </label>

        <label className="wide">
          Notes
          <textarea rows={4} {...register("notes")} />
        </label>

        <div className="form-actions wide">
          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editingVersion ? "Save changes" : "Add resume"}
          </button>
          {editingVersion && (
            <button className="button secondary" type="button" onClick={cancelEditing}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
