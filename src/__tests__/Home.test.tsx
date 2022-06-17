import React, { useState } from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import HomePage from "../Pages/HomePage";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from '../Redux/Store';
import { Auth, getAuth } from 'firebase/auth';
import configureMockStore from "redux-mock-store";
import thunk from 'redux-thunk';

jest.mock("../firebaseConfig", () => {
  return {
    apps: ["appTestId"]
  };
});

jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn()
  };
});

jest.mock('firebase/firestore');

afterEach(done => {
  cleanup();
  jest.resetAllMocks();
  done();
});

describe("Home Page", () => {

 const setup = () => {

  const mockStore = configureMockStore([thunk]);

  const store = mockStore({
   user: {
    user: {
     name: "example",
     photoUrl: "example.png",
     username: "example",
     format: "ampm"
    }
   }
  });

  const { container } = render(
   <Provider store={store}>
    <Router>
     <HomePage />
    </Router>
   </Provider>
  );

  return {
   container
  };
 }

 it("renders the home page", () => {
  const { container } = setup();
  expect(container).toMatchSnapshot();
 });

 it("displays the dummy team text", () => {
  setup();

  expect(screen.getByTestId("ampm_-7").textContent).toHaveLength(7);
  expect(screen.getByTestId("ampm_-4").textContent).toHaveLength(7);
  expect(screen.getByTestId("ampm_1").textContent).toHaveLength(7);

  expect(screen.queryByTestId("MT_-7")).not.toBeInTheDocument();
  expect(screen.queryByTestId("MT_-4")).not.toBeInTheDocument();
  expect(screen.queryByTestId("MT_1")).not.toBeInTheDocument();

  expect(screen.getByTestId("offset_-7").textContent).toHaveLength(6);
  expect(screen.getByTestId("offset_-4").textContent).toHaveLength(6);
  expect(screen.getByTestId("offset_1").textContent).toHaveLength(6);

  expect(screen.getByTestId("name_0_-7")).toHaveTextContent("Mark");
  expect(screen.getByTestId("location_0_-7")).toHaveTextContent("Los Angeles");

  expect(screen.getByTestId("name_0_-4")).toHaveTextContent("Trent");
  expect(screen.getByTestId("location_0_-4")).toHaveTextContent("New York");

  expect(screen.getByTestId("name_1_-4")).toHaveTextContent("Melinda");
  expect(screen.getByTestId("location_1_-4")).toHaveTextContent("New York");
  
  expect(screen.getByTestId("name_0_1")).toHaveTextContent("Jacob");
  expect(screen.getByTestId("location_0_1")).toHaveTextContent("London");
 });
});