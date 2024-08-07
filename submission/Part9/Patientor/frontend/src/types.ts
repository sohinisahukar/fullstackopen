export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

interface BaseEntry {
  id: string;
  date: string;
  type: string;
  specialist: string;
  description: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: number;
}

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export type Entry = 
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

  export type NewEntry =
  | Omit<HealthCheckEntry, 'id'>
  | Omit<HospitalEntry, 'id'>
  | Omit<OccupationalHealthcareEntry, 'id'>;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;