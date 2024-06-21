import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  Alert,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { Entry, NewEntry, Diagnosis, HealthCheckRating } from '../types';
import patientService from '../services/patients';
import diagnosesService from '../services/diagnoses';

interface Props {
  patientId: string;
  onAddEntry: (entry: Entry) => void;
  onCancel: () => void;
}

const AddEntryForm: React.FC<Props> = ({ patientId, onAddEntry, onCancel }) => {
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [description, setDescription] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<'HealthCheck' | 'Hospital' | 'OccupationalHealthcare'>('HealthCheck');
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');

  useState(() => {
    const fetchDiagnoses = async () => {
      const data = await diagnosesService.getAll();
      setDiagnoses(data);
    };
    fetchDiagnoses();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let newEntry: NewEntry;

    switch (type) {
      case 'HealthCheck':
        newEntry = {
          date,
          specialist,
          description,
          type: 'HealthCheck',
          healthCheckRating,
          diagnosisCodes
        };
        break;
      case 'Hospital':
        newEntry = {
          date,
          specialist,
          description,
          type: 'Hospital',
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          },
          diagnosisCodes
        };
        break;
      case 'OccupationalHealthcare':
        newEntry = {
          date,
          specialist,
          description,
          type: 'OccupationalHealthcare',
          employerName,
          sickLeave: sickLeaveStartDate && sickLeaveEndDate ? {
            startDate: sickLeaveStartDate,
            endDate: sickLeaveEndDate
          } : undefined,
          diagnosisCodes
        };
        break;
      default:
        return;
    }

    try {
      const addedEntry = await patientService.addEntry(patientId, newEntry);
      onAddEntry(addedEntry);
      resetForm();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  const resetForm = () => {
    setDate('');
    setSpecialist('');
    setDescription('');
    setHealthCheckRating(HealthCheckRating.Healthy);
    setDiagnosisCodes([]);
    setDischargeDate('');
    setDischargeCriteria('');
    setEmployerName('');
    setSickLeaveStartDate('');
    setSickLeaveEndDate('');
    setError(null);
  };

  return (
    <Box border={1} padding={2} marginBottom={2}>
      <Typography variant="h6">New {type} entry</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select value={type} onChange={(e) => setType(e.target.value as 'HealthCheck' | 'Hospital' | 'OccupationalHealthcare')}>
          <MenuItem value="HealthCheck">Health Check</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
        </Select>
      </FormControl>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          label="Date"
          type="date"
          fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          required
          margin="normal"
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
          required
          margin="normal"
        />
        {type === 'HealthCheck' && (
          <FormControl fullWidth margin="normal">
            <InputLabel>HealthCheck Rating</InputLabel>
            <Select
              value={healthCheckRating}
              onChange={(e) => setHealthCheckRating(Number(e.target.value))}
            >
              {Object.keys(HealthCheckRating)
                .filter(key => !isNaN(Number(key)))
                .map(key => (
                  <MenuItem key={key} value={key}>
                    {HealthCheckRating[key as unknown as number]}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
        {type === 'Hospital' && (
          <>
            <TextField
              label="Discharge Date"
              type="date"
              fullWidth
              value={dischargeDate}
              onChange={(e) => setDischargeDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              required
              margin="normal"
            />
            <TextField
              label="Discharge Criteria"
              fullWidth
              value={dischargeCriteria}
              onChange={(e) => setDischargeCriteria(e.target.value)}
              required
              margin="normal"
            />
          </>
        )}
        {type === 'OccupationalHealthcare' && (
          <>
            <TextField
              label="Employer Name"
              fullWidth
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              label="Sick Leave Start Date"
              type="date"
              fullWidth
              value={sickLeaveStartDate}
              onChange={(e) => setSickLeaveStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
            <TextField
              label="Sick Leave End Date"
              type="date"
              fullWidth
              value={sickLeaveEndDate}
              onChange={(e) => setSickLeaveEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
          </>
        )}
        <FormControl fullWidth margin="normal">
          <InputLabel>Diagnosis Codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={(e) => setDiagnosisCodes(e.target.value as string[])}
          >
            {diagnoses.map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                {diagnosis.code} {diagnosis.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box display="flex" justifyContent="space-between" marginTop={2}>
          <Button onClick={onCancel} color="secondary" variant="contained">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Add</Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddEntryForm;
