import patients from '../data/patientsData';
import { Patient,NewPatient, NonSensitivePatient } from '../types/patients';
import { v1 as uuid } from 'uuid';

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const findById = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addPatient = (entry: Omit<Patient, 'id'>): Patient => {
    const newPatient = {
      id: uuid(),
      ...entry
    };
  
    patients.push(newPatient);
    return newPatient;
};

export default {
  getNonSensitivePatients,
  findById,
  addPatient
};