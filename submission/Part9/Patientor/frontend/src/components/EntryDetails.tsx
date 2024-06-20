import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { Entry, Diagnosis, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from '../types';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';

const assertNever = (value: never): never => {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
  };

/*
  const EntryDetails: React.FC<{ entry: Entry; diagnoses: { [code: string]: Diagnosis } }> = ({ entry, diagnoses }) => {
  const diagnosisDetails = (codes: Array<string> | undefined) => {
    return codes ? (
      <Box component="ul" pl={2}>
        {codes.map(code => (
          <li key={code}>
            {code} {diagnoses[code]?.name}
          </li>
        ))}
      </Box>
    ) : null;
  };

  switch (entry.type) {
    case "HealthCheck":
      return (
        <ListItem>
          <Box display="flex" alignItems="center">
            <HealthAndSafetyIcon />
            <ListItemText
              primary={`${entry.date} - Health Check`}
              secondary={
                <Box component="div">
                  <Typography component="div">Specialist: {entry.specialist}</Typography>
                  <Typography component="div">Description: {entry.description}</Typography>
                  <Typography component="div">Health Rating: {entry.healthCheckRating}</Typography>
                  {diagnosisDetails(entry.diagnosisCodes)}
                </Box>
              }
            />
          </Box>
        </ListItem>
      );
    case "Hospital":
      return (
        <ListItem>
          <Box display="flex" alignItems="center">
            <LocalHospitalIcon />
            <ListItemText
              primary={`${entry.date} - Hospital`}
              secondary={
                <Box component="div">
                  <Typography component="div">Specialist: {entry.specialist}</Typography>
                  <Typography component="div">Description: {entry.description}</Typography>
                  <Typography component="div">Discharge Date: {entry.discharge.date}</Typography>
                  <Typography component="div">Criteria: {entry.discharge.criteria}</Typography>
                  {diagnosisDetails(entry.diagnosisCodes)}
                </Box>
              }
            />
          </Box>
        </ListItem>
      );
    case "OccupationalHealthcare":
      return (
        <ListItem>
          <Box display="flex" alignItems="center">
            <WorkIcon />
            <ListItemText
              primary={`${entry.date} - Occupational Healthcare`}
              secondary={
                <Box component="div">
                  <Typography component="div">Specialist: {entry.specialist}</Typography>
                  <Typography component="div">Description: {entry.description}</Typography>
                  <Typography component="div">Employer: {entry.employerName}</Typography>
                  {entry.sickLeave && (
                    <Box component="div">
                      <Typography component="div">Sick Leave Start: {entry.sickLeave.startDate}</Typography>
                      <Typography component="div">Sick Leave End: {entry.sickLeave.endDate}</Typography>
                    </Box>
                  )}
                  {diagnosisDetails(entry.diagnosisCodes)}
                </Box>
              }
            />
          </Box>
        </ListItem>
      );
    default:
      return assertNever(entry);
  }
};

*/

const diagnosisDetails = (codes: Array<string> | undefined, diagnoses: { [code: string]: Diagnosis }) => {
    return codes ? (
      <ul>
        {codes.map(code => (
          <li key={code}>
            {code} {diagnoses[code]?.name}
          </li>
        ))}
      </ul>
    ) : null;
  };

  const HealthCheckEntryDetails: React.FC<{ hEntry: HealthCheckEntry; diagnoses: { [code: string]: Diagnosis } }> = ({ hEntry, diagnoses }) => (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" marginBottom={2}>
          <HealthAndSafetyIcon />
          <Typography variant="h6" component="div" marginLeft={1}>
            {hEntry.date}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {hEntry.description}
        </Typography>
        <FavoriteIcon color={hEntry.healthCheckRating === 0 ? 'success' : 'warning'} />
        <Typography variant="body2" color="textSecondary">
          diagnose by {hEntry.specialist}
        </Typography>
        {diagnosisDetails(hEntry.diagnosisCodes, diagnoses)}
      </CardContent>
    </Card>
  );

  const HospitalEntryDetails: React.FC<{ hosEntry: HospitalEntry; diagnoses: { [code: string]: Diagnosis } }> = ({ hosEntry, diagnoses }) => (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" marginBottom={2}>
          <LocalHospitalIcon />
          <Typography variant="h6" component="div" marginLeft={1}>
            {hosEntry.date}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {hosEntry.description}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Discharge date: {hosEntry.discharge.date}, Criteria: {hosEntry.discharge.criteria}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          diagnose by {hosEntry.specialist}
        </Typography>
        {diagnosisDetails(hosEntry.diagnosisCodes, diagnoses)}
      </CardContent>
    </Card>
  );

  const OccupationalHealthcareEntryDetails: React.FC<{ oEntry: OccupationalHealthcareEntry; diagnoses: { [code: string]: Diagnosis } }> = ({ oEntry, diagnoses }) => (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" marginBottom={2}>
          <WorkIcon />
          <Typography variant="h6" component="div" marginLeft={1}>
            {oEntry.date}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {oEntry.description}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Employer: {oEntry.employerName}
        </Typography>
        {oEntry.sickLeave && (
          <Typography variant="body2" color="textSecondary">
            Sick Leave Start: {oEntry.sickLeave.startDate} End: {oEntry.sickLeave.endDate}
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary">
          diagnose by {oEntry.specialist}
        </Typography>
        {diagnosisDetails(oEntry.diagnosisCodes, diagnoses)}
      </CardContent>
    </Card>
  );

  const EntryDetails: React.FC<{ entry: Entry; diagnoses: { [code: string]: Diagnosis } }> = ({ entry, diagnoses }) => {
    switch (entry.type) {
      case 'HealthCheck':
        return <HealthCheckEntryDetails hEntry={entry} diagnoses={diagnoses} />;
      case 'Hospital':
        return <HospitalEntryDetails hosEntry={entry} diagnoses={diagnoses} />;
      case 'OccupationalHealthcare':
        return <OccupationalHealthcareEntryDetails oEntry={entry} diagnoses={diagnoses} />;
      default:
        return assertNever(entry);
    }
  };

export default EntryDetails;
