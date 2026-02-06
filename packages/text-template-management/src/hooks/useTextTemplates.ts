/**
 * useTextTemplates Hook
 * Translated from @volo/abp.ng.text-template-management v2.7.0
 *
 * Provides a React hook for managing text templates with state management.
 */

import { useState, useCallback, useMemo } from 'react';
import { useRestService, type PagedResultRequestDto } from '@abpjs/core';
import type { TextTemplateManagement } from '../models';
import { TemplateDefinitionService } from '../services/template-definition.service';
import { TemplateContentService } from '../services/template-content.service';

/**
 * Hook return type for useTextTemplates
 */
export interface UseTextTemplatesReturn {
  /** List of template definitions */
  templateDefinitions: TextTemplateManagement.TemplateDefinitionDto[];
  /** Total count of template definitions */
  totalCount: number;
  /** Currently selected template */
  selectedTemplate: TextTemplateManagement.TemplateDefinitionDto | null;
  /** Template content for the selected template */
  templateContent: TextTemplateManagement.TextTemplateContentDto | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;

  // Methods
  /** Fetch template definitions */
  fetchTemplateDefinitions: (params?: Partial<PagedResultRequestDto>) => Promise<void>;
  /** Get template content */
  getTemplateContent: (params: TextTemplateManagement.TemplateContentInput) => Promise<void>;
  /** Update template content */
  updateTemplateContent: (
    body: TextTemplateManagement.CreateOrUpdateTemplateContentDto
  ) => Promise<{ success: boolean; error?: string }>;
  /** Restore template content to default */
  restoreToDefault: (
    params: TextTemplateManagement.TemplateContentInput
  ) => Promise<{ success: boolean; error?: string }>;
  /** Set selected template */
  setSelectedTemplate: (template: TextTemplateManagement.TemplateDefinitionDto | null) => void;
  /** Reset all state */
  reset: () => void;
}

/**
 * React hook for managing text templates
 *
 * @returns Hook state and methods
 *
 * @example
 * ```tsx
 * function TextTemplatesPage() {
 *   const {
 *     templateDefinitions,
 *     isLoading,
 *     fetchTemplateDefinitions,
 *     getTemplateContent,
 *   } = useTextTemplates();
 *
 *   useEffect(() => {
 *     fetchTemplateDefinitions();
 *   }, [fetchTemplateDefinitions]);
 *
 *   return (
 *     <div>
 *       {templateDefinitions.map(template => (
 *         <div key={template.name}>{template.displayName}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTextTemplates(): UseTextTemplatesReturn {
  const restService = useRestService();

  // Services
  const templateDefinitionService = useMemo(
    () => new TemplateDefinitionService(restService),
    [restService]
  );
  const templateContentService = useMemo(
    () => new TemplateContentService(restService),
    [restService]
  );

  // State
  const [templateDefinitions, setTemplateDefinitions] = useState<
    TextTemplateManagement.TemplateDefinitionDto[]
  >([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TextTemplateManagement.TemplateDefinitionDto | null>(null);
  const [templateContent, setTemplateContent] =
    useState<TextTemplateManagement.TextTemplateContentDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Methods
  const fetchTemplateDefinitions = useCallback(
    async (params: Partial<PagedResultRequestDto> = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await templateDefinitionService.getList(params);
        const items = result.items || [];
        setTemplateDefinitions(items);
        setTotalCount(items.length);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch template definitions';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [templateDefinitionService]
  );

  const getTemplateContent = useCallback(
    async (params: TextTemplateManagement.TemplateContentInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await templateContentService.getByInput(params);
        setTemplateContent(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch template content';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [templateContentService]
  );

  const updateTemplateContent = useCallback(
    async (
      body: TextTemplateManagement.CreateOrUpdateTemplateContentDto
    ): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await templateContentService.updateByInput(body);
        setTemplateContent(result);
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update template content';
        setError(message);
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [templateContentService]
  );

  const restoreToDefault = useCallback(
    async (
      params: TextTemplateManagement.TemplateContentInput
    ): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      setError(null);
      try {
        await templateContentService.restoreToDefaultByInput(params);
        // Refresh content after restore
        if (params.cultureName) {
          const result = await templateContentService.getByInput(params);
          setTemplateContent(result);
        }
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to restore template to default';
        setError(message);
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [templateContentService]
  );

  const reset = useCallback(() => {
    setTemplateDefinitions([]);
    setTotalCount(0);
    setSelectedTemplate(null);
    setTemplateContent(null);
    setError(null);
  }, []);

  return {
    templateDefinitions,
    totalCount,
    selectedTemplate,
    templateContent,
    isLoading,
    error,
    fetchTemplateDefinitions,
    getTemplateContent,
    updateTemplateContent,
    restoreToDefault,
    setSelectedTemplate,
    reset,
  };
}
