import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Login from "../Pages/LoginPage";
import { BrowserRouter as Router } from "react-router-dom";
import { Auth, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Provider } from "react-redux";
import { store } from "../Redux/Store";

jest.mock("../firebaseConfig", () => {
  return {
    apps: ["appTestId"]
  };
});

jest.mock("firebase/auth");

afterEach(done => {
  cleanup();
  jest.resetAllMocks();
  done();
});

describe("Login Page", () => {

 it("renders the login page", () => {
  const { container } = render(
   <Provider store={store}>
    <Router>
     <Login />
    </Router>
   </Provider>
  );
  expect(container).toMatchSnapshot();
 });

 it("should login user", () => {

   const mockAuth = ({
    signInWithEmailAndPassword: jest.fn(),
   } as unknown) as Auth;
   (getAuth as jest.MockedFunction<typeof getAuth>).mockReturnValue(mockAuth);

   const email = "example@example.com";
   const password = "example";
   
   const LoginScreen = () => {

    const loginUser = async () => await signInWithEmailAndPassword(getAuth(), email, password);

    return (
      <div>
        <button data-testid="loginBtn" onClick={() => loginUser()}></button>
      </div>
    );
  }

  render(<LoginScreen />);

  const loginBtn = screen.getByTestId("loginBtn");
  fireEvent.click(loginBtn);

  expect(getAuth).toBeCalledTimes(1);
 });

});