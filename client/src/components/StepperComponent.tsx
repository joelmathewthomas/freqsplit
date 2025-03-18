import { Box, Stepper, Step, StepLabel } from '@mui/material';

const steps = ['Upload', 'Preview', 'Process', ,'Results'];

type StepperComponentProps = {
  activeStep: number;
};

function StepperComponent({ activeStep }: StepperComponentProps) {
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