/**
 * Tests for useTextTemplates hook
 * @since 2.7.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTextTemplates } from '../../hooks/useTextTemplates';

// Mock the services
const mockGetList = vi.fn();
const mockGetByInput = vi.fn();
const mockUpdateByInput = vi.fn();
const mockRestoreToDefaultByInput = vi.fn();

vi.mock('../../services/template-definition.service', () => ({
  TemplateDefinitionService: vi.fn().mockImplementation(() => ({
    getList: mockGetList,
  })),
}));

vi.mock('../../services/template-content.service', () => ({
  TemplateContentService: vi.fn().mockImplementation(() => ({
    getByInput: mockGetByInput,
    updateByInput: mockUpdateByInput,
    restoreToDefaultByInput: mockRestoreToDefaultByInput,
  })),
}));

vi.mock('@abpjs/core', () => ({
  useRestService: () => ({}),
}));

describe('useTextTemplates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useTextTemplates());

      expect(result.current.templateDefinitions).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.selectedTemplate).toBeNull();
      expect(result.current.templateContent).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should return all expected methods', () => {
      const { result } = renderHook(() => useTextTemplates());

      expect(typeof result.current.fetchTemplateDefinitions).toBe('function');
      expect(typeof result.current.getTemplateContent).toBe('function');
      expect(typeof result.current.updateTemplateContent).toBe('function');
      expect(typeof result.current.restoreToDefault).toBe('function');
      expect(typeof result.current.setSelectedTemplate).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('fetchTemplateDefinitions', () => {
    it('should fetch and set template definitions', async () => {
      const mockData = {
        items: [
          {
            name: 'Template1',
            displayName: 'Template 1',
            isLayout: false,
            layout: '',
            defaultCultureName: 'en',
            isInlineLocalized: false,
          },
        ],
      };
      mockGetList.mockResolvedValue(mockData);

      const { result } = renderHook(() => useTextTemplates());

      await act(async () => {
        await result.current.fetchTemplateDefinitions();
      });

      expect(result.current.templateDefinitions).toHaveLength(1);
      expect(result.current.templateDefinitions[0].name).toBe('Template1');
      expect(result.current.totalCount).toBe(1);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set loading state while fetching', async () => {
      mockGetList.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ items: [] }), 100))
      );

      const { result } = renderHook(() => useTextTemplates());

      act(() => {
        result.current.fetchTemplateDefinitions();
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle errors', async () => {
      mockGetList.mockRejectedValue(new Error('Fetch failed'));

      const { result } = renderHook(() => useTextTemplates());

      await act(async () => {
        await result.current.fetchTemplateDefinitions();
      });

      expect(result.current.error).toBe('Fetch failed');
      expect(result.current.templateDefinitions).toEqual([]);
    });

    it('should handle non-Error exceptions', async () => {
      mockGetList.mockRejectedValue('String error');

      const { result } = renderHook(() => useTextTemplates());

      await act(async () => {
        await result.current.fetchTemplateDefinitions();
      });

      expect(result.current.error).toBe('Failed to fetch template definitions');
    });

    it('should handle undefined items in response', async () => {
      mockGetList.mockResolvedValue({});

      const { result } = renderHook(() => useTextTemplates());

      await act(async () => {
        await result.current.fetchTemplateDefinitions();
      });

      expect(result.current.templateDefinitions).toEqual([]);
      expect(result.current.totalCount).toBe(0);
    });

    it('should pass pagination parameters', async () => {
      mockGetList.mockResolvedValue({ items: [] });

      const { result } = renderHook(() => useTextTemplates());

      await act(async () => {
        await result.current.fetchTemplateDefinitions({ skipCount: 10, maxResultCount: 5 });
      });

      expect(mockGetList).toHaveBeenCalledWith({ skipCount: 10, maxResultCount: 5 });
    });
  });

  describe('getTemplateContent', () => {
    it('should fetch and set template content', async () => {
      const mockContent = {
        name: 'EmailTemplate',
        cultureName: 'en',
        content: '<html>Hello</html>',
      };
      mockGetByInput.mockResolvedValue(mockContent);

      const { result } = renderHook(() => useTextTemplates());

      await act(async () => {
        await result.current.getTemplateContent({ templateName: 'EmailTemplate', cultureName: 'en' });
      });

      expect(result.current.templateContent).toEqual(mockContent);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle errors', async () => {
      mockGetByInput.mockRejectedValue(new Error('Content not found'));

      const { result } = renderHook(() => useTextTemplates());

      await act(async () => {
        await result.current.getTemplateContent({ templateName: 'NonExistent' });
      });

      expect(result.current.error).toBe('Content not found');
      expect(result.current.templateContent).toBeNull();
    });

    it('should handle non-Error exceptions', async () => {
      mockGetByInput.mockRejectedValue(42);

      const { result } = renderHook(() => useTextTemplates());

      await act(async () => {
        await result.current.getTemplateContent({ templateName: 'Test' });
      });

      expect(result.current.error).toBe('Failed to fetch template content');
    });
  });

  describe('updateTemplateContent', () => {
    it('should update template content and return success', async () => {
      const mockUpdated = {
        name: 'EmailTemplate',
        cultureName: 'en',
        content: 'Updated content',
      };
      mockUpdateByInput.mockResolvedValue(mockUpdated);

      const { result } = renderHook(() => useTextTemplates());

      let updateResult: { success: boolean; error?: string } | undefined;
      await act(async () => {
        updateResult = await result.current.updateTemplateContent({
          templateName: 'EmailTemplate',
          cultureName: 'en',
          content: 'Updated content',
        });
      });

      expect(updateResult?.success).toBe(true);
      expect(result.current.templateContent?.content).toBe('Updated content');
    });

    it('should return error on failure', async () => {
      mockUpdateByInput.mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => useTextTemplates());

      let updateResult: { success: boolean; error?: string } | undefined;
      await act(async () => {
        updateResult = await result.current.updateTemplateContent({
          templateName: 'EmailTemplate',
          cultureName: 'en',
          content: 'Content',
        });
      });

      expect(updateResult?.success).toBe(false);
      expect(updateResult?.error).toBe('Update failed');
      expect(result.current.error).toBe('Update failed');
    });

    it('should handle non-Error exceptions', async () => {
      mockUpdateByInput.mockRejectedValue({ message: 'Object error' });

      const { result } = renderHook(() => useTextTemplates());

      let updateResult: { success: boolean; error?: string } | undefined;
      await act(async () => {
        updateResult = await result.current.updateTemplateContent({
          templateName: 'EmailTemplate',
          cultureName: 'en',
          content: 'Content',
        });
      });

      expect(updateResult?.success).toBe(false);
      expect(updateResult?.error).toBe('Failed to update template content');
    });
  });

  describe('restoreToDefault', () => {
    it('should restore template and refresh content', async () => {
      mockRestoreToDefaultByInput.mockResolvedValue(undefined);
      mockGetByInput.mockResolvedValue({
        name: 'EmailTemplate',
        cultureName: 'en',
        content: 'Default content',
      });

      const { result } = renderHook(() => useTextTemplates());

      let restoreResult: { success: boolean; error?: string } | undefined;
      await act(async () => {
        restoreResult = await result.current.restoreToDefault({
          templateName: 'EmailTemplate',
          cultureName: 'en',
        });
      });

      expect(restoreResult?.success).toBe(true);
      expect(mockGetByInput).toHaveBeenCalled();
      expect(result.current.templateContent?.content).toBe('Default content');
    });

    it('should not refresh content without cultureName', async () => {
      mockRestoreToDefaultByInput.mockResolvedValue(undefined);

      const { result } = renderHook(() => useTextTemplates());

      await act(async () => {
        await result.current.restoreToDefault({ templateName: 'EmailTemplate' });
      });

      expect(mockGetByInput).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockRestoreToDefaultByInput.mockRejectedValue(new Error('Restore failed'));

      const { result } = renderHook(() => useTextTemplates());

      let restoreResult: { success: boolean; error?: string } | undefined;
      await act(async () => {
        restoreResult = await result.current.restoreToDefault({
          templateName: 'EmailTemplate',
          cultureName: 'en',
        });
      });

      expect(restoreResult?.success).toBe(false);
      expect(restoreResult?.error).toBe('Restore failed');
    });

    it('should handle non-Error exceptions', async () => {
      mockRestoreToDefaultByInput.mockRejectedValue(null);

      const { result } = renderHook(() => useTextTemplates());

      let restoreResult: { success: boolean; error?: string } | undefined;
      await act(async () => {
        restoreResult = await result.current.restoreToDefault({
          templateName: 'EmailTemplate',
          cultureName: 'en',
        });
      });

      expect(restoreResult?.success).toBe(false);
      expect(restoreResult?.error).toBe('Failed to restore template to default');
    });
  });

  describe('setSelectedTemplate', () => {
    it('should set selected template', () => {
      const { result } = renderHook(() => useTextTemplates());

      const template = {
        name: 'Test',
        displayName: 'Test Template',
        isLayout: false,
        layout: '',
        defaultCultureName: 'en',
        isInlineLocalized: false,
      };

      act(() => {
        result.current.setSelectedTemplate(template);
      });

      expect(result.current.selectedTemplate).toEqual(template);
    });

    it('should clear selected template with null', () => {
      const { result } = renderHook(() => useTextTemplates());

      const template = {
        name: 'Test',
        displayName: 'Test Template',
        isLayout: false,
        layout: '',
        defaultCultureName: 'en',
        isInlineLocalized: false,
      };

      act(() => {
        result.current.setSelectedTemplate(template);
      });

      act(() => {
        result.current.setSelectedTemplate(null);
      });

      expect(result.current.selectedTemplate).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', async () => {
      mockGetList.mockResolvedValue({
        items: [{ name: 'Test', displayName: 'Test', isLayout: false, layout: '', defaultCultureName: 'en', isInlineLocalized: false }],
      });

      const { result } = renderHook(() => useTextTemplates());

      // Set up some state
      await act(async () => {
        await result.current.fetchTemplateDefinitions();
        result.current.setSelectedTemplate({
          name: 'Test',
          displayName: 'Test',
          isLayout: false,
          layout: '',
          defaultCultureName: 'en',
          isInlineLocalized: false,
        });
      });

      // Verify state was set
      expect(result.current.templateDefinitions).toHaveLength(1);
      expect(result.current.selectedTemplate).not.toBeNull();

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.templateDefinitions).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.selectedTemplate).toBeNull();
      expect(result.current.templateContent).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });
});
