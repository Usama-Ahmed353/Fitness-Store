/**
 * Accessibility Utilities
 * - Focus management
 * - ARIA helpers
 * - Keyboard navigation
 */

/**
 * Focus Trap - Trap focus within a specific element
 * Useful for modals, dialogs, and dropdowns
 */
export const useFocusTrap = (containerRef) => {
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    const element = containerRef.current;
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  const container = containerRef.current;
  if (container) {
    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }
};

/**
 * Announce to screen readers (ARIA live region)
 * Useful for dynamic content updates
 */
export const announceToScreenReader = (message, politeness = 'polite') => {
  const ariaLiveDiv = document.getElementById('aria-live');
  if (ariaLiveDiv) {
    ariaLiveDiv.setAttribute('aria-live', politeness);
    ariaLiveDiv.setAttribute('aria-atomic', 'true');
    ariaLiveDiv.textContent = message;
  }
};

/**
 * Focus on element with scroll into view
 */
export const focusElement = (element, alignToTop = true) => {
  if (element) {
    element.focus({ preventScroll: true });
    element.scrollIntoView({ behavior: 'smooth', block: alignToTop ? 'start' : 'center' });
  }
};

/**
 * Check if element is visible in viewport
 */
export const isElementInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
};

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container = document) => {
  const selector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll(selector));
};

export default {
  useFocusTrap,
  announceToScreenReader,
  focusElement,
  isElementInViewport,
  getFocusableElements,
};
