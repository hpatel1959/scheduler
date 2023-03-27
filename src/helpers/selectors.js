export default function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.filter(oneDay => oneDay.name === day)[0];
  if (!filteredDay) {
    return [];
  }

  const appointments = filteredDay.appointments.map(appointmentId => state.appointments[appointmentId])
  return appointments;
}

