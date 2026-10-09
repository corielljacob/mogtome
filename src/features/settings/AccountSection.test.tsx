import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@/shared/test/test-utils";
import userEvent from "@testing-library/user-event";
import { useAuth } from "@/shared/contexts/AuthContext";
import { AccountSection } from "./AccountSection";

vi.mock("@/shared/contexts/AuthContext", () => ({ useAuth: vi.fn() }));

const member = {
  memberName: "Ada Bloom",
  memberRank: "Moogle Knight",
  memberPortraitUrl: "https://example.com/ada.jpg",
  discordId: "123",
  hasKnighthood: true,
  hasTemporaryKnighthood: false,
};

function authState(overrides: Partial<ReturnType<typeof useAuth>> = {}) {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("Account settings", () => {
  beforeEach(() => vi.mocked(useAuth).mockReset());

  it("shows a loading status without offering auth actions", () => {
    vi.mocked(useAuth).mockReturnValue(authState({ isLoading: true }));
    render(<AccountSection />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Checking your sign-in…",
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("offers Discord sign-in directly when signed out", async () => {
    const auth = authState();
    vi.mocked(useAuth).mockReturnValue(auth);
    const user = userEvent.setup();
    render(<AccountSection />);
    expect(
      screen.getByRole("heading", { name: "Signed out" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "View my profile" }),
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Sign in with Discord" }),
    );
    expect(auth.login).toHaveBeenCalledOnce();
    expect(auth.logout).not.toHaveBeenCalled();
  });

  it("shows the member's identity, profile link, and an explicit sign-out action", async () => {
    const auth = authState({ user: member, isAuthenticated: true });
    vi.mocked(useAuth).mockReturnValue(auth);
    const user = userEvent.setup();
    render(<AccountSection />);
    expect(
      screen.getByRole("heading", { name: member.memberName }),
    ).toBeInTheDocument();
    expect(screen.getByText(member.memberRank)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View my profile" }),
    ).toHaveAttribute("href", "/profile");
    expect(
      screen.queryByRole("button", { name: "Sign in with Discord" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    expect(auth.logout).toHaveBeenCalledOnce();
    expect(auth.login).not.toHaveBeenCalled();
  });

  it("moves focus to sign-in after an explicit sign-out removes the focused button", async () => {
    const auth = authState({ user: member, isAuthenticated: true });
    vi.mocked(useAuth).mockReturnValue(auth);
    const user = userEvent.setup();
    const { rerender } = render(<AccountSection />);
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    expect(auth.logout).toHaveBeenCalledOnce();
    vi.mocked(useAuth).mockReturnValue({
      ...auth,
      user: null,
      isAuthenticated: false,
    });
    rerender(<AccountSection />);
    expect(
      screen.getByRole("button", { name: "Sign in with Discord" }),
    ).toHaveFocus();
    expect(auth.login).not.toHaveBeenCalled();
  });

  it("does not request sign-in focus when authentication changes without a sign-out action", () => {
    const auth = authState({ user: member, isAuthenticated: true });
    vi.mocked(useAuth).mockReturnValue(auth);
    const { rerender } = render(<AccountSection />);
    screen.getByRole("button", { name: "Sign out" }).focus();
    vi.mocked(useAuth).mockReturnValue({
      ...auth,
      user: null,
      isAuthenticated: false,
    });
    rerender(<AccountSection />);
    expect(
      screen.getByRole("button", { name: "Sign in with Discord" }),
    ).not.toHaveFocus();
    expect(auth.logout).not.toHaveBeenCalled();
  });

  it("replaces a broken portrait and retries when the member's portrait URL changes", () => {
    const auth = authState({ user: member, isAuthenticated: true });
    vi.mocked(useAuth).mockReturnValue(auth);
    const { container, rerender } = render(<AccountSection />);
    const portrait = container.querySelector("img");
    expect(portrait).toHaveAttribute("src", member.memberPortraitUrl);
    fireEvent.error(portrait!);
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: member.memberName }),
    ).toBeInTheDocument();
    vi.mocked(useAuth).mockReturnValue({
      ...auth,
      user: { ...member, memberPortraitUrl: "https://example.com/updated.jpg" },
    });
    rerender(<AccountSection />);
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://example.com/updated.jpg",
    );
  });

  it("keeps account actions available when no portrait or rank was supplied", () => {
    vi.mocked(useAuth).mockReturnValue(
      authState({
        user: { ...member, memberPortraitUrl: "", memberRank: "" },
        isAuthenticated: true,
      }),
    );
    const { container } = render(<AccountSection />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: member.memberName }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeEnabled();
    expect(
      screen.getByRole("link", { name: "View my profile" }),
    ).toBeInTheDocument();
  });
});
