import { useState, useEffect } from 'react';
import axios from 'axios';


export default function useApplicationData() {

  const [state, setState]= useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = (day) => {
    setState({...state, day: day.name})
  }

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
      .then((all) => {
        setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
      });
  }, [])

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        setState({...state, appointments});
        updateSpots(appointments);
        
        
      })
  }

  function cancelInterview(id) {
    const appointment = {...state.appointments[id], interview: null}
    const appointments = {...state.appointments, [id]: appointment};

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState({...state, appointments});
        updateSpots(appointments);

      })
  }

  function updateSpots(appointments) {

    const currentDay = state.day;
    const currentDayObj = state.days.find(day => day.name === currentDay);

    if (!currentDayObj) {
      return
    };

    const appointmentIdsForDay = currentDayObj.appointments;
    const currentDayId = currentDayObj.id;

    let numOfSpots = 0;

    for (const appointmentId of appointmentIdsForDay) {
      if (appointments[appointmentId].interview === null) {
        numOfSpots++
      }
    }
    
    const updatedDays = state.days.map(day => {
      if (day.id === currentDayId) {
        return { ...day, spots: numOfSpots };
      }
      return day;
    });

    setState(prev => ({...prev, days: updatedDays}))
  }

  return {setDay, state, bookInterview, cancelInterview};
}