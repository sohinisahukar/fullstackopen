
import { NewPatient, Gender, NewEntry, EntryType, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from './types/patients';
import { Diagnosis } from './types/diagnoses';


/* Helper function to assert never, for exhaustive checking */
const assertNever = (value: never): never => {
  throw new Error(`Unhandled value: ${value}`);
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const parseDateOfBirth = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date of birth');
  }
  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing SSN');
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};

const toNewPatient = (object: any): NewPatient => {
  return {
    name: parseName(object.name),
    dateOfBirth: parseDateOfBirth(object.dateOfBirth),
    ssn: parseSsn(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
    entries: []
  };
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const parseStringField = (field: unknown, fieldName: string): string => {
  if (!field || !isString(field)) {
    throw new Error(`Incorrect or missing ${fieldName}`);
  }
  return field;
};

const parseDateField = (field: unknown, fieldName: string): string => {
  if (!field || !isString(field) || !isDate(field)) {
    throw new Error(`Incorrect or missing ${fieldName}`);
  }
  return field;
};

const parseHealthCheckRating = (rating: unknown): number => {
  if (rating === undefined || rating === null || typeof rating !== 'number') {
    throw new Error('Incorrect or missing healthCheckRating');
  }
  return rating;
};

const toNewEntry = (object: any): NewEntry => {
  const baseEntry = {
    description: parseStringField(object.description, 'description'),
    date: parseDateField(object.date, 'date'),
    specialist: parseStringField(object.specialist, 'specialist'),
    diagnosisCodes: parseDiagnosisCodes(object),
  };

  switch (object.type) {
    case EntryType.HealthCheck:
      return {
        ...baseEntry,
        type: EntryType.HealthCheck,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
      } as HealthCheckEntry;
    case EntryType.Hospital:
      return {
        ...baseEntry,
        type: EntryType.Hospital,
        discharge: {
          date: parseDateField(object.discharge.date, 'discharge date'),
          criteria: parseStringField(object.discharge.criteria, 'criteria')
        }
      } as HospitalEntry;
    case EntryType.OccupationalHealthcare:
      return {
        ...baseEntry,
        type: EntryType.OccupationalHealthcare,
        employerName: parseStringField(object.employerName, 'employer name'),
        sickLeave: object.sickLeave ? {
          startDate: parseDateField(object.sickLeave.startDate, 'sick leave start date'),
          endDate: parseDateField(object.sickLeave.endDate, 'sick leave end date')
        } : undefined
      } as OccupationalHealthcareEntry;
    default:
      return assertNever(object as never);
  }
};

export { toNewPatient, toNewEntry, assertNever };
