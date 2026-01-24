/**
 * Default global styles for ABP theme shared components.
 * These styles can be injected into your app's global CSS or used with a style tag.
 *
 * @example
 * ```tsx
 * // Option 1: Use with a style tag in your app
 * import { DEFAULT_STYLES } from '@abpjs/theme-shared';
 *
 * function App() {
 *   return (
 *     <>
 *       <style>{DEFAULT_STYLES}</style>
 *       <YourApp />
 *     </>
 *   );
 * }
 *
 * // Option 2: Add to your global CSS file
 * // Copy the content of DEFAULT_STYLES to your styles.css
 * ```
 */
export const DEFAULT_STYLES = `
.is-invalid .form-control {
  border-color: #dc3545;
  border-style: solid !important;
}

.is-invalid .invalid-feedback,
.is-invalid + * .invalid-feedback {
  display: block;
}

.data-tables-filter {
  text-align: right;
}

.pointer {
  cursor: pointer;
}

.navbar .dropdown-submenu a::after {
  transform: rotate(-90deg);
  position: absolute;
  right: 16px;
  top: 18px;
}

.modal {
  background-color: rgba(0, 0, 0, .6);
}

.abp-ellipsis {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* <animations */

.fade-in-top {
  animation: fadeInTop 0.4s ease-in-out;
}

.fade-out-top {
  animation: fadeOutTop 0.4s ease-in-out;
}

@keyframes fadeInTop {
  from {
    transform: translateY(-5px);
    opacity: 0;
  }

  to {
    transform: translateY(5px);
    opacity: 1;
  }
}

@keyframes fadeOutTop {
  to {
    transform: translateY(-5px);
    opacity: 0;
  }
}

/* </animations */

/* Loader bar styles */
.abp-loader-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.abp-progress {
  height: 100%;
  background-color: #3182ce;
  transition: width 0.3s ease-out;
}
`;

export default DEFAULT_STYLES;
