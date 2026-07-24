import type { CategoryIconKey } from "@/lib/types";

interface Props {
  icon: CategoryIconKey;
  className?: string;
}

// Hand-drawn, license-free icon set (one glyph per category) built from
// plain SVG primitives so it never depends on an external icon library.
export default function CategoryIcon({ icon, className = "w-6 h-6" }: Props) {
  const common = { className, viewBox: "0 0 24 24" };

  switch (icon) {
    case "sword":
      return (
        <svg {...common} fill="currentColor">
          <g transform="rotate(45 12 12)">
            <rect x="10.8" y="2" width="2.4" height="12" rx="1.2" />
            <rect x="8.3" y="13.4" width="7.4" height="2.8" rx="1.4" />
            <rect x="10.8" y="16.2" width="2.4" height="4.3" rx="1.2" />
            <circle cx="12" cy="21.2" r="1.4" />
          </g>
        </svg>
      );
    case "compass":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.6}>
          <circle cx="12" cy="12" r="9" />
          <polygon points="13.2,7.5 15,12 12.8,16.5 11,12" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1" fill="var(--surface,#fff)" stroke="none" />
        </svg>
      );
    case "puzzle":
      return (
        <svg {...common} fill="currentColor">
          <path d="M4 4h5.2a2.1 2.1 0 0 1 4.1 0H18a1 1 0 0 1 1 1v4.7a2.1 2.1 0 0 1 0 4.1V18a1 1 0 0 1-1 1h-4.7a2.1 2.1 0 0 1-4.1 0H4a1 1 0 0 1-1-1v-4.7a2.1 2.1 0 0 1 0-4.1V5a1 1 0 0 1 1-1z" />
        </svg>
      );
    case "car":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 16l1.4-4.6A2 2 0 0 1 7.3 10h9.4a2 2 0 0 1 1.9 1.4L20 16" />
          <rect x="2.8" y="16" width="18.4" height="3.2" rx="1.6" />
          <circle cx="7.5" cy="19.6" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="19.6" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "ball":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="9" />
          <polygon points="12,8.2 14.4,10 13.5,12.8 10.5,12.8 9.6,10" fill="currentColor" stroke="none" />
          <path d="M12 3v5.2M6.2 8.5l3.4 1.5M17.8 8.5l-3.4 1.5M8.6 18l1.9-5.2M15.4 18l-1.9-5.2" />
        </svg>
      );
    case "target":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.6}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5.4" />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "chess":
      return (
        <svg {...common} fill="currentColor">
          <circle cx="12" cy="5.6" r="2.3" />
          <path d="M9.2 11.5h5.6l1.6 7.3H7.6z" />
          <rect x="6" y="19.4" width="12" height="2.3" rx="1.15" />
        </svg>
      );
    case "balloon":
      return (
        <svg {...common} fill="currentColor">
          <ellipse cx="12" cy="9.5" rx="6" ry="7" />
          <polygon points="10.3,16.2 13.7,16.2 12,18.4" />
          <path
            d="M12 18.4c1.6 1.4 1.6 3-.2 4.2"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
            strokeLinecap="round"
          />
        </svg>
      );
    case "brain":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round">
          <path d="M9.3 4.3a2.8 2.8 0 0 0-2.8 2.8 2.9 2.9 0 0 0-1 5.6A2.9 2.9 0 0 0 8.3 17h1v3h5.4v-3h1a2.9 2.9 0 0 0 2.8-4.3 2.9 2.9 0 0 0-1-5.6 2.8 2.8 0 0 0-2.8-2.8 2.8 2.8 0 0 0-2.7 1 2.8 2.8 0 0 0-2.7-1z" />
          <path d="M12 5.3V20" />
        </svg>
      );
    case "dice":
      return (
        <svg {...common} fill="currentColor" stroke="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="3.2" fill="none" strokeWidth={1.6} />
          <circle cx="8" cy="8" r="1.25" stroke="none" />
          <circle cx="16" cy="8" r="1.25" stroke="none" />
          <circle cx="12" cy="12" r="1.25" stroke="none" />
          <circle cx="8" cy="16" r="1.25" stroke="none" />
          <circle cx="16" cy="16" r="1.25" stroke="none" />
        </svg>
      );
    case "star":
      return (
        <svg {...common} fill="currentColor">
          <polygon points="12,2 14.8,9 22,9.5 16.4,14.2 18.2,21.3 12,17.3 5.8,21.3 7.6,14.2 2,9.5 9.2,9" />
        </svg>
      );
    case "controller":
    default:
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
          <rect x="2.6" y="8" width="18.8" height="9" rx="4.5" />
          <line x1="7" y1="10.4" x2="7" y2="14.6" />
          <line x1="4.9" y1="12.5" x2="9.1" y2="12.5" />
          <circle cx="16.2" cy="11.4" r="1" fill="currentColor" stroke="none" />
          <circle cx="18.6" cy="13.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
