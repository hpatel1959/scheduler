import React from "react";
import "components/Appointment/styles.scss"
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const {time, interview, interviewers, id, bookInterview} = props;

  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const STATUS = 'STATUS';

  const { mode, transition, back } = useVisualMode(
    interview ? SHOW : EMPTY
    );
  
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    }
    transition(STATUS);

    bookInterview(id, interview)
      .then(() => {
        transition(SHOW);
      })
  };

  return (
    <article className="appointment">
      <Header time={time}/>
      {mode === SHOW && <Show student={interview.student} interviewer={interview.interviewer}/>}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)}/>}
      {mode === CREATE && <Form interviewers={interviewers} onCancel={back} onSave={save}/>}
      {mode === STATUS && <Status/>}
    </article>
  );
}