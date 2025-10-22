/**
 * Generate SVG badge images for course completion NFTs
 */

export interface BadgeImageOptions {
  emoji: string;
  courseName: string;
  courseId: number;
  size?: number;
}

/**
 * Generate an SVG badge image
 */
export function generateBadgeSVG(options: BadgeImageOptions): string {
  const { emoji, courseName, courseId, size = 500 } = options;

  // Create gradient colors based on course ID for variety
  const gradients = [
    { from: "#667eea", to: "#764ba2" }, // Purple
    { from: "#f093fb", to: "#f5576c" }, // Pink
    { from: "#4facfe", to: "#00f2fe" }, // Blue
    { from: "#43e97b", to: "#38f9d7" }, // Green
    { from: "#fa709a", to: "#fee140" }, // Orange
    { from: "#30cfd0", to: "#330867" }, // Teal
    { from: "#a8edea", to: "#fed6e3" }, // Pastel
    { from: "#ff9a9e", to: "#fecfef" }, // Rose
    { from: "#ffecd2", to: "#fcb69f" }, // Peach
    { from: "#ff6e7f", to: "#bfe9ff" }, // Coral
  ];

  const gradient = gradients[courseId % gradients.length];

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${gradient.from};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${gradient.to};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="500" height="500" fill="url(#bgGradient)" rx="40"/>

  <!-- Badge Circle Background -->
  <circle cx="250" cy="200" r="120" fill="white" opacity="0.95" filter="url(#shadow)"/>

  <!-- Emoji -->
  <text x="250" y="240" font-size="100" text-anchor="middle" font-family="Arial, sans-serif">${emoji}</text>

  <!-- Course Name -->
  <text x="250" y="340" font-size="28" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif" filter="url(#shadow)">
    ${truncateText(courseName, 20)}
  </text>

  <!-- Badge Label -->
  <text x="250" y="380" font-size="18" text-anchor="middle" fill="white" opacity="0.9" font-family="Arial, sans-serif">
    Completion Badge
  </text>

  <!-- Platform Logo/Text -->
  <text x="250" y="450" font-size="16" text-anchor="middle" fill="white" opacity="0.8" font-family="Arial, sans-serif" font-weight="600">
    SynauLearn
  </text>

  <!-- Decorative Stars -->
  <text x="100" y="100" font-size="30" opacity="0.6">✨</text>
  <text x="400" y="120" font-size="25" opacity="0.5">⭐</text>
  <text x="80" y="420" font-size="25" opacity="0.5">🎯</text>
  <text x="420" y="400" font-size="30" opacity="0.6">🏆</text>
</svg>`;

  return svg;
}

/**
 * Truncate text to max length
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Convert SVG string to Blob
 */
export function svgToBlob(svg: string): Blob {
  return new Blob([svg], { type: "image/svg+xml" });
}

/**
 * Generate a badge image as a Blob
 */
export function generateBadgeImage(options: BadgeImageOptions): Blob {
  const svg = generateBadgeSVG(options);
  return svgToBlob(svg);
}

/**
 * Generate a File object from badge image (for upload)
 */
export function generateBadgeFile(
  options: BadgeImageOptions,
  filename?: string
): File {
  const blob = generateBadgeImage(options);
  const name = filename || `badge-${options.courseId}.svg`;
  return new File([blob], name, { type: "image/svg+xml" });
}
