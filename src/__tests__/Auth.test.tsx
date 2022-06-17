import React from "react";
import { render, screen, cleanup, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import LoginPage from "../Pages/LoginPage";
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

afterEach(() => {
 global.fetch = originalFetch;
});

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
     <LoginPage />
    </Router>
   </Provider>
  );
  expect(container).toMatchSnapshot();
 });

 it("changes login values", () => {
  render(
   <Router>
    <LoginPage />
   </Router>
  );

  const emailInput = screen.getByTestId("Email");
  const passwordInput = screen.getByTestId("Password");

  userEvent.type(emailInput, "example@example.com");
  userEvent.type(passwordInput, "example");

  expect(emailInput).toHaveValue("example@example.com");
  expect(passwordInput).toHaveValue("example");
 });

 it("should login user", () => {

   const mockAuth = ({
    signInWithEmailAndPassword: jest.fn(),
   } as unknown) as Auth;
   (getAuth as jest.MockedFunction<typeof getAuth>).mockReturnValue(mockAuth);

   const email = "example@example.com";
   const password = "example";
   
   const Login = () => {

    const loginUser = async () => await signInWithEmailAndPassword(getAuth(), email, password);

    return (
      <div>
        <button data-testid="loginBtn" onClick={() => loginUser()}></button>
      </div>
    );
  }

  render(<Login />);

  const loginBtn = screen.getByTestId("loginBtn");
  fireEvent.click(loginBtn);

  expect(getAuth).toBeCalledTimes(1);
 });

 it('navigates to register page', async () => {

  render(
   <Router>
    <LoginPage />
    <RegisterPage />
   </Router>
  );

  const promise = Promise.resolve();
  await act(async () => {
   await promise;
  });

  userEvent.click(screen.getByTestId('register-link'));

  await waitFor(() => {
   expect(screen.getByTestId('login-link')).toBeInTheDocument();
  });
 });

});

describe("Register Page", () => {

 const setup = async () => {
  const { container, rerender } = render(
   <Router>
    <RegisterPage />
   </Router>
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

 it("renders register page", async () => {
  const { container } = await setup();
  expect(container).toMatchSnapshot();
 });

 it("changes register input values", async () => {
  await setup();

  fireEvent.change(screen.getByTestId("Email"), {target: {value: "example@example.com"}});
  fireEvent.change(screen.getByTestId("Password"), {target: {value: "example"}});
  fireEvent.change(screen.getByTestId("confirmPassword"), {target: {value: "example"}});
  
  expect(screen.getByTestId("Email")).toHaveValue("example@example.com");
  expect(screen.getByTestId("Password")).toHaveValue("example");
  expect(screen.getByTestId("confirmPassword")).toHaveValue("example");

  fireEvent.click(screen.getByTestId("profileBtn"));

  fireEvent.change(screen.getByTestId("Name"), {target: {value: "example"}});
  userEvent.selectOptions(screen.getByTestId("Select"), "United Arab Emirates");

  expect(screen.getByTestId("Name")).toHaveValue("example");
  expect((screen.getByText("United Arab Emirates") as HTMLOptionElement).selected).toBeTruthy();
 });

 it("should register user", async () => {
  const mockAuth = ({
   createUserWithEmailAndPassword: jest.fn(),
  } as unknown) as Auth;
  (getAuth as jest.MockedFunction<typeof getAuth>).mockReturnValue(mockAuth);

  const email = "example@example.com";
  const password = "example";

  const Register = () => {
    const registerUser = async () => await createUserWithEmailAndPassword(getAuth(), email, password);
    return (
      <div>
        <button data-testid="registerBtn" onClick={() => registerUser()}></button>
      </div>
    );
  }


  render(<Register />);

  const registerBtn = screen.getByTestId("registerBtn");
  fireEvent.click(registerBtn);

  expect(getAuth).toBeCalledTimes(1);
 });

 it('navigates to login page', async () => {

  render(
   <Router>
    <RegisterPage />
    <LoginPage />
   </Router>
  );

  const promise = Promise.resolve();
  await act(async () => {
   await promise;
  });

  userEvent.click(screen.getByTestId('login-link'));

  await waitFor(() => {
   expect(screen.getByTestId('register-link')).toBeInTheDocument();
  });
 });
});