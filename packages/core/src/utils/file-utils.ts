/**
 * File Utilities
 * Translated from @abp/ng.core v3.2.0
 *
 * @since 3.2.0
 */

/**
 * Download a Blob as a file
 * Creates a temporary link element to trigger the download
 *
 * @param blob - The Blob to download
 * @param filename - The filename to use for the download
 * @since 3.2.0
 */
export function downloadBlob(blob: Blob, filename: string): void {
  // Create a URL for the blob
  const url = window.URL.createObjectURL(blob);

  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  window.URL.revokeObjectURL(url);
}
