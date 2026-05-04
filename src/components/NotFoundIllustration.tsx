// NotFoundIllustration.jsx - SVG illustration for Not Found page
// Source: Tabler Illustrations (https://tabler.io/illustrations)

const NotFoundIllustration = (props) => (
  <svg width="180" height="180" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="256" height="256" rx="24" fill="#232B41"/>
    <g>
      <rect x="60" y="48" width="136" height="48" rx="8" fill="#232B41" stroke="#3B4252" strokeWidth="2"/>
      <text x="80" y="78" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="20" fill="#339CFF">NOT</text>
      <text x="130" y="78" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="20" fill="#fff">FOUND</text>
      <rect x="40" y="120" width="32" height="48" rx="8" fill="#339CFF"/>
      <rect x="184" y="120" width="32" height="48" rx="8" fill="#fff"/>
      <rect x="120" y="120" width="16" height="48" rx="8" fill="#3B4252"/>
      <rect x="104" y="120" width="8" height="32" rx="4" fill="#fff"/>
      <rect x="144" y="120" width="8" height="32" rx="4" fill="#339CFF"/>
      <rect x="120" y="168" width="16" height="8" rx="4" fill="#fff"/>
      <rect x="120" y="184" width="16" height="8" rx="4" fill="#339CFF"/>
      <circle cx="56" cy="176" r="8" fill="#fff"/>
      <circle cx="200" cy="176" r="8" fill="#339CFF"/>
      <rect x="48" y="184" width="32" height="8" rx="4" fill="#3B4252"/>
      <rect x="176" y="184" width="32" height="8" rx="4" fill="#3B4252"/>
    </g>
    <text x="128" y="230" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="20" fill="#fff">Not Found</text>
  </svg>
);

export default NotFoundIllustration;
