import React, { useState } from 'react';
import logo from './logo.png';
import './App.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import HighlightOutlinedIcon from '@mui/icons-material/HighlightOutlined';

import {
  useMutation,
  gql
} from "@apollo/client";
import { Grid } from '@mui/material';

const SUBMIT_FORM = gql`
  mutation SUBMIT_FORM($email: String) {
    createFormSubmission(data:{email:$email}){
      id
    }
  }
`;

const App = (props) => {
  const [email, setEmail] = useState("");
  const [submitForm, { data, loading, error }] = useMutation(SUBMIT_FORM);

  const handleSubmit = () => {
    console.log("HI");
    submitForm({ variables: { email: email } });
    console.log(loading);
  }

  const handleEmail = (e) => {
    setEmail(e.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Typography className="tagline" variant="h5" fontWeight={900}>
          Video editing made easy.
        </Typography>
        <Stack direction={'row'} alignItems={'center'}>
          <TextField
            value={email}
            label="Email"
            onChange={handleEmail}
            error={error != null}
            helperText={error ? error.message.split(':')[1] : ''}
          />
          <LoadingButton
            loading={loading}
            className="button"
            variant="contained"
            onClick={handleSubmit}
            disabled={email === ""}
            endIcon={<SendIcon />}
            loadingPosition="end"
          >
            Submit
          </LoadingButton>
        </Stack>
      </header>
      <main>
        <div className="description">
          <Typography variant="body2" fontSize={'20px'} fontWeight={700}>
            Built for business owners who want to advertise on social media, Redigo is an online video editor that makes it easy to add text to videos and export to any social media platform.
          </Typography>
        </div>
        <Grid container spacing={2} className="features">
          <Grid item>
            <Paper square elevation={3} className="feature">
              <Stack spacing={2}>
                <TextsmsOutlinedIcon />
                <Typography variant="subtitle">
                  Animated Text Overlays
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item>
            <Paper square elevation={3} className="feature">
              <Stack spacing={2}>
                <ExitToAppOutlinedIcon />
                <Typography variant="subtitle">
                  Social Media Export
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item>
            <Paper square elevation={3} className="feature">
              <Stack spacing={2}>
                <HighlightOutlinedIcon />
                <Typography variant="subtitle">
                  Intuitive Editor
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
        <div className='survey'>
          <Typography variant="h5">
            We need your help!
          </Typography>
          <Typography variant="h6">
            <a
              className="App-link"
              href="https://forms.gle/dg6q2kyTrNF4UFYs7"
              target="_blank"
              rel="noopener noreferrer"
            >
              Take a survey to help us understand your needs. 
            </a>
          </Typography>
        </div>

        {/* <a
          className="App-link"
          href="https://forms.gle/dg6q2kyTrNF4UFYs7"
          target="_blank"
          rel="noopener noreferrer"
        >
          Take a survey
        </a>
        <div className="text">
          Stay updated on our progress
        </div>
        <TextField
          value={email}
          label="Email"
          onChange={handleEmail}
          error={error != null}
          helperText={error ? error.message.split(':')[1] : ''}
        />
        <LoadingButton
          loading={loading}
          className="button"
          variant="contained"
          onClick={handleSubmit}
          disabled={email === ""}
          endIcon={<SendIcon />}
          loadingPosition="end"
        >
          Submit
        </LoadingButton> */}
      </main>
    </div>
  );
}

export default App;
