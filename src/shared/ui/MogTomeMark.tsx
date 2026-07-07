interface MogTomeMarkProps {
  className?: string;
}

// A small moogle keeping its place in a well-loved book.
export function MogTomeMark({ className = "" }: MogTomeMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="#705951"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M22 44C16 44 11 39 9 34C5 39 4 45 4 51C8 47 12 47 15 51C17 47 20 48 23 50Z"
          fill="#837087"
        />
        <path
          d="M58 43C65 43 70 39 73 35C76 40 77 46 76 52C71 48 68 48 65 51C63 47 59 48 57 50Z"
          fill="#837087"
        />
        <path
          d="M10 36C11 42 16 46 21 47M72 37C68 44 63 46 59 47"
          stroke="#b3a0b4"
          strokeWidth=".9"
        />
        <path
          d="M24 36C20 32 19 26 20 21C26 22 30 26 33 31M47 31C51 26 57 24 61 25C61 31 59 35 56 38"
          fill="#fff8e8"
        />
        <path
          d="M23 26L25 34L30 31ZM56 29L50 33L56 36Z"
          fill="#deb4bb"
          stroke="none"
        />
        <path d="M39 30C37 25 39 21 43 18" stroke="#665057" strokeWidth="1.8" />
        <path
          d="M38 28C24 28 17 36 17 45C16 50 19 55 24 58C30 62 44 63 53 58C60 55 64 48 62 41C60 32 50 27 38 28Z"
          fill="#fff8e8"
        />
        <path
          d="M55 35C63 47 55 57 43 59C52 61 62 54 62 45C62 41 59 37 55 35Z"
          fill="#e8daca"
          stroke="none"
        />
        <path d="M25 38C28 33 32 32 36 32" stroke="#fffef6" strokeWidth="2.1" />
        <path
          d="M25 43Q30 47 34 44M47 44Q52 46 56 42"
          stroke="#6d575a"
          strokeWidth="1.8"
        />
        <ellipse
          cx="41"
          cy="48"
          rx="5"
          ry="3.7"
          fill="#dca1ae"
          stroke="#b68194"
          strokeWidth=".8"
        />
        <path d="M39 46L41 45.8" stroke="#f6d7dc" strokeWidth="1.3" />
        <path d="M39 54Q42 56 44 53" strokeWidth="1" />
        <circle
          cx="47"
          cy="12"
          r="9.3"
          fill="#e9c264"
          stroke="#b58d48"
          strokeWidth="1.3"
        />
        <path d="M41 10C42 7 44 6 47 6" stroke="#fff0b7" strokeWidth="2" />
        <path
          d="M10 56C20 53 31 55 40 62C50 55 61 53 71 56L71 70C59 69 49 72 40 77C30 72 20 70 9 71Z"
          fill="#9b9f7c"
        />
        <path
          d="M13 53C25 51 34 56 40 61C48 54 58 52 68 54L68 67C57 66 48 69 40 74C32 69 23 66 13 68Z"
          fill="#f6ebd3"
        />
        <path
          d="M40 61V74M17 64C25 63 31 66 35 68M45 68C51 64 57 62 64 63"
          stroke="#bda689"
          strokeWidth="1"
        />
        <path
          d="M48 58L52 57L53 68L50 66L48 69Z"
          fill="#c78d8f"
          stroke="none"
        />
        <path
          d="M26 54C23 52 19 53 19 56C19 59 23 61 26 60C29 59 29 56 26 54Z"
          fill="#fff8e8"
          strokeWidth="1.2"
        />
        <path
          d="M57 54C54 53 51 54 51 57C51 60 56 60 59 58C61 56 59 54 57 54Z"
          fill="#fff8e8"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
}
