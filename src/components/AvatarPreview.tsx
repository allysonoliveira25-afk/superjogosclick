import type { AvatarConfig } from "@/lib/types";

export default function AvatarPreview({
  avatar,
  className = "h-full w-full",
}: {
  avatar: AvatarConfig;
  className?: string;
}) {
  const { skin, hair, hairColor, outfit, accessory, bg } = avatar;

  return (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="50" fill={bg} />

      {/* shoulders / outfit */}
      <path d="M14 100c2-16 15-26 36-26s34 10 36 26z" fill={outfit} />

      {/* neck */}
      <rect x="43" y="55" width="14" height="12" fill={skin} />

      {/* head */}
      <circle cx="50" cy="42" r="24" fill={skin} />

      {/* hair (back layer, behind for "long") */}
      {hair === "long" && (
        <path
          d="M24 40c-2 16 2 28 8 32 -4-10-4-22 0-30z M76 40c2 16-2 28-8 32 4-10 4-22 0-30z"
          fill={hairColor}
        />
      )}

      {/* eyes */}
      <circle cx="41" cy="43" r="2.6" fill="#241b3d" />
      <circle cx="59" cy="43" r="2.6" fill="#241b3d" />

      {/* mouth */}
      <path
        d="M42 53c3 4 13 4 16 0"
        fill="none"
        stroke="#241b3d"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* cheeks */}
      <circle cx="34" cy="50" r="3.2" fill="#ff9db5" opacity="0.6" />
      <circle cx="66" cy="50" r="3.2" fill="#ff9db5" opacity="0.6" />

      {/* hair (front layer) */}
      {hair === "short" && (
        <path d="M24 34a26 26 0 0 1 52 0c-6-5-14-8-26-8s-20 3-26 8z" fill={hairColor} />
      )}
      {hair === "long" && (
        <path d="M22 36a28 28 0 0 1 56 0c-7-6-16-10-28-10s-21 4-28 10z" fill={hairColor} />
      )}
      {hair === "mohawk" && (
        <>
          <path d="M24 30a26 26 0 0 1 52 0c-14-5-38-5-52 0z" fill={skin} opacity="0" />
          <path
            d="M50 10c3 6 5 12 5 18h-10c0-6 2-12 5-18z"
            fill={hairColor}
          />
        </>
      )}

      {/* accessories */}
      {accessory === "glasses" && (
        <g stroke="#241b3d" strokeWidth="2.2" fill="none">
          <circle cx="41" cy="43" r="7" />
          <circle cx="59" cy="43" r="7" />
          <line x1="48" y1="43" x2="52" y2="43" />
        </g>
      )}
      {accessory === "cap" && (
        <path
          d="M22 32a28 28 0 0 1 56 0h-4c-2-9-13-16-24-16s-22 7-24 16z"
          fill={outfit}
        />
      )}
      {accessory === "star" && (
        <polygon
          points="76,20 78,26 84,26 79,30 81,36 76,32 71,36 73,30 68,26 74,26"
          fill="#ffce29"
        />
      )}
    </svg>
  );
}
