/* ═══════════════════════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════════════════════ */
const sp = {
    width: 14,
    height: 14,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
} as const;

export const Icons = {
    Edit: () => (
        <svg {...sp}>
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
        </svg>
    ),
    Undo: () => (
        <svg {...sp}>
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
    ),
    Redo: () => (
        <svg {...sp}>
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
        </svg>
    ),
    Check: () => (
        <svg {...sp}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    X: () => (
        <svg {...sp}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    ),
    Sparkles: () => (
        <svg {...sp}>
            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
        </svg>
    ),
    Play: () => (
        <svg {...sp}>
            <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
    ),
    Pause: () => (
        <svg {...sp}>
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
        </svg>
    ),
    MoreVert: () => (
        <svg {...sp}>
            <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
            <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
        </svg>
    ),
    ArrowUp: () => (
        <svg {...sp}>
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
        </svg>
    ),
    ArrowDown: () => (
        <svg {...sp}>
            <path d="m19 12-7 7-7-7" />
            <path d="M12 5v14" />
        </svg>
    ),
    Loader: () => (
        <svg {...sp} className="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    ),
    Download: () => (
        <svg {...sp}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    ),
    ExtLink: () => (
        <svg {...sp}>
            <path d="M15 3h6v6" />
            <path d="M10 14 21 3" />
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </svg>
    ),
};
