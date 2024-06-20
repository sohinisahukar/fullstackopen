import express from 'express';
import patientsService from '../services/patientsService';
// import { NewPatient } from '../types/patients';
import toNewPatient from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(patientsService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const patient = patientsService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
    try {
    //   const newPatient: NewPatient = req.body;
      const newPatient = toNewPatient(req.body)
      const addedPatient = patientsService.addPatient(newPatient);
      res.json(addedPatient);
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      res.status(400).send(errorMessage);
    }
  });

export default router;