import React, { useState } from 'react';
import { render, screen, cleanup, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ProfilePage from '../Pages/ProfilePage';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { Auth, getAuth } from 'firebase/auth';
import configureMockStore from "redux-mock-store";
import thunk from 'redux-thunk';
import userEvent from '@testing-library/user-event';
import { doc } from 'firebase/firestore';

jest.mock("../firebaseConfig", () => {
  return {
    apps: ["appTestId"]
  };
});

jest.mock("firebase/auth");

jest.mock('firebase/firestore');

let originalFetch: any;

beforeEach(() => {
 originalFetch = global.fetch;
 global.fetch = jest.fn(() =>
   Promise.resolve({
     json: () => Promise.resolve({ 
      zones: [ 
        {
             "countryCode": "AD",
             "countryName": "Andorra",
             "zoneName": "Europe/Andorra",
             "gmtOffset": 7200,
             "timestamp": 1464453737
         },
         {
             "countryCode": "AE",
             "countryName": "United Arab Emirates",
             "zoneName": "Asia/Dubai",
             "gmtOffset": 14400,
             "timestamp": 1464460937
         },
         {
             "countryCode": "AF",
             "countryName": "Afghanistan",
             "zoneName": "Asia/Kabul",
             "gmtOffset": 16200,
             "timestamp": 1464462737
         }
      ] 
     }),
   })
 ) as jest.Mock;
});

afterEach(done => {
  global.fetch = originalFetch;
  cleanup();
  jest.resetAllMocks();
  done();
});

describe("Profile Page", () => {

 const setup = async () => {

  const mockStore = configureMockStore([thunk]);

  const store = mockStore({
   user: {
    user: {
     displayName: "example",
     email: "example@example.com",
     password: "example123",
     photoUrl: "example.png",
     format: "ampm",
     timezoneData: {
      "countryCode": "AD",
      "countryName": "Andorra",
      "zoneName": "Europe/Andorra",
      "gmtOffset": 7200,
      "timestamp": 1464453737,
      "utcOffset": 2
     },
    }
   }
  });

  const mockAuth = ({
   currentUser: {
       displayName: "example",
       email: "example@example.com",
       photoURL: "example.png",
       uid: "abc"
   }
  } as unknown) as Auth;
  (getAuth as jest.Mock).mockReturnValue(mockAuth);

  const { container, rerender } = render(
   <Provider store={store}>
    <Router>
     <ProfilePage />
    </Router>
   </Provider>
  );

  const promise = Promise.resolve();
  await act(async () => {
   await promise;
  });

  return {
   container,
   rerender
  };
 }

 it("renders the profile page", async () => {
  const { container } = await setup();
  expect(container).toMatchSnapshot();
 });

 it("displays the user's profile info", async () => {
  await setup();

  expect(screen.getByTestId("name")).toHaveTextContent("example");
  expect(screen.getByTestId("zoneName")).toHaveTextContent("Andorra");
  expect(screen.getByTestId("time").textContent).toHaveLength(7);
 });

 it("edits the user's profile pic", async () => {
  await setup();

  fireEvent.click(screen.getByTestId("editProfileBtn"));

  global.URL.createObjectURL = jest.fn();
  const fakeFile = new File(['example'], 'example2.png', { type: 'image/png' });
  const inputFile = screen.getByTestId(/imgInput/i);
  
  fireEvent.change(inputFile, {
   target: { files: [fakeFile] }
  });

  expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
  expect(screen.queryByTestId("imgFileErr")).not.toBeInTheDocument();
 });

 it("shows the img file error message", async () => {
  await setup();

  fireEvent.click(screen.getByTestId("editProfileBtn"));

  const fakeFile = new File(['example'], 'example2.xml', { type: 'image/xml' });
  const inputFile = screen.getByTestId(/imgInput/i);
  
  fireEvent.change(inputFile, {
   target: { files: [fakeFile] }
  });

  expect(screen.getByTestId("imgFileErr")).toBeInTheDocument();
  expect(screen.getByTestId("imgFileErr")).toHaveTextContent("Please choose an image file (png or jpeg)");
 });
 
 it("edits the user's profile", async () => {
  await setup();
  jest.useFakeTimers();

  fireEvent.click(screen.getByTestId("editProfileBtn"));

  fireEvent.change(screen.getByTestId("nameInput"), {target: {value: "example2"}});
  fireEvent.change(screen.getByTestId("emailInput"), {target: {value: "example2@example2.com"}});

  expect(screen.getByTestId("ampmBtn")).toBeChecked();
  expect(screen.getByTestId("MTBtn")).not.toBeChecked();
  fireEvent.click(screen.getByTestId("MTBtn"));

  userEvent.selectOptions(screen.getByTestId("countrySelect"), "United Arab Emirates");
  act(() => {
   jest.runAllTimers();
  });
  userEvent.selectOptions(screen.getByTestId("zoneSelect"), "Asia/Dubai");

  fireEvent.change(screen.getByTestId("passwordInput"), {target: {value: "example123"}});

  expect(screen.getByTestId("nameInput")).toHaveValue("example2");
  expect(screen.getByTestId("emailInput")).toHaveValue("example2@example2.com");
  expect(screen.getByTestId("ampmBtn")).not.toBeChecked();
  expect(screen.getByTestId("MTBtn")).toBeChecked();
  expect((screen.getByText("United Arab Emirates") as HTMLOptionElement).selected).toBeTruthy();
  expect((screen.getByText("Asia/Dubai") as HTMLOptionElement).selected).toBeTruthy();
  expect(screen.getByTestId("passwordInput")).toHaveValue("example123");
 });
});