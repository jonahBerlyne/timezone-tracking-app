import React from "react";
import { render, screen, cleanup, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CreateTeamPage from "../Pages/CreateTeamPage";
import { BrowserRouter as Router } from "react-router-dom";
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Provider } from "react-redux";
import { store } from "../Redux/Store";
import userEvent from "@testing-library/user-event";
import RegisterPage from "../Pages/RegisterPage";
import { enableFetchMocks } from "jest-fetch-mock";

jest.mock("../firebaseConfig", () => {
  return {
    apps: ["appTestId"]
  };
});

jest.mock("firebase/auth");

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

describe("Create Team Page", () => {

 it("renders the create team page", () => {
  const { container } = render(
   <Router>
    <CreateTeamPage />
   </Router>
  );

  expect(container).toMatchSnapshot();
 });
});