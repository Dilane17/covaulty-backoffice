import api from "./api";
import { Institution, CreateInstitutionPayload, InviteInstitutionPayload } from "@/types/institution.types";

export const institutionService = {
  resolveTenant: async (slug: string): Promise<Institution> => {
    const response = await api.get<Institution>(`/institutions/${slug}`);
    return response.data;
  },

  getAll: async (): Promise<Institution[]> => {
    const response = await api.get<Institution[]>("/institutions");
    return response.data;
  },

  create: async (payload: CreateInstitutionPayload): Promise<Institution> => {
    const response = await api.post<Institution>("/institutions", payload);
    return response.data;
  },

  invite: async (payload: InviteInstitutionPayload): Promise<{ message: string; institution: Institution }> => {
    const response = await api.post<{ message: string; institution: Institution }>("/institutions/invite", payload);
    return response.data;
  },
};
