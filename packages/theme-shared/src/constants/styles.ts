/**
 * Default global styles for ABP theme shared components.
 * These styles can be injected into your app's global CSS or used with a style tag.
 *
 * @since 2.0.0 - Updated styles:
 * - Removed modal-specific styles (now handled by components)
 * - Added sorting icon styles
 * - Added table scrollbar width styling
 *
 * @since 2.9.0 - Added RTL support for data-tables-filter
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

/**
 * Bootstrap CSS file pattern with direction placeholder.
 * Use with createLazyStyleHref to get the correct bootstrap CSS for RTL/LTR.
 * @since 2.9.0
 */
export const BOOTSTRAP = 'bootstrap-{{dir}}.min.css';
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

/* RTL support - @since 2.9.0 */
[dir=rtl] .data-tables-filter {
  text-align: left;
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

.navbar .dropdown-menu {
  min-width: 215px;
}

.ui-table-scrollable-body::-webkit-scrollbar {
  height: 5px !important;
  width: 5px !important;
}

.ui-table-scrollable-body::-webkit-scrollbar-track {
  background: #ddd;
}

.ui-table-scrollable-body::-webkit-scrollbar-thumb {
  background: #8a8686;
}

.abp-ellipsis-inline {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.abp-ellipsis {
  overflow: hidden !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-widget-overlay {
  z-index: 1000;
}

.color-white {
  color: #FFF !important;
}

.custom-checkbox > label {
  cursor: pointer;
}

/* <animations */

.fade-in-top {
  animation: fadeInTop 0.2s ease-in-out;
}

.fade-out-top {
  animation: fadeOutTop 0.2s ease-in-out;
}

.abp-collapsed-height {
  -moz-transition: max-height linear 0.35s;
  -ms-transition: max-height linear 0.35s;
  -o-transition: max-height linear 0.35s;
  -webkit-transition: max-height linear 0.35s;
  overflow:hidden;
  transition:max-height 0.35s linear;
  height:auto;
  max-height: 0;
}

.abp-mh-25 {
  max-height: 25vh;
}

.abp-mh-50 {
  transition:max-height 0.65s linear;
  max-height: 50vh;
}

.abp-mh-75 {
  transition:max-height 0.85s linear;
  max-height: 75vh;
}

.abp-mh-100 {
  transition:max-height 1s linear;
  max-height: 100vh;
}

/* Sorting icon styles - @since 2.0.0 */
[class^="sorting"] {
  opacity: .3;
  cursor: pointer;
}
[class^="sorting"]:before {
  right: 0.5rem;
  content: "↑";
}
[class^="sorting"]:after {
  right: 0.5rem;
  content: "↓";
}

.sorting_desc {
  opacity: 1;
}
.sorting_desc:before {
  opacity: .3;
}

.sorting_asc {
  opacity: 1;
}
.sorting_asc:after {
  opacity: .3;
}

@keyframes fadeInTop {
  from {
    transform: translateY(-5px);
    opacity: 0;
  }

  to {
    transform: translateY(0px);
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
