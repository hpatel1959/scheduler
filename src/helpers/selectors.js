export default function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.filter(oneDay => oneDay.name === day)[0];
  if (!filteredDay) {
    return [];
  }

  const appointments = filteredDay.appointments.map(appointmentId => state.appointments[appointmentId])
  return appointments;
}

export const getInterview = function(state, interview) {
  const appointmentWithInterview = Object.values(state.appointments).filter(appointment => appointment.interview === interview);
  if (appointmentWithInterview[0].interview) {
    const interviewerID = appointmentWithInterview[0].interview.interviewer;
    return {...interview, interviewer: state.interviewers[interviewerID]};
  } else {
    return null;
  }

  // console.log({'student': student, interviewer: state.interviewers[interviewerID]});
}