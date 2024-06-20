import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Patient } from '../types';
import patientService from '../services/patients';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const data = await patientService.getPatient(id);
        setPatient(data);
      }
    };

    fetchPatient();
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
        {patient.entries.map((entry, index: number) => (
          <ListItem key={index}>
            <ListItemText primary={`Entry ${index + 1}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default PatientDetailPage;
