/**
 * AriaLiveRegion - Screen reader announcement component
 * Use this to announce dynamic content updates to screen readers
 * 
 * Usage:
 * <AriaLiveRegion />
 * Then use announceToScreenReader() to trigger announcements
 */
export const AriaLiveRegion = () => {
  return (
    <div
      id="aria-live"
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    />
  );
};

export default AriaLiveRegion;
