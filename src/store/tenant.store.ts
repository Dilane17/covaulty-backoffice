import { create } from "zustand";
import { Institution } from "@/types/institution.types";

interface TenantState {
  institution: Institution | null;
  institutionId: string | null;
  slug: string | null;
  isLoading: boolean;
  error: string | null;
  setInstitution: (inst: Institution | null, slug: string | null) => void;
  setError: (err: string) => void;
  setLoading: (loading: boolean) => void;
  setInstitutionFromUser: (institution: { id: string; name: string; slug: string }) => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  institution: null,
  institutionId: null,
  slug: null,
  isLoading: true,
  error: null,
  setInstitution: (inst, slug) => set({ 
    institution: inst, 
    institutionId: inst ? inst.id : null,
    slug: slug,
    error: null, 
    isLoading: false 
  }),
  setInstitutionFromUser: (inst) => set({
    institution: inst as Institution,
    institutionId: inst.id,
    slug: inst.slug,
    error: null,
    isLoading: false
  }),
  setError: (err) => set({ error: err, isLoading: false, institution: null, institutionId: null, slug: null }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
