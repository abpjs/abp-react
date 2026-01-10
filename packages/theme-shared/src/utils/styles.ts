/**
 * Global CSS styles for theme.shared components.
 * Translated from @abp/ng.theme.shared/lib/contants/styles.ts
 *
 * These are additional ABP-specific styles that complement Chakra UI.
 * Most styling is handled by Chakra UI's style system.
 */
export const THEME_SHARED_STYLES = `
/* Form validation styling */
.is-invalid {
  border-color: var(--chakra-colors-red-500) !important;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: var(--chakra-space-1);
  font-size: var(--chakra-fontSizes-sm);
  color: var(--chakra-colors-red-500);
}

/* Pointer cursor utility */
.pointer {
  cursor: pointer;
}

/* Fade animations */
@keyframes fadeInTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutTop {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.fade-in-top {
  animation: fadeInTop 0.3s ease-out forwards;
}

.fade-out-top {
  animation: fadeOutTop 0.3s ease-out forwards;
}
`;

/**
 * Injects the ABP theme shared styles into the document head.
 * This is optional since Chakra UI provides most styling.
 * Only use this if you need ABP-specific utility classes.
 */
export function injectThemeSharedStyles(): (() => void) | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const styleId = 'abp-theme-shared-styles';

  // Check if already injected
  if (document.getElementById(styleId)) {
    return undefined;
  }

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = THEME_SHARED_STYLES;
  document.head.appendChild(styleElement);

  // Return cleanup function
  return () => {
    const element = document.getElementById(styleId);
    if (element) {
      element.remove();
    }
  };
}
