import React from "react";
import "components/InterviewerList.scss"
import InterviewerListItem from "./InterviewerListItem";

export default function InterviewerList(props) {
  const { interviewers, setInterviewer, interviewer} = props;

  const InterviewerListItemArr = interviewers.map((oneInterviewer) => {
    return (
      <InterviewerListItem key={oneInterviewer.id} selected={oneInterviewer.id === interviewer} avatar={oneInterviewer.avatar} name={oneInterviewer.name} setInterviewer={setInterviewer}/>
    );
  })

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {InterviewerListItemArr}
      </ul>
    </section>
  );
}