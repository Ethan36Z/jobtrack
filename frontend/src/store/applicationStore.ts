import { create } from "zustand";
import type { Application } from "../types";

type ApplicationState = {
  applications: Application[];
  setApplications: (applications: Application[]) => void;
  removeApplication: (id: number) => void;
  upsertApplication: (application: Application) => void;
};

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: [],
  setApplications: (applications) => set({ applications }),
  removeApplication: (id) => set((state) => ({ applications: state.applications.filter((application) => application.id !== id) })),
  upsertApplication: (application) =>
    set((state) => {
      const exists = state.applications.some((item) => item.id === application.id);

      return {
        applications: exists
          ? state.applications.map((item) => (item.id === application.id ? application : item))
          : [application, ...state.applications]
      };
    })
}));
