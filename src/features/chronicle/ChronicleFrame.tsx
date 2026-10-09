import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { ChronicleIcon } from "./ChronicleIcons";
import { ChronicleLetterArt } from "./ChronicleLetterArt";
import { scrollAppToTop } from "@/shared/lib/scroll";
import "./chronicle-screen.css";

export function ChronicleFrame({ children }: { children: ReactNode }) {
  const { isDarkMode } = useTheme();
  return (
    <div className="chronicle-screen" data-mode={isDarkMode ? "dark" : "light"}>
      <div className="chronicle-content">
        <header className="chronicle-cover">
          <div>
            <h1>
              The Chronicle <ChronicleIcon name="heart" />
            </h1>
            <p className="chronicle-description">
              Catch up on announcements and activity from Kupo Life.
            </p>
          </div>
          <div className="chronicle-cover-art">
            <ChronicleLetterArt />
          </div>
        </header>
        {children}
        <footer className="chronicle-footer">
          <Link to="/">
            <ChronicleIcon name="arrow-left" size={17} /> Back home
          </Link>
          <button onClick={scrollAppToTop}>
            Back to top <ChronicleIcon name="up" size={17} />
          </button>
        </footer>
      </div>
    </div>
  );
}
