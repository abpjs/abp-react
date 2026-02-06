/**
 * Template Contents Component
 * Translated from @volo/abp.ng.text-template-management v2.7.0
 *
 * Displays and allows editing of template content for different cultures.
 */

import React, { useEffect, useState, useCallback } from 'react';
import type { TextTemplateManagement } from '../../models';
import { useTextTemplates } from '../../hooks';

export interface TemplateContentsComponentProps {
  /** Template name to edit */
  templateName: string;
  /** Available culture names for selection */
  cultures?: Array<{ name: string; displayName: string }>;
  /** Default culture name */
  defaultCultureName?: string;
  /** Callback when save is successful */
  onSave?: (content: TextTemplateManagement.TextTemplateContentDto) => void;
  /** Callback when restore to default is successful */
  onRestore?: () => void;
  /** Optional CSS class for the container */
  className?: string;
}

/**
 * Component for editing template content across different cultures.
 * Supports viewing reference content and editing/restoring localized content.
 *
 * @example
 * ```tsx
 * function EditTemplatePage() {
 *   const { templateName } = useParams();
 *
 *   return (
 *     <TemplateContentsComponent
 *       templateName={templateName}
 *       cultures={[
 *         { name: 'en', displayName: 'English' },
 *         { name: 'fr', displayName: 'French' },
 *       ]}
 *       onSave={() => toast.success('Template saved!')}
 *     />
 *   );
 * }
 * ```
 */
export function TemplateContentsComponent({
  templateName,
  cultures = [],
  defaultCultureName,
  onSave,
  onRestore,
  className = '',
}: TemplateContentsComponentProps): React.ReactElement {
  const {
    templateContent,
    isLoading,
    error,
    getTemplateContent,
    updateTemplateContent,
    restoreToDefault,
  } = useTextTemplates();

  const [selectedCulture, setSelectedCulture] = useState(defaultCultureName || '');
  const [content, setContent] = useState('');
  const [referenceContent, setReferenceContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch template content when culture changes
  useEffect(() => {
    if (templateName && selectedCulture) {
      getTemplateContent({
        templateName,
        cultureName: selectedCulture,
      });
    }
  }, [templateName, selectedCulture, getTemplateContent]);

  // Fetch reference content (default culture)
  useEffect(() => {
    if (templateName && defaultCultureName && defaultCultureName !== selectedCulture) {
      // Fetch reference content separately
      // For simplicity, we just show a placeholder - in real app you'd fetch this
      setReferenceContent('Reference content would be loaded here');
    }
  }, [templateName, defaultCultureName, selectedCulture]);

  // Update local content when template content changes
  useEffect(() => {
    if (templateContent) {
      setContent(templateContent.content || '');
    }
  }, [templateContent]);

  const handleCultureChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCulture(e.target.value);
  }, []);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  const handleSave = useCallback(async () => {
    if (!templateName || !selectedCulture) return;

    setIsSaving(true);
    const result = await updateTemplateContent({
      templateName,
      cultureName: selectedCulture,
      content,
    });
    setIsSaving(false);

    if (result.success && templateContent) {
      onSave?.(templateContent);
    }
  }, [templateName, selectedCulture, content, updateTemplateContent, templateContent, onSave]);

  const handleRestoreToDefault = useCallback(async () => {
    if (!templateName || !selectedCulture) return;

    const confirmed = window.confirm(
      'Are you sure you want to restore this template to its default content?'
    );
    if (!confirmed) return;

    setIsSaving(true);
    const result = await restoreToDefault({
      templateName,
      cultureName: selectedCulture,
    });
    setIsSaving(false);

    if (result.success) {
      onRestore?.();
    }
  }, [templateName, selectedCulture, restoreToDefault, onRestore]);

  if (error) {
    return (
      <div className={`template-contents-error ${className}`} style={styles.error}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`template-contents-component ${className}`} style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Edit Template: {templateName}</h2>
      </div>

      <div style={styles.cultureSelector}>
        <label htmlFor="culture-select" style={styles.label}>
          Culture:
        </label>
        <select
          id="culture-select"
          value={selectedCulture}
          onChange={handleCultureChange}
          style={styles.select}
        >
          <option value="">Select a culture</option>
          {cultures.map((culture) => (
            <option key={culture.name} value={culture.name}>
              {culture.displayName}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div style={styles.loading}>Loading template content...</div>
      ) : (
        <>
          {referenceContent && defaultCultureName !== selectedCulture && (
            <div style={styles.referenceSection}>
              <h4 style={styles.sectionTitle}>Reference Content ({defaultCultureName})</h4>
              <pre style={styles.referenceContent}>{referenceContent}</pre>
            </div>
          )}

          <div style={styles.editorSection}>
            <h4 style={styles.sectionTitle}>
              Content {selectedCulture ? `(${selectedCulture})` : ''}
            </h4>
            <textarea
              value={content}
              onChange={handleContentChange}
              style={styles.textarea}
              rows={15}
              placeholder="Enter template content..."
              disabled={!selectedCulture}
            />
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={handleRestoreToDefault}
              disabled={isSaving || !selectedCulture}
              style={styles.restoreButton}
            >
              Restore to Default
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !selectedCulture}
              style={styles.saveButton}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '16px',
  },
  header: {
    marginBottom: '16px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
  },
  cultureSelector: {
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  label: {
    fontWeight: 500,
    color: '#374151',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    minWidth: '200px',
  },
  loading: {
    padding: '32px',
    textAlign: 'center',
    color: '#666',
  },
  error: {
    padding: '32px',
    textAlign: 'center',
    color: '#dc2626',
  },
  referenceSection: {
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '4px',
  },
  sectionTitle: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    fontWeight: 500,
    color: '#6b7280',
  },
  referenceContent: {
    margin: 0,
    padding: '8px',
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    maxHeight: '200px',
    overflow: 'auto',
  },
  editorSection: {
    marginBottom: '16px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    fontFamily: 'monospace',
    resize: 'vertical',
    minHeight: '200px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  restoreButton: {
    padding: '10px 20px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    backgroundColor: 'white',
    color: '#374151',
    fontSize: '14px',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default TemplateContentsComponent;
