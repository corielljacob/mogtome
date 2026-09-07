import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@/shared/test/test-utils";
import type { StaffMember } from "@/shared/types";
import { StaffCard } from "./StaffCard";

const member: StaffMember = {
  name: "Althia Fern",
  characterId: "12345",
  freeCompanyRank: "Moogle Guardian",
  freeCompanyRankIcon: "https://example.com/rank.png",
  activeMember: true,
  lastUpdatedDate: "2026-09-29",
  avatarLink: "https://example.com/avatar.png",
  biography: "Hello, <kupo> & everyone.\nI like maps.",
};

describe("StaffCard", () => {
  it("shows the full rank and biography alongside a clearly named Lodestone link", () => {
    render(<StaffCard member={member} />);
    expect(
      screen.getByRole("heading", { level: 4, name: member.name }),
    ).toBeInTheDocument();
    expect(screen.getByText("Moogle Guardian")).toBeInTheDocument();
    const biography = screen.getByRole("region", {
      name: "Althia Fern's biography",
    });
    expect(biography.querySelector("p")?.textContent).toBe(member.biography);
    expect(biography.querySelector("kupo")).not.toBeInTheDocument();
    const link = screen.getByRole("link", {
      name: "View Lodestone profile for Althia Fern (opens in new tab)",
    });
    expect(link).toHaveAttribute(
      "href",
      "https://na.finalfantasyxiv.com/lodestone/character/12345",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent("View Lodestone");
  });

  it("replaces a broken portrait with initials while retaining the profile link", () => {
    const { container } = render(<StaffCard member={member} />);
    const image = container.querySelector("img")!;
    expect(image).toHaveAttribute("src", member.avatarLink);
    fireEvent.error(image);
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByText("AF")).toBeInTheDocument();
    expect(screen.getByText("No portrait")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://na.finalfantasyxiv.com/lodestone/character/12345",
    );
  });

  it("tries a replacement portrait after the previous URL failed", () => {
    const { container, rerender } = render(<StaffCard member={member} />);
    fireEvent.error(container.querySelector("img")!);
    rerender(
      <StaffCard
        member={{
          ...member,
          avatarLink: "https://example.com/replacement.png",
        }}
      />,
    );
    const replacement = container.querySelector("img")!;
    expect(replacement).toHaveAttribute(
      "src",
      "https://example.com/replacement.png",
    );
    fireEvent.load(replacement);
    expect(screen.queryByText("AF")).not.toBeInTheDocument();
    expect(screen.queryByText("No portrait")).not.toBeInTheDocument();
  });

  it("does not request an empty portrait URL", () => {
    const { container } = render(
      <StaffCard member={{ ...member, avatarLink: "" }} />,
    );
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByText("AF")).toBeInTheDocument();
  });

  it.each([
    { isLeader: true, isCurrentUser: true, isOwnEditable: false },
    { isLeader: false, isCurrentUser: true, isOwnEditable: true },
    { isLeader: true, isCurrentUser: false, isOwnEditable: false },
    { isLeader: false, isCurrentUser: false, isOwnEditable: true },
  ])(
    "forwards the supplied biography permission without inferring it from identity flags: %j",
    (flags) => {
      render(<StaffCard member={member} {...flags} />);
      const editButton = screen.queryByRole("button", { name: "Edit my bio" });
      if (flags.isOwnEditable) expect(editButton).toBeInTheDocument();
      else expect(editButton).not.toBeInTheDocument();
    },
  );

  it("retains leader, promotion, and current-user context", () => {
    render(
      <StaffCard
        member={{ ...member, recentlyPromoted: true }}
        isLeader
        isCurrentUser
      />,
    );
    expect(screen.getByText("FC leader")).toBeInTheDocument();
    expect(screen.getByText("Recently promoted")).toBeInTheDocument();
    expect(screen.getByText("That’s you")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Edit my bio" }),
    ).not.toBeInTheDocument();
  });
});
