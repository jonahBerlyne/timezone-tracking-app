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
import { auth } from "../firebaseConfig";
import { collection, doc, getDocs, onSnapshot, query, setDoc } from "firebase/firestore";
import uniqid from "uniqid";
import TeamsPage from "../Pages/TeamsPage";
import TeamPage from "../Pages/TeamPage";
import configureMockStore from "redux-mock-store";
import thunk from 'redux-thunk';

jest.mock("../firebaseConfig", () => {
  return {
    apps: ["appTestId"]
  };
});

jest.mock("firebase/auth");

jest.mock("firebase/firestore");

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

 it("creates a team", async () => {
  const mockAuth = ({
   currentUser: {
       uid: "abc"
   }
  } as unknown) as Auth;
  (getAuth as jest.Mock).mockReturnValue(mockAuth);
  (doc as jest.Mock).mockReturnValue({});
  (setDoc as jest.Mock).mockResolvedValue({
   id: "abc",
   name: "example"
  });

  render(
   <Router>
    <CreateTeamPage />
   </Router>
  );

  const jsdomAlert = window.alert;
  window.alert = () => {};

  fireEvent.change(screen.getByTestId("teamName"), {target: {value: "example"}});
  fireEvent.click(screen.getByTestId("createTeamBtn"));

  await waitFor(() => {
   expect(setDoc).toBeCalled();
  });

  window.alert = jsdomAlert;
 });
});

describe("Teams Page", () => {
 it("renders the teams page", () => {
  const mockAuth = ({
   currentUser: {
       uid: "abc"
   }
  } as unknown) as Auth;
  (getAuth as jest.Mock).mockReturnValue(mockAuth);
 
  const { container } = render(
   <Router>
    <TeamsPage />
   </Router>
  );
 
  expect(container).toMatchSnapshot();
 });
});

describe("Team Page", () => {

 const setup = async () => {
  const mockAuth = ({
   currentUser: {
       displayName: "example",
       email: "example@example.com",
       photoURL: "example.png",
       uid: "abc"
   }
  } as unknown) as Auth;
  (getAuth as jest.Mock).mockReturnValue(mockAuth);

  (getDocs as jest.Mock).mockResolvedValue([
   {
    data: () => ({
     id: "abc",
     name: "Alex",
     profilePic: "alex.png",
     timezoneData: {
      "countryCode": "AD",
      "countryName": "Andorra",
      "zoneName": "Europe/Andorra",
      "gmtOffset": 7200,
      "timestamp": 1464453737,
      "utcOffset": 2
     },
    })
   },
   {
    data: () => ({
     id: "abc2",
     name: "Bryce",
     profilePic: "bryce.png",
     timezoneData: {
      "countryCode": "FR",
      "countryName": "France",
      "zoneName": "Europe/Paris",
      "gmtOffset": 7200,
      "timestamp": 1464453737,
      "utcOffset": 2
     },
    })
   },
   {
    data: () => ({
     id: "abc3",
     name: "Carl",
     profilePic: "carl.png",
     timezoneData: {
      "countryCode": "AE",
      "countryName": "United Arab Emirates",
      "zoneName": "Asia/Dubai",
      "gmtOffset": 14400,
      "timestamp": 1464460937,
      "utcOffset": 4
     },
    })
   },
   {
    data: () => ({
     id: "abc4",
     name: "Darren",
     profilePic: "darren.png",
     timezoneData: {
      "countryCode": "AE",
      "countryName": "United Arab Emirates",
      "zoneName": "Asia/Dubai",
      "gmtOffset": 14400,
      "timestamp": 1464460937,
      "utcOffset": 4
     },
    })
   }
  ]);

  const mockStore = configureMockStore([thunk]);

  const store = mockStore({
   user: {
    user: {
     name: "example",
     photoUrl: "example.png",
     username: "example",
     format: "MT"
    }
   }
  });

  const { container } = render(
   <Provider store={store}>
    <Router>
     <TeamPage />
    </Router>
   </Provider>
  );

  const promise = Promise.resolve();
  await act(async () => {
   await promise;
  });

  return {
   container
  };
 }

 it("renders the team page", async () => {
  const { container } = await setup();
  expect(container).toMatchSnapshot();
 });

 it("renders the team members", async () => {
  await setup();

  expect(screen.queryByTestId("ampm_2")).not.toBeInTheDocument();
  expect(screen.getByTestId("MT_2")).toBeInTheDocument();
  expect(screen.getByTestId("offset_2").textContent).toHaveLength(6);
  expect(screen.getByTestId("name_0_2")).toHaveTextContent("Alex");
  expect(screen.getByTestId("name_1_2")).toHaveTextContent("Bryce");
  expect(screen.getByTestId("location_0_2")).toHaveTextContent("Andorra");
  expect(screen.getByTestId("location_1_2")).toHaveTextContent("Paris");

  expect(screen.queryByTestId("ampm_4")).not.toBeInTheDocument();
  expect(screen.getByTestId("MT_4")).toBeInTheDocument();
  expect(screen.getByTestId("offset_4").textContent).toHaveLength(6);
  expect(screen.getByTestId("name_0_4")).toHaveTextContent("Carl");
  expect(screen.getByTestId("name_1_4")).toHaveTextContent("Darren");
  expect(screen.getByTestId("location_0_4")).toHaveTextContent("Dubai");
 });
});