import React from "react";
import "components/InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";
import PropTypes from 'prop-types';

function InterviewerList(props) {
  const { interviewers, onChange, value } = props;

  const InterviewerListItemArr = interviewers.map((oneInterviewer) => {
    return (
      <InterviewerListItem
        key={oneInterviewer.id}
        selected={oneInterviewer.id === value}
        avatar={oneInterviewer.avatar}
        name={oneInterviewer.name}
        setInterviewer={() => onChange(oneInterviewer.id)}
      />
    );
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{InterviewerListItemArr}</ul>
    </section>
  );
}

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

export default InterviewerList;