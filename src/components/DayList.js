import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  const { days, value, onChange } = props;

  const arrOfDaysListItems = days.map((oneDay) => {
    return (
      <DayListItem
        selected={oneDay.name === value}
        setDay={onChange}
        key={oneDay.key}
        name={oneDay.name}
        spots={oneDay.spots}
      />
    );
  });

  return (
    <ul>
      {arrOfDaysListItems}
    </ul>
  );
}