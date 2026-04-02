import { useRef } from 'react';
import { focusElement } from '../../utils/accessibility';

/**
 * SkipToMainContent - Accessibility component
 * Provides a skip link for keyboard users to bypass navigation
 * Only visible when focused (keyboard navigation)
 */
export const SkipToMainContent = ({ mainId = 'main-content' }) => {
  const skipLinkRef = useRef(null);

  const handleClick = () => {
    const mainElement = document.getElementById(mainId);
    if (mainElement) {
      focusElement(mainElement);
    }
  };

  return (
    <a
      ref={skipLinkRef}
      href={`#${mainId}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only fixed top-0 left-0 z-[9999] px-4 py-2 bg-accent text-white font-semibold transition-transform"
    >
      Skip to main content
    </a>
  );
};

export default SkipToMainContent;
