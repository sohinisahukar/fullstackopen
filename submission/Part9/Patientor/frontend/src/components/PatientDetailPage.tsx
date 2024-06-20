import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container, Typography, List } from '@mui/material';
import { Patient, Diagnosis } from '../types';
import patientService from '../services/patients';
import diagnosesService from '../services/diagnoses';
import EntryDetails from './EntryDetails';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<{ [code: string]: Diagnosis }>({});

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const data = await patientService.getPatient(id);
        setPatient(data);
      }
    };

    const fetchDiagnoses = async () => {
      const data = await diagnosesService.getAll();
      setDiagnoses(data.reduce((acc, diagnosis) => {
        acc[diagnosis.code] = diagnosis;
        return acc;
      }, {} as { [code: string]: Diagnosis }));
    };

    fetchPatient();
    fetchDiagnoses();
  }, [id]);

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4">
        {patient.name} 
        {patient.gender === 'male' ? <MaleIcon /> : patient.gender === 'female' ? <FemaleIcon /> : <TransgenderIcon />}
      </Typography>
      <Typography variant="body1"><strong>SSN:</strong> {patient.ssn}</Typography>
      <Typography variant="body1"><strong>Occupation:</strong> {patient.occupation}</Typography>
      <Typography variant="body1"><strong>Date of Birth:</strong> {patient.dateOfBirth}</Typography>
      <Typography variant="h6">Entries</Typography>
      <List>
        {patient.entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
        ))}
      </List>
    </Container>
  );
};

export default PatientDetailPage;
