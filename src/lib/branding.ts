export type Branding = {
  businessName: string;
  logoUrl?: string; // opcional, por ahora puede estar vacío
};

export const BRANDING: Branding = {
  businessName: "Amaretto", // cámbialo cuando quieras
  logoUrl: undefined,
};
