import React, {useState } from 'react';
import logo from './logo.png';
import './App.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const App = (props) => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    // save email
    setEmail("")
  }

  const handleChange = (e) => {
    setEmail(e.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="text">
          For small business owners who want to advertise on social media Redigo is an online video editor that makes it easy to add text to videos and export to any social media platform.
        </div>
        <a
          className="App-link"
          href="https://forms.gle/dg6q2kyTrNF4UFYs7"
          target="_blank"
          rel="noopener noreferrer"
        >
          Take a survey
        </a>
        <div className="text">
          Want to stay updated on our progress?
        </div>
        <TextField
          value={email}
          label="Email"
          onChange={handleChange}
        />
        <Button
          className="button"
          variant="contained"
          onClick={() => {handleSubmit()}}
          disabled={email === ""}
        >
          Submit
        </Button>
      </header>
    </div>
  );
}

export default App;
