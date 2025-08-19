import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import Sendmessage from "./sendmessage";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
const mockSocket = {
  emit: jest.fn(),
};
describe("testing for Sendmessage Component", () => {
  it("should initialize message state as an empty string", () => {
    render(<Sendmessage socket={mockSocket} userid="123" receiverid="456" />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement.value).toBe("");
  });
  it("should render the component", () => {
    render(<Sendmessage socket={mockSocket} userid="123" receiverid="456" />);
    const inputElement = screen.getByRole("textbox");
    const sendButton = screen.getByLabelText("send-message");
    expect(inputElement).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  it("it should call handlesendessage function and emits events ", () => {
    render(<Sendmessage socket={mockSocket} userid="123" receiverid="456" />);
    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "Hello" } });
    expect(inputElement.value).toBe("Hello");
    const buttonElement = screen.getByLabelText("send-message");
    fireEvent.click(buttonElement);
    expect(mockSocket.emit).toHaveBeenCalledWith("notify", {
      userid: "123",
      receiverid: "456",
    });
    expect(mockSocket.emit).toHaveBeenCalledWith("message", {
      userid: "123",
      message: "Hello",
      receiverid: "456",
    });
    expect(inputElement.value).toBe("");
  });
});
