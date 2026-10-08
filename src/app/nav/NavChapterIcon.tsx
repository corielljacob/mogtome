import type { ReactNode } from "react";

/* Small storybook doodles, drawn for the chapter tabs rather than utility buttons.
   Keep the character in the silhouettes so they still read at twenty pixels. */
const drawings = {
  home: (
    <>
      <path
        className="nav-doodle-fill"
        d="M5.3 11.2 4.8 20q7.1 1.2 14.2-.2l-.3-8.2"
      />
      <path
        className="nav-doodle-fill"
        d="M2.8 11.7Q6.5 7.1 11.6 4.8q5.7 2.7 9.7 7.4-4.7.8-9.4.2-4.7.5-9.1-.7Z"
      />
      <path d="M15.9 7.3q1.8-1.6 1.2-3.1M9.1 20.4v-4a2.4 2.4 0 0 1 4.8 0v4" />
      <circle className="nav-doodle-fill" cx="17" cy="2.8" r="1.6" />
      <path d="m16.1 15.7.1 1.1M2.8 21.2q1.4-2.1 2.8-.5" />
    </>
  ),
  members: (
    <>
      <path
        className="nav-doodle-fill"
        d="m13.4 9.7-.3-3.9q3.2.4 4.1 2.5l3.1-1.9.3 4q2 1.5 1.8 4-.3 3.9-5.1 4.3"
      />
      <path d="M18.2 8q1.7-1.5.8-3.2" />
      <circle className="nav-doodle-fill" cx="18.5" cy="3.4" r="1.5" />
      <path
        className="nav-doodle-fill"
        d="m4.8 12.2-1.1-4q3.2.4 4.5 2.9 2.6-.6 4.4.2l3.2-3 .1 4.5q2.7 2.1 1.9 5.4-1 3.4-7.4 3.2-6.1.2-7.3-3.4-.8-3.2 1.7-5.8Z"
      />
      <path d="M9.7 10.7Q8.3 8.8 9.1 7" />
      <circle className="nav-doodle-fill" cx="9.4" cy="5.5" r="1.8" />
    </>
  ),
  chronicle: (
    <>
      <path
        className="nav-doodle-fill"
        d="M11.8 8.7Q7 6.1 2.8 8l.8 12.2q4.1-1.6 8.5.7 4.2-2.4 8.5-1l.7-10.2"
      />
      <path d="m11.8 8.7.3 12.2M6 12.1q1.6-.2 3.2.6M6.2 15.6q1.5 0 3 .6" />
      <path
        className="nav-doodle-fill"
        d="M12 8.8q2.4-3.7 6.8-4.1l-1.2 8.4q-3.2.9-5.5 5.2m5.5-5.2 3.7-3.4"
      />
      <path d="M21.5 2.2v3.4m-1.7-1.7h3.4" strokeWidth="1.2" />
    </>
  ),
  about: (
    <>
      <path
        className="nav-doodle-fill"
        d="M5.5 12.2Q1.8 8.5 1 11q-.6 2.2 3.1 3.1-2.9-.6-2.1 1.5.9 2.1 4.9 2.4m11.6-5.8q3.7-3.7 4.5-1.2.6 2.2-3.1 3.1 2.9-.6 2.1 1.5-.9 2.1-4.9 2.4"
      />
      <path
        className="nav-doodle-fill"
        d="M12 9.2C8.5 3.8 4.4 7.2 5.1 11.4c.7 3.7 3.3 5.9 7.1 9.1 3.7-3.2 6.3-5.6 6.7-9.3.5-4.4-4.1-7.2-6.9-2Z"
      />
    </>
  ),
  dashboard: (
    <>
      <path
        className="nav-doodle-fill"
        d="m4.9 17.5-2-9 5.2 3.3 3.2-6.6 4.4 6.1 5.1-4.5-1 10q-7.7 1.8-14.9.7Z"
      />
      <path d="m4.9 17.5.5 3q7.3 1 14-1.1l.4-2.6" />
      <circle className="nav-doodle-fill" cx="11.3" cy="3.6" r="1.6" />
      <path d="m12 13.6 1.4 1.5-1.2 1.5-1.4-1.4Z" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type NavChapterIconName = keyof typeof drawings;

export function NavChapterIcon({ name }: { name: NavChapterIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-nav-doodle={name}
    >
      {drawings[name]}
    </svg>
  );
}
