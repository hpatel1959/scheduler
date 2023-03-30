import React from "react";
import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByPlaceholderText, getByAltText } from "@testing-library/react";
import Application from "components/Application";

afterEach(cleanup);
describe('Application', () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"))
    fireEvent.click(getByText('Tuesday'))
    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });

  it("Loads data, books an interview, and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const firstAppointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(firstAppointment, "Add"));

    fireEvent.change(getByPlaceholderText(firstAppointment, "Enter Student Name"), {
      target: {value: 'Lydia Miller-Jones'}
    });

    fireEvent.click(getByAltText(firstAppointment, "Sylvia Palmer"));

    fireEvent.click(getByText(firstAppointment, "Save"));

    expect(getByText(firstAppointment, "Saving...")).toBeInTheDocument();
    console.log(prettyDOM(firstAppointment));

  });

})

