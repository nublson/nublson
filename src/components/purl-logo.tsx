import type { SVGProps } from "react";

/**
 * Purl's pearl (from purl.live's favicon). The hairline uses the site's image
 * outline token so the white pearl stays visible on the light background.
 */
export function PurlLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <g clipPath="url(#purl-clip)">
        <circle cx="16" cy="16" r="16" fill="url(#purl-grad)" />
      </g>
      <circle
        cx="16"
        cy="16"
        r="15.25"
        strokeWidth="1.5"
        style={{ stroke: "var(--image-outline)" }}
      />
      <defs>
        <radialGradient
          id="purl-grad"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(6) scale(28.5 26.4348)"
        >
          <stop offset="0.457935" stopColor="white" />
          <stop offset="1" stopColor="#EAE0C8" />
        </radialGradient>
        <clipPath id="purl-clip">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
