import { SYSTEM_ICONS } from '@/lib/system-icons';

/** Light brand colours (Mailchimp's yellow) get a dark logo on a tile of that colour; the rest are drawn in their colour on white. */
const isLight = (hex) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.6;
};

/** Integration logo: an uploaded one, else the system's icon (lib/system-icons.js), else a monogram tile. */
export default function Mark({ name, logo, slug, large }) {
  const icon = !logo && slug ? SYSTEM_ICONS[slug] : null;
  if (icon) {
    const light = isLight(icon.hex);
    return (
      <span className={`mark icon${large ? ' large' : ''}`} aria-hidden="true" style={light ? { background: `#${icon.hex}` } : undefined}>
        <svg viewBox="0 0 24 24" fill={light ? '#15171a' : `#${icon.hex}`} focusable="false">
          <path d={icon.path} />
        </svg>
      </span>
    );
  }
  const initials = (name || '?')
    .replace(/\(.*?\)/g, '')
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <span className={`mark${large ? ' large' : ''}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {logo ? <img src={logo} alt="" /> : initials}
    </span>
  );
}
