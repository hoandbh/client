import { useNavigate, useParams } from 'react-router-dom';
import { React, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/authContext'
import Box from '@mui/material/Box';
import { useState } from 'react';
import axios from 'axios';
import { Card, Fab, Paper, TextField, Grid } from '@mui/material';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import { spacing } from '@mui/system';
import CircularProgress from '@mui/material/CircularProgress';

//FileOpenIcon
const MixQuestionnaire = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  const [questionnaireDetails, setQuestionnaireDetails] = useState({});
  const [amount, setAmount] = useState();
  // const [show, setShow] = useState(false);


  const fetchData = async () => {
    const { data: questionnaire } = await axios.get(`http://localhost:3600/api/questionnaire/${id}`);
    setQuestionnaireDetails(questionnaire);
  }
  const navBack = async () => {

    navigate(`/questionnaire/${id}`);
  }

  const handleMixButton = async () => {
    const ans = await axios.post(`http://localhost:3600/api/questionnaire/${id}/generate-versions`, { amount });
    navigate(`/versions/${id}`);
  }

  useEffect(() => {
    fetchData();
  }, [])

  return <>

    <Grid container
      spacing={5}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <h1> Test Mixing </h1>
      <br />


      <h3>Finish And Mix
      </h3>
      <TextField
        sx={{ width: 200 }}
        id="outlined-number"
        label="Number of Versions"
        type="number"
        onBlur={e => {
          const enteredValue = e.target.value;
          if (!enteredValue || (enteredValue >= 0 && enteredValue <= 100)) {
            setAmount(enteredValue);
          }
        }}
        value={amount}
        InputProps={{
          inputProps: {
            min: 0,
            max: 100
          }
        }}
      />
      <br /><br />
      <Fab variant="extended" color='primary' onClick={handleMixButton}>
        Complete And Create Versions
      </Fab>

      <Grid item>

      </Grid>
    </Grid>


    <Fab variant="extended" onClick={navBack}>
      <ContentPasteSearchIcon sx={{ mr: 1 }} />
      Back to Editing Questionnaire
    </Fab>




  </>
}


export default MixQuestionnaire;

