import React from "react";
import "components/Appointment/styles.scss"
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Delete from "./Delete";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const {time, interview, interviewers, id, bookInterview, cancelInterview} = props;

  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const STATUS_SAVING = 'STATUS_SAVING';
  const STATUS_DELETING = 'STATUS_DELETING';
  const DELETE = 'DELETE';
  const EDIT = 'EDIT';
  const ERROR_SAVE = 'ERROR_SAVE';
  const ERROR_DELETE = 'ERROR_DELETE';

  const { mode, transition, back } = useVisualMode(
    interview ? SHOW : EMPTY
    );
  

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    }
    transition(STATUS_SAVING);

    bookInterview(id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch(() => {
        transition(ERROR_SAVE, true);
      })
  };

  function deleteAppointment() {
    transition(DELETE)
  }

  function onConfirm() {
    transition(STATUS_DELETING, true);

    cancelInterview(id)
      .then(() => {
        transition(EMPTY);
      })
      .catch(() => {
        transition(ERROR_DELETE, true);
      })
  }

  function editInterview() {
    transition(EDIT);
  }

  function closeError() {
    back();
  }


  return (
    <article className="appointment" data-testid="appointment">
      <Header time={time}/>
      {mode === SHOW && <Show student={interview.student} interviewer={interview.interviewer} onDelete={deleteAppointment} onEdit={editInterview}/>}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)}/>}
      {mode === CREATE && <Form interviewers={interviewers} onCancel={back} onSave={save}/>}
      {mode === STATUS_SAVING && <Status message={'Saving...'}/>}
      {mode === STATUS_DELETING && <Status message={'Deleting...'}/>}
      {mode === DELETE && <Delete message={'Are you sure you would like to delete?'} onCancel={back} onConfirm={onConfirm}/>}
      {mode === EDIT && <Form student={interview.student} interviewer={interview.interviewer.id} interviewers={interviewers} onCancel={back} onSave={save}/>}
      {mode === ERROR_SAVE && <Error message={'Oops... something went wrong while trying to save your appointment.'} onClose={closeError}/>}
      {mode === ERROR_DELETE && <Error message={'Oops... something went wrong while trying to delete your appointment.'} onClose={closeError}/>}
    </article>
  );
}