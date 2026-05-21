import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { createApplication, getApplication, updateApplication } from "../api/applications";
import { useApplicationStore } from "../store/applicationStore";
import type { ApplicationInput, ApplicationStatus } from "../types";

const statuses: ApplicationStatus[] = ["SAVED", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED", "ARCHIVED"];

const applicationFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  location: z.string().optional(),
  status: z.enum(["SAVED", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED", "ARCHIVED"]),
  source: z.string().optional(),
  appliedDate: z.string().optional(),
  nextAction: z.string().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional()
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

const defaultValues: ApplicationFormValues = {
  companyName: "",
  jobTitle: "",
  jobUrl: "",
  location: "",
  status: "SAVED",
  source: "",
  appliedDate: "",
  nextAction: "",
  followUpDate: "",
  notes: ""
};

function toDateInput(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

export function ApplicationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { upsertApplication } = useApplicationStore();
  const isEditing = Boolean(id);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    getApplication(id)
      .then((application) => {
        upsertApplication(application);
        reset({
          companyName: application.companyName,
          jobTitle: application.jobTitle,
          jobUrl: application.jobUrl || "",
          location: application.location || "",
          status: application.status,
          source: application.source || "",
          appliedDate: toDateInput(application.appliedDate),
          nextAction: application.nextAction || "",
          followUpDate: toDateInput(application.followUpDate),
          notes: application.notes || ""
        });
      })
      .catch((err: Error) => setLoadError(err.message))
      .finally(() => setIsLoading(false));
  }, [id, reset, upsertApplication]);

  async function onSubmit(values: ApplicationFormValues) {
    const payload: ApplicationInput = values;

    try {
      setSaveError(null);

      if (id) {
        const updated = await updateApplication(id, payload);
        upsertApplication(updated);
        navigate(`/applications/${updated.id}`);
        return;
      }

      const created = await createApplication(payload);
      upsertApplication(created);
      navigate(`/applications/${created.id}`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">{isEditing ? "Edit" : "Create"}</p>
          <h2>{isEditing ? "Edit Application" : "New Application"}</h2>
        </div>
      </div>

      {loadError && <p className="error">Could not load application: {loadError}</p>}
      {saveError && <p className="error">Could not save application: {saveError}</p>}
      {isLoading && <p className="muted">Loading application...</p>}

      {!isLoading && !loadError && (
      <form className="application-form" onSubmit={handleSubmit(onSubmit)}>
        <label>
          Company name
          <input {...register("companyName")} />
          {errors.companyName && <span>{errors.companyName.message}</span>}
        </label>

        <label>
          Job title
          <input {...register("jobTitle")} />
          {errors.jobTitle && <span>{errors.jobTitle.message}</span>}
        </label>

        <label>
          Status
          <select {...register("status")}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label>
          Job URL
          <input {...register("jobUrl")} />
          {errors.jobUrl && <span>{errors.jobUrl.message}</span>}
        </label>

        <label>
          Location
          <input {...register("location")} />
        </label>

        <label>
          Source
          <input {...register("source")} />
        </label>

        <label>
          Applied date
          <input type="date" {...register("appliedDate")} />
        </label>

        <label>
          Follow-up date
          <input type="date" {...register("followUpDate")} />
        </label>

        <label className="wide">
          Next action / follow-up task
          <input placeholder="Example: Send recruiter follow-up" {...register("nextAction")} />
        </label>

        <label className="wide">
          Notes
          <textarea rows={5} {...register("notes")} />
        </label>

        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save application"}
        </button>
        <Link className="button secondary" to={id ? `/applications/${id}` : "/applications"}>
          Cancel
        </Link>
      </form>
      )}
    </section>
  );
}
