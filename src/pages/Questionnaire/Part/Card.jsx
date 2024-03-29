import { useState, useEffect } from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, Typography, AccordionDetails, AccordionSummary, Accordion, Button, List, ListItem, Input, InputAdornment, Paper } from '@mui/material';
import QuestionCard from "../Question/Card";
import QuestionForm from '../Question/Form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import sendAuthenticatedRequest from '../../../utils/api';


const Part = ({ part, handlePartChange }) => {
  const [questions, setQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [headline, setHeadline] = useState('');
  const [newHeadline, setNewHeadline] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setQuestions(part.questions);
    setHeadline(part.headline);
  }, [part]);

  const fetchQuestions = async () => {
    try {
      const { data } = await sendAuthenticatedRequest(`http://localhost:3600/api/part/${part.id}/question`, 'GET');
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const postNewQuestion = async (values) => {
    try {
      const { data } = await sendAuthenticatedRequest(`http://localhost:3600/api/question`, 'POST', {
        content: values.questionContent,
        part_id: part.id
      });

      const qstId = data.id;

      await sendAuthenticatedRequest(`http://localhost:3600/api/answer`, 'POST', {
        content: values.correctAnswer,
        is_correct: true,
        question_id: qstId
      });

      for (const answer of values.incorrectAnswers) {
        await sendAuthenticatedRequest(`http://localhost:3600/api/answer`, 'POST', {
          content: answer,//.content,
          is_correct: false,
          question_id: qstId
        });
      }

      if (values.file) {
        const formData = new FormData();
        formData.append("file", values.file);
        await sendAuthenticatedRequest(`http://localhost:3600/api/question/${qstId}/image`, 'POST', formData);
      }

      fetchQuestions();
    } catch (error) {
      console.error('Error creating new question:', error);
    }
  };

  const handleDeleteQuestion = () => {
    fetchQuestions();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSave = async (values) => {
    await postNewQuestion(values);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await sendAuthenticatedRequest(`http://localhost:3600/api/part/${part.id}`, 'DELETE');
      handlePartChange();
    } catch (error) {
      console.error('Error deleting part:', error);
    }
    handleCloseMenu();
  };

  const handleEdit = async (e) => {
    e.stopPropagation();
    setNewHeadline(headline);
    setIsEditing(true);
    handleCloseMenu();
  };

  const handleEditPart = async () => {
    try {
      // await axios.patch(`http://localhost:3600/api/part/${part.id}`, { headline: newHeadline });
      await sendAuthenticatedRequest(`http://localhost:3600/api/part/${part.id}`, 'PATCH', { headline: newHeadline });
      handlePartChange();
    } catch (error) {
      console.error('Error editing part:', error);
    }
  };

  const handleClickMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const initialValues = {
    questionContent: '',
    correctAnswer: '',
    incorrectAnswers: [],
    file: ''
  };

  return (
    <>
      <Accordion
        defaultExpanded={true}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <IconButton onClick={handleClickMenu}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Edit</Typography>
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Delete</Typography>
            </MenuItem>
          </Menu>
          {
            isEditing ?
              <Input
                autoFocus
                onChange={(e) => {
                  setNewHeadline(e.target.value);
                }}
                defaultValue={headline}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={(e) => {
                      e.stopPropagation();
                      handleEditPart();
                    }}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(false);
                      setNewHeadline('')
                    }}>
                      <CloseIcon />
                    </IconButton>

                  </InputAdornment>
                }
              />
              :
              <Typography variant='h5'>{headline}</Typography>
          }

        </AccordionSummary>
        <AccordionDetails>
          {questions && questions.length > 0 && (
            <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper', margin: 'auto' }}>
              {questions.map((qst) => (
                <ListItem alignItems="flex-start" key={qst.id}>
                  <QuestionCard question={qst} onDelete={handleDeleteQuestion} />
                </ListItem>
              ))}
            </List>
          )}
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', margin: 'auto' }}>
            <ListItem>
              <Button
                style={{ width: '100%', height: '100%' }}
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
              >
                + Add Question
              </Button>
            </ListItem>
          </List>
          {open && (
            <QuestionForm options={{ open, initialValues, handleCancel, handleSave }} />
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default Part;
