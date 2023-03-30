import React from "react";
import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByPlaceholderText, getByAltText, queryByText, waitForElementToBeRemoved, getByTestId } from "@testing-library/react";
import Application from "components/Application";
import axios from "axios";
import factoryWithTypeCheckers from "prop-types/factoryWithTypeCheckers";

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

    await waitForElement(() => queryByText(firstAppointment, 'Lydia Miller-Jones'));
    expect(getByText(firstAppointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => {
      return queryByText(day, "Monday")
    });
    
    expect(queryByText(day, 'no spots remaining')).toBeTruthy();
  });

  it("Loads data, cancels an interview, and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, "appointment");
    const firstBookedAppointment = appointment[1];

    fireEvent.click(getByAltText(firstBookedAppointment, "Delete"));

    expect(getByText(firstBookedAppointment, 'Confirm')).toBeTruthy();

    fireEvent.click(getByText(firstBookedAppointment, "Confirm"));

    expect(getByText(firstBookedAppointment, 'Deleting...')).toBeTruthy();

    await waitForElementToBeRemoved(() => getByText(firstBookedAppointment, "Deleting..."));

    expect(queryByText(firstBookedAppointment, 'Archie Cohen')).toBe(null);
    expect(getByAltText(firstBookedAppointment, 'Add')).toBeInTheDocument();

    const day = getAllByTestId(container, 'day').find(day => getByText(day, 'Monday'));

    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();
  });

  it("Loads data, edits an interview, and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, "appointment");
    const firstBookedAppointment = appointment[1];

    fireEvent.click(getByAltText(firstBookedAppointment, "Edit"));

    expect(getByText(firstBookedAppointment, 'Save')).toBeTruthy();

    fireEvent.change(getByPlaceholderText(firstBookedAppointment, "Enter Student Name"), {
      target: {value: 'Lydia Miller-Jones'}
    });

    fireEvent.click(getByText(firstBookedAppointment, "Save"));

    expect(getByText(firstBookedAppointment, 'Saving...')).toBeTruthy();

    await waitForElementToBeRemoved(() => getByText(firstBookedAppointment, "Saving..."));

    expect(queryByText(firstBookedAppointment, 'Lydia Miller-Jones')).toBeInTheDocument();

    const day = getAllByTestId(container, 'day').find(day => getByText(day, 'Monday'));

    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const firstAppointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(firstAppointment, "Add"));

    fireEvent.change(getByPlaceholderText(firstAppointment, "Enter Student Name"), {
      target: {value: 'Lydia Miller-Jones'}
    });

    fireEvent.click(getByAltText(firstAppointment, "Sylvia Palmer"));

    fireEvent.click(getByText(firstAppointment, "Save"))

    await waitForElementToBeRemoved(() => getByText(firstAppointment, "Saving..."));


    expect(getByText(firstAppointment, 'Oops... something went wrong while trying to save your appointment.')).toBeInTheDocument();

    fireEvent.click(getByAltText(firstAppointment, 'Close'));

    expect(getByText(firstAppointment, 'Save')).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, "appointment");
    const firstBookedAppointment = appointment[1];

    fireEvent.click(getByAltText(firstBookedAppointment, "Delete"));

    expect(getByText(firstBookedAppointment, 'Confirm')).toBeTruthy();

    fireEvent.click(getByText(firstBookedAppointment, "Confirm"));

    expect(getByText(firstBookedAppointment, 'Deleting...')).toBeTruthy();

    await waitForElementToBeRemoved(() => getByText(firstBookedAppointment, "Deleting..."));

    expect(getByText(firstBookedAppointment, 'Oops... something went wrong while trying to delete your appointment.')).toBeInTheDocument();

    fireEvent.click(getByAltText(firstBookedAppointment, 'Close'));

    expect(getByAltText(firstBookedAppointment, 'Delete')).toBeInTheDocument();
  });

})

