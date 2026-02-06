/**
 * Tests for TemplateContentsComponent
 * @since 2.7.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TemplateContentsComponent } from '../../components/TemplateContentsComponent';

// Mock the hook
const mockGetTemplateContent = vi.fn();
const mockUpdateTemplateContent = vi.fn();
const mockRestoreToDefault = vi.fn();

let mockTemplateContent: { name: string; cultureName: string; content: string } | null = null;
let mockIsLoading = false;
let mockError: string | null = null;

vi.mock('../../hooks', () => ({
  useTextTemplates: () => ({
    templateContent: mockTemplateContent,
    isLoading: mockIsLoading,
    error: mockError,
    getTemplateContent: mockGetTemplateContent,
    updateTemplateContent: mockUpdateTemplateContent,
    restoreToDefault: mockRestoreToDefault,
  }),
}));

// Mock window.confirm
const originalConfirm = window.confirm;

describe('TemplateContentsComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTemplateContent = null;
    mockIsLoading = false;
    mockError = null;
    window.confirm = vi.fn(() => true);
  });

  afterEach(() => {
    window.confirm = originalConfirm;
  });

  describe('Export and Basic Rendering', () => {
    it('should export TemplateContentsComponent', () => {
      expect(TemplateContentsComponent).toBeDefined();
    });

    it('should render the component with template name', () => {
      render(<TemplateContentsComponent templateName="EmailTemplate" />);
      expect(screen.getByText('Edit Template: EmailTemplate')).toBeDefined();
    });

    it('should accept className prop', () => {
      const { container } = render(
        <TemplateContentsComponent templateName="Test" className="custom-class" />
      );
      expect(container.querySelector('.custom-class')).toBeDefined();
    });
  });

  describe('Culture Selector', () => {
    it('should render culture selector', () => {
      render(<TemplateContentsComponent templateName="Test" />);
      expect(screen.getByText('Culture:')).toBeDefined();
      expect(screen.getByRole('combobox')).toBeDefined();
    });

    it('should display culture options', () => {
      const cultures = [
        { name: 'en', displayName: 'English' },
        { name: 'fr', displayName: 'French' },
      ];
      render(<TemplateContentsComponent templateName="Test" cultures={cultures} />);

      const select = screen.getByRole('combobox');
      expect(select).toBeDefined();
      expect(screen.getByText('English')).toBeDefined();
      expect(screen.getByText('French')).toBeDefined();
    });

    it('should have default option', () => {
      render(<TemplateContentsComponent templateName="Test" />);
      expect(screen.getByText('Select a culture')).toBeDefined();
    });

    it('should set default culture when provided', () => {
      const cultures = [{ name: 'en', displayName: 'English' }];
      render(
        <TemplateContentsComponent
          templateName="Test"
          cultures={cultures}
          defaultCultureName="en"
        />
      );
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('en');
    });
  });

  describe('Loading State', () => {
    it('should display loading message when isLoading is true', () => {
      mockIsLoading = true;
      render(<TemplateContentsComponent templateName="Test" />);
      expect(screen.getByText('Loading template content...')).toBeDefined();
    });
  });

  describe('Error State', () => {
    it('should display error message when there is an error', () => {
      mockError = 'Failed to load content';
      render(<TemplateContentsComponent templateName="Test" />);
      expect(screen.getByText(/Error: Failed to load content/)).toBeDefined();
    });
  });

  describe('Content Editor', () => {
    it('should render textarea for content', () => {
      render(<TemplateContentsComponent templateName="Test" />);
      expect(screen.getByPlaceholderText('Enter template content...')).toBeDefined();
    });

    it('should disable textarea when no culture is selected', () => {
      render(<TemplateContentsComponent templateName="Test" />);
      const textarea = screen.getByPlaceholderText('Enter template content...') as HTMLTextAreaElement;
      expect(textarea.disabled).toBe(true);
    });

    it('should enable textarea when culture is selected', () => {
      const cultures = [{ name: 'en', displayName: 'English' }];
      render(
        <TemplateContentsComponent
          templateName="Test"
          cultures={cultures}
          defaultCultureName="en"
        />
      );
      const textarea = screen.getByPlaceholderText('Enter template content...') as HTMLTextAreaElement;
      expect(textarea.disabled).toBe(false);
    });

    it('should display template content when available', () => {
      mockTemplateContent = {
        name: 'Test',
        cultureName: 'en',
        content: 'Hello World',
      };
      const cultures = [{ name: 'en', displayName: 'English' }];
      render(
        <TemplateContentsComponent
          templateName="Test"
          cultures={cultures}
          defaultCultureName="en"
        />
      );
      const textarea = screen.getByPlaceholderText('Enter template content...') as HTMLTextAreaElement;
      expect(textarea.value).toBe('Hello World');
    });

    it('should allow editing content', () => {
      const cultures = [{ name: 'en', displayName: 'English' }];
      render(
        <TemplateContentsComponent
          templateName="Test"
          cultures={cultures}
          defaultCultureName="en"
        />
      );
      const textarea = screen.getByPlaceholderText('Enter template content...') as HTMLTextAreaElement;

      fireEvent.change(textarea, { target: { value: 'New content' } });
      expect(textarea.value).toBe('New content');
    });
  });

  describe('Save Button', () => {
    it('should render Save button', () => {
      render(<TemplateContentsComponent templateName="Test" />);
      expect(screen.getByText('Save')).toBeDefined();
    });

    it('should disable Save button when no culture is selected', () => {
      render(<TemplateContentsComponent templateName="Test" />);
      const saveButton = screen.getByText('Save');
      expect(saveButton).toHaveProperty('disabled', true);
    });

    it('should call updateTemplateContent when Save is clicked', async () => {
      mockUpdateTemplateContent.mockResolvedValue({ success: true });
      const mockOnSave = vi.fn();
      const cultures = [{ name: 'en', displayName: 'English' }];

      mockTemplateContent = { name: 'Test', cultureName: 'en', content: 'Content' };

      render(
        <TemplateContentsComponent
          templateName="Test"
          cultures={cultures}
          defaultCultureName="en"
          onSave={mockOnSave}
        />
      );

      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateTemplateContent).toHaveBeenCalled();
      });
    });

    it('should show Saving... text while saving', async () => {
      mockUpdateTemplateContent.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
      );
      const cultures = [{ name: 'en', displayName: 'English' }];

      render(
        <TemplateContentsComponent
          templateName="Test"
          cultures={cultures}
          defaultCultureName="en"
        />
      );

      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      expect(screen.getByText('Saving...')).toBeDefined();
    });
  });

  describe('Restore to Default Button', () => {
    it('should render Restore to Default button', () => {
      render(<TemplateContentsComponent templateName="Test" />);
      expect(screen.getByText('Restore to Default')).toBeDefined();
    });

    it('should disable Restore button when no culture is selected', () => {
      render(<TemplateContentsComponent templateName="Test" />);
      const restoreButton = screen.getByText('Restore to Default');
      expect(restoreButton).toHaveProperty('disabled', true);
    });

    it('should show confirmation dialog when Restore is clicked', async () => {
      const cultures = [{ name: 'en', displayName: 'English' }];
      mockRestoreToDefault.mockResolvedValue({ success: true });

      render(
        <TemplateContentsComponent
          templateName="Test"
          cultures={cultures}
          defaultCultureName="en"
        />
      );

      const restoreButton = screen.getByText('Restore to Default');
      fireEvent.click(restoreButton);

      expect(window.confirm).toHaveBeenCalledWith(
        'Are you sure you want to restore this template to its default content?'
      );
    });

    it('should call restoreToDefault when confirmed', async () => {
      mockRestoreToDefault.mockResolvedValue({ success: true });
      const mockOnRestore = vi.fn();
      const cultures = [{ name: 'en', displayName: 'English' }];

      render(
        <TemplateContentsComponent
          templateName="Test"
          cultures={cultures}
          defaultCultureName="en"
          onRestore={mockOnRestore}
        />
      );

      const restoreButton = screen.getByText('Restore to Default');
      fireEvent.click(restoreButton);

      await waitFor(() => {
        expect(mockRestoreToDefault).toHaveBeenCalled();
      });
    });

    it('should not call restoreToDefault when cancelled', async () => {
      window.confirm = vi.fn(() => false);
      const cultures = [{ name: 'en', displayName: 'English' }];

      render(
        <TemplateContentsComponent
          templateName="Test"
          cultures={cultures}
          defaultCultureName="en"
        />
      );

      const restoreButton = screen.getByText('Restore to Default');
      fireEvent.click(restoreButton);

      expect(mockRestoreToDefault).not.toHaveBeenCalled();
    });
  });

  describe('Culture Change', () => {
    it('should fetch content when culture changes', async () => {
      const cultures = [
        { name: 'en', displayName: 'English' },
        { name: 'fr', displayName: 'French' },
      ];

      render(<TemplateContentsComponent templateName="Test" cultures={cultures} />);

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'fr' } });

      await waitFor(() => {
        expect(mockGetTemplateContent).toHaveBeenCalledWith({
          templateName: 'Test',
          cultureName: 'fr',
        });
      });
    });
  });

  describe('Reference Content', () => {
    it('should show reference section label when default culture differs', () => {
      const cultures = [
        { name: 'en', displayName: 'English' },
        { name: 'fr', displayName: 'French' },
      ];

      render(
        <TemplateContentsComponent
          templateName="Test"
          cultures={cultures}
          defaultCultureName="en"
        />
      );

      // Change to French (not the default)
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'fr' } });

      // Should show reference content section
      expect(screen.getByText(/Reference Content/)).toBeDefined();
    });
  });
});
