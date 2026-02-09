// Shared types for the Sunder Dashboard

export type SunderHealth = "loading" | "active" | "error";
export type ConfigKey = "identity" | "contact" | "technical";

export interface VaultConfig {
  identity: boolean;
  contact: boolean;
  technical: boolean;
}

export interface CustomRule {
  pattern: string;
  replacement: string;
}

export interface Analytics {
  total: number;
  email: number;
  phone: number;
  ip_addr: number;
  path: number;
  secret: number;
  custom: number;
}

export type TokenCategory = "PROJECT" | "PERSON" | "ORG" | "LOCATION";

export const DEFAULT_CONFIG: VaultConfig = {
  identity: true,
  contact: true,
  technical: true,
};

export const DEFAULT_ANALYTICS: Analytics = {
  total: 0,
  email: 0,
  phone: 0,
  ip_addr: 0,
  path: 0,
  secret: 0,
  custom: 0,
};
