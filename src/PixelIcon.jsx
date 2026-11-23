// Pixel-art icons from pixelarticons (MIT, https://pixelarticons.com).
// Only the icons the site uses are imported. Color comes from the parent (currentColor).
import lock from "pixelarticons/svg/lock.svg?raw";
import article from "pixelarticons/svg/article.svg?raw";
import chart from "pixelarticons/svg/chart.svg?raw";
import lightbulb from "pixelarticons/svg/lightbulb.svg?raw";
import sun from "pixelarticons/svg/sun.svg?raw";
import trophy from "pixelarticons/svg/trophy.svg?raw";
import bookOpen from "pixelarticons/svg/book-open.svg?raw";
import users from "pixelarticons/svg/users.svg?raw";
import bullseye from "pixelarticons/svg/bullseye.svg?raw";
import monitor from "pixelarticons/svg/monitor.svg?raw";

const ICONS = {
  "lock": lock,
  "article": article,
  "chart": chart,
  "lightbulb": lightbulb,
  "sun": sun,
  "trophy": trophy,
  "book-open": bookOpen,
  "users": users,
  "bullseye": bullseye,
  "monitor": monitor,
};

const inner = (svg) => svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

export default function PixelIcon({ name, size = 24, color = "#00ff41", style = {} }) {
  const svg = ICONS[name];
  if (!svg) return null;
  return (
    <svg
      viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor"
      shapeRendering="crispEdges"
      style={{ color, display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: inner(svg) }}
    />
  );
}
