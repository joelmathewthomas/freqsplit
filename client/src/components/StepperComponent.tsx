import React from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';

const steps = ['Upload', 'Preview', 'Process', 'Results'];

function StepperComponent({ activeStep }) {
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default StepperComponent;