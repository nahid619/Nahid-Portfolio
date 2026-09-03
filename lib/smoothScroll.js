// lib/smoothScroll.js
//
// JS-driven smooth scrolling. We do this in JS rather than with
// `html { scroll-behavior: smooth }` so the duration and easing curve are
// under our control (globals.css deliberately sets scroll-behavior: auto).
//
// smoothScrollTo(targetY, duration, onDone)
//   targetY  — absolute document Y position to land on
//   duration — ms, default 800
//   onDone   — optional callback fired once the animation settles.
//              NavBar uses this to know when a programmatic scroll has
//              finished, so its IntersectionObserver can stop fighting it.
export function smoothScrollTo(targetY, duration = 800, onDone) {
  // Clamp into the scrollable range so callbacks still fire when the caller
  // asks for a position past the end of the document (e.g. the last section).
  const maxY = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const destY  = Math.min(Math.max(0, targetY), maxY);
  const startY = window.scrollY;
  const diff   = destY - startY;

  // Already there — don't burn a frame, just resolve.
  if (Math.abs(diff) < 1) {
    onDone?.();
    return;
  }

  let start = null;

  function step(timestamp) {
    // `start === null` rather than `!start`: a timestamp of 0 is legal and
    // would have been treated as "not started" by a falsy check.
    if (start === null) start = timestamp;

    const progress = Math.min((timestamp - start) / duration, 1);

    // easeInOutCubic
    const ease = progress < 0.5
      ? 4 * progress ** 3
      : 1 - (-2 * progress + 2) ** 3 / 2;

    window.scrollTo(0, startY + diff * ease);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      window.scrollTo(0, destY); // guarantee an exact landing
      onDone?.();
    }
  }

  requestAnimationFrame(step);
}