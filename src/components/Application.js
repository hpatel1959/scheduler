import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "./DayList";
import "components/Appointment"
import Appointment from "components/Appointment";
import getAppointmentsForDay from "helpers/selectors";
import { getInterview, getInterviewersForDay } from "helpers/selectors";


export default function Application(props) {
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

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  const appointmentsArr = Object.values(dailyAppointments).map(appointment => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={dailyInterviewers}
      />
    );
  })

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
        <DayList
          days={state.days}
          value={state.day}
          onChange={day => setDay(day)}
        />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentsArr}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
