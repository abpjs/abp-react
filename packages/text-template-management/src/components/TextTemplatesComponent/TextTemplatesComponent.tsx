/**
 * Text Templates Component
 * Translated from @volo/abp.ng.text-template-management v2.7.0
 *
 * Displays a list of text template definitions with pagination and actions.
 */

import React, { useEffect, useState } from 'react';
import type { TextTemplateManagement } from '../../models';
import { useTextTemplates } from '../../hooks';

export interface TextTemplatesComponentProps {
  /** Callback when edit contents is clicked */
  onEditContents?: (template: TextTemplateManagement.TemplateDefinitionDto) => void;
  /** Optional CSS class for the container */
  className?: string;
  /** Page size for pagination */
  pageSize?: number;
}

/**
 * Component for displaying and managing text templates.
 * Shows a paginated list of template definitions with actions.
 *
 * @example
 * ```tsx
 * function TextTemplatesPage() {
 *   const navigate = useNavigate();
 *
 *   return (
 *     <TextTemplatesComponent
 *       onEditContents={(template) => {
 *         navigate(`/text-templates/${template.name}/contents`);
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export function TextTemplatesComponent({
  onEditContents,
  className = '',
  pageSize = 10,
}: TextTemplatesComponentProps): React.ReactElement {
  const {
    templateDefinitions,
    isLoading,
    error,
    fetchTemplateDefinitions,
    setSelectedTemplate,
  } = useTextTemplates();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTemplateDefinitions({
      skipCount: (currentPage - 1) * pageSize,
      maxResultCount: pageSize,
    });
  }, [fetchTemplateDefinitions, currentPage, pageSize]);

  const handleEditContents = (template: TextTemplateManagement.TemplateDefinitionDto) => {
    setSelectedTemplate(template);
    onEditContents?.(template);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className={`text-templates-error ${className}`} style={styles.error}>
        <p>Error loading templates: {error}</p>
        <button
          type="button"
          onClick={() => fetchTemplateDefinitions()}
          style={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`text-templates-component ${className}`} style={styles.container}>
      <div className="text-templates-header" style={styles.header}>
        <h2 style={styles.title}>Text Templates</h2>
      </div>

      {isLoading ? (
        <div style={styles.loading}>Loading...</div>
      ) : templateDefinitions.length === 0 ? (
        <div style={styles.empty}>No text templates found.</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Display Name</th>
                <th style={styles.th}>Is Layout</th>
                <th style={styles.th}>Layout</th>
                <th style={styles.th}>Default Culture</th>
                <th style={styles.th}>Inline Localized</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templateDefinitions.map((template) => (
                <tr key={template.name} style={styles.tr}>
                  <td style={styles.td}>{template.name}</td>
                  <td style={styles.td}>{template.displayName}</td>
                  <td style={styles.td}>{template.isLayout ? 'Yes' : 'No'}</td>
                  <td style={styles.td}>{template.layout || '-'}</td>
                  <td style={styles.td}>{template.defaultCultureName || '-'}</td>
                  <td style={styles.td}>{template.isInlineLocalized ? 'Yes' : 'No'}</td>
                  <td style={styles.td}>
                    <button
                      type="button"
                      onClick={() => handleEditContents(template)}
                      style={styles.actionButton}
                    >
                      Edit Contents
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {templateDefinitions.length > 0 && (
        <div style={styles.pagination}>
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={styles.pageButton}
          >
            Previous
          </button>
          <span style={styles.pageInfo}>Page {currentPage}</span>
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={templateDefinitions.length < pageSize}
            style={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 600,
  },
  loading: {
    padding: '32px',
    textAlign: 'center',
    color: '#666',
  },
  empty: {
    padding: '32px',
    textAlign: 'center',
    color: '#666',
  },
  error: {
    padding: '32px',
    textAlign: 'center',
    color: '#dc2626',
  },
  retryButton: {
    marginTop: '8px',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#3b82f6',
    color: 'white',
    cursor: 'pointer',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    padding: '12px 8px',
    textAlign: 'left',
    borderBottom: '2px solid #e5e7eb',
    fontWeight: 600,
    color: '#374151',
  },
  tr: {
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '12px 8px',
    color: '#4b5563',
  },
  actionButton: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: '12px',
    cursor: 'pointer',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '16px',
  },
  pageButton: {
    padding: '8px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  pageInfo: {
    color: '#6b7280',
  },
};

export default TextTemplatesComponent;
