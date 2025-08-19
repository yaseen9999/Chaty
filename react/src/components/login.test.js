import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "./login";

describe("login component render all elements", () => {
  it("shoud render all dom elements", () => {
    render(<SignIn />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });
});
