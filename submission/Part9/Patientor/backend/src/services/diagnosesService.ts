import diagnoses from '../data/diagnosesData';
import { Diagnosis } from '../types/diagnoses';

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

export default {
  getDiagnoses
};