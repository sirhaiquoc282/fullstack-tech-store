import React, { useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" gutterBottom align="center">
          Forgot Password
        </Typography>
        {sent ? (
          <Typography variant="body1">Please check your email for reset instructions.</Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button variant="contained" fullWidth sx={{ mt: 2 }} type="submit">
              Send Reset Link
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
