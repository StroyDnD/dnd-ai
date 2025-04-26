import { vi, Mock, afterEach, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {userEvent} from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AuthModal, AuthError } from "../AuthModal";
import { useAuth } from "@/providers/AuthProvider";

// Mock useAuth
vi.mock("@/providers/AuthProvider", () => ({
  useAuth: vi.fn(() => ({
    showAuthModal: true,
    setShowAuthModal: mockSetShowAuthModal,
    login: mockLogin,
    signup: mockSignup,
    authLoading: false,
    authError: "",
  })),
}));

// Mock @ngneat/falso
vi.mock("@ngneat/falso", () => ({
  randProductAdjective: () => "Brave",
  randAnimal: () => "Lion",
}));

const mockSetShowAuthModal = vi.fn();
const mockLogin = vi.fn();
const mockSignup = vi.fn();

function setupAuthMock({
  showAuthModal = true,
  authLoading = false,
  authError = "",
} = {}) {
  (useAuth as Mock).mockReturnValue({
    showAuthModal,
    setShowAuthModal: mockSetShowAuthModal,
    login: mockLogin,
    signup: mockSignup,
    authLoading,
    authError,
  });
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("AuthModal", () => {
  it("renders modal when showAuthModal is true", () => {
    setupAuthMock({ showAuthModal: true });
    render(<AuthModal />);
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("does not render modal when showAuthModal is false", async () => {
    setupAuthMock({ showAuthModal: false });
    render(<AuthModal />);
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  it("switches to register mode and shows username input", async () => {
    setupAuthMock();
    render(<AuthModal />);
    await userEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByRole("button" , {name: "Register"})).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Brave Lion")).toBeInTheDocument();
  });

  it("switches back to login mode", async () => {
    setupAuthMock();
    render(<AuthModal />);
    await userEvent.click(screen.getByRole("button", { name: "Register" }));
    await userEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Username")).not.toBeInTheDocument();
  });

  it("calls login with email and password", async () => {
    setupAuthMock();
    render(<AuthModal />);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    await userEvent.type(emailInput, "a@b.com");
    await userEvent.type(passwordInput, "pw");
    await userEvent.click(screen.getByRole("button" , {name: "Login"}));
    expect(mockLogin).toHaveBeenCalledWith("a@b.com", "pw");
    expect(mockLogin).toHaveBeenCalledWith("a@b.com", "pw");
  });
  it("calls signup with email, password, and username", async () => {
    setupAuthMock();
    render(<AuthModal />);
    await userEvent.click(screen.getByText("Register"));
    await userEvent.type(screen.getByLabelText("Email"), "a@b.com");
    await userEvent.type(screen.getByLabelText("Password"), "pw");
    await userEvent.type(screen.getByLabelText("Username"), "user1");
    await userEvent.click(screen.getByRole("button" , {name: "Register"}));
    expect(mockSignup).toHaveBeenCalledWith("a@b.com", "pw", "user1");
  });

  it("calls signup with random username if username is empty", async () => {
    setupAuthMock();
    render(<AuthModal />);
    // Switch to register mode
    await userEvent.click(screen.getByRole("button", { name: "Register" }));
    // Now the username field should be present
    await userEvent.type(screen.getByLabelText("Email"), "a@b.com");
    await userEvent.type(screen.getByLabelText("Password"), "pw");

    await userEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(mockSignup).toHaveBeenCalledWith("a@b.com", "pw", "Brave Lion");
  });

  it("disables button when authLoading is true", () => {
    setupAuthMock({ authLoading: true });
    const { getByRole } = render(<AuthModal />);
    expect(getByRole("button", { name: "Loading..." })).toBeDisabled();
  });

  it("calls setShowAuthModal on dialog close", () => {
    setupAuthMock();
    render(<AuthModal />);
    // Simulate dialog close by calling onOpenChange
    // Find DialogContent's parent Dialog and trigger onOpenChange
    // Since we can't access Dialog directly, simulate Escape key
    const escapeEvent = new KeyboardEvent("keydown", { key: "Escape", code: "Escape" });
    document.dispatchEvent(escapeEvent);
    // Check if setShowAuthModal was called
    expect(mockSetShowAuthModal).toHaveBeenCalled();
  });

});

describe("AuthError", () => {
  it("renders error message when authError is present", () => {
    (useAuth as Mock).mockReturnValue({ authError: "Invalid credentials" });
    const { getByText } = render(<AuthError />);
    expect(getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("renders nothing when authError is empty", () => {
    (useAuth as Mock).mockReturnValue({ authError: "" });
    const { container } = render(<AuthError />);
    expect(container).toBeEmptyDOMElement();
  });
  
  it("renders error message when authError is a network error", () => {
    (useAuth as Mock).mockReturnValue({ authError: "Network error" });
    const { getByText } = render(<AuthError />);
    expect(getByText("Network error")).toBeInTheDocument();
  });
});