export interface Institution {
  id: string;
  name: string;
  subdomain: string;
  logoUrl?: string;
  primaryColor?: string;
}

export interface CreateInstitutionPayload {
  name: string;
  subdomain?: string;
}

export interface InviteInstitutionPayload {
  name: string;
  contactEmail: string;
}
