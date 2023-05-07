import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Divider, IconButton, CardMedia } from '@mui/material';
import { Formik, Field, FieldArray } from 'formik';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import Uploader from '../../../components/Uploader';

const QuestionForm = ({ options }) => {

  const handleSaveFormik = (values) => {
    if (options.isEditing) {
      options.handleEdit(values);
    } else {
      options.handleSave(values);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
    },
    textField: {
      display: 'inline-block',
    },
    iconButton: {
      display: 'inline-block',
    },
  };

  return (
    <Formik initialValues={options.initialValues} onSubmit={handleSaveFormik}>
      {(formik) => (
        <form>
          <Dialog open={options.open} PaperProps={{ style: { minWidth: '80%', minHeight: '80%' } }}>
            <DialogTitle>{options.isEditing ? 'Edit question' : 'New question'}</DialogTitle>
            <DialogContent>

              {/* question */}

              <Field
                as={TextField}
                margin="dense"
                label="question"
                type="text"
                fullWidth
                required
                name="questionContent"
              />
              {
                formik.initialValues.image ?
                  <CardMedia
                    component="img"
                    src={`http://localhost:3600/images/${formik.initialValues.image}`}
                    alt="Uploaded Image"
                    sx={{ maxWidth: '45%', maxHeight: '45%' }} // Set the desired width and height
                  />
                  :
                  <Uploader setFile={(file) => {
                    formik.setFieldValue('file', file);
                  }} />
              }

              {/* correct answer */}

              <Divider sx={{ mt: 2, mb: 2 }} />
              <Field
                as={TextField}
                margin="dense"
                label="correct answer"
                type="text"
                fullWidth
                name="correctAnswer"
              />
              <Divider sx={{ mt: 2, mb: 2 }} />

              {/* incorrect answers */}

              <FieldArray name="incorrectAnswers">
                {({ push, remove }) => (
                  <>
                    {formik.values.incorrectAnswers?.map((answer, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <Field
                          style={styles.textField}
                          as={TextField}
                          margin="dense"
                          label={`incorrect answer ${index + 1}`}
                          type="text"
                          fullWidth
                          name={`incorrectAnswers[${index}].content`}
                        />
                        <IconButton aria-label="delete" onClick={() => remove(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    ))}
                    <Button variant="contained" color="secondary" onClick={() => push('')} sx={{ mt: 2 }}>
                      Add incorrect answer
                    </Button>
                  </>
                )}
              </FieldArray>
            </DialogContent>

            <DialogActions>
              <Button onClick={options.handleCancel}>Cancel</Button>
              <Button onClick={() => handleSaveFormik(formik.values)}>{options.isEditing ? 'Save' : 'Add'}</Button>
            </DialogActions>
          </Dialog>
        </form>
      )}
    </Formik>
  );
}

export default QuestionForm;
