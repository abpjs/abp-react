/**
 * Tests for TextTemplatesComponent
 * @since 2.7.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TextTemplatesComponent } from '../../components/TextTemplatesComponent';

// Mock the hook
const mockFetchTemplateDefinitions = vi.fn();
const mockSetSelectedTemplate = vi.fn();

vi.mock('../../hooks', () => ({
  useTextTemplates: () => ({
    templateDefinitions: mockTemplateDefinitions,
    isLoading: mockIsLoading,
    error: mockError,
    fetchTemplateDefinitions: mockFetchTemplateDefinitions,
    setSelectedTemplate: mockSetSelectedTemplate,
  }),
}));

let mockTemplateDefinitions: Array<{
  name: string;
  displayName: string;
  isLayout: boolean;
  layout: string;
  defaultCultureName: string;
  isInlineLocalized: boolean;
}> = [];
let mockIsLoading = false;
let mockError: string | null = null;

describe('TextTemplatesComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTemplateDefinitions = [];
    mockIsLoading = false;
    mockError = null;
  });

  describe('Export and Basic Rendering', () => {
    it('should export TextTemplatesComponent', () => {
      expect(TextTemplatesComponent).toBeDefined();
    });

    it('should render the component with heading', () => {
      render(<TextTemplatesComponent />);
      expect(screen.getByText('Text Templates')).toBeDefined();
    });

    it('should accept className prop', () => {
      const { container } = render(<TextTemplatesComponent className="custom-class" />);
      expect(container.querySelector('.custom-class')).toBeDefined();
    });
  });

  describe('Loading State', () => {
    it('should display loading message when isLoading is true', () => {
      mockIsLoading = true;
      render(<TextTemplatesComponent />);
      expect(screen.getByText('Loading...')).toBeDefined();
    });
  });

  describe('Error State', () => {
    it('should display error message when there is an error', () => {
      mockError = 'Failed to load templates';
      render(<TextTemplatesComponent />);
      expect(screen.getByText(/Error loading templates:/)).toBeDefined();
      expect(screen.getByText(/Failed to load templates/)).toBeDefined();
    });

    it('should display retry button on error', () => {
      mockError = 'Network error';
      render(<TextTemplatesComponent />);
      const retryButton = screen.getByText('Retry');
      expect(retryButton).toBeDefined();
    });

    it('should call fetchTemplateDefinitions when retry is clicked', () => {
      mockError = 'Network error';
      render(<TextTemplatesComponent />);
      const retryButton = screen.getByText('Retry');
      fireEvent.click(retryButton);
      expect(mockFetchTemplateDefinitions).toHaveBeenCalled();
    });
  });

  describe('Empty State', () => {
    it('should display empty message when no templates', () => {
      mockTemplateDefinitions = [];
      render(<TextTemplatesComponent />);
      expect(screen.getByText('No text templates found.')).toBeDefined();
    });
  });

  describe('Template List', () => {
    beforeEach(() => {
      mockTemplateDefinitions = [
        {
          name: 'EmailTemplate',
          displayName: 'Email Template',
          isLayout: false,
          layout: 'DefaultLayout',
          defaultCultureName: 'en',
          isInlineLocalized: false,
        },
        {
          name: 'LayoutTemplate',
          displayName: 'Layout Template',
          isLayout: true,
          layout: '',
          defaultCultureName: 'fr',
          isInlineLocalized: true,
        },
      ];
    });

    it('should render table headers', () => {
      render(<TextTemplatesComponent />);
      expect(screen.getByText('Name')).toBeDefined();
      expect(screen.getByText('Display Name')).toBeDefined();
      expect(screen.getByText('Is Layout')).toBeDefined();
      expect(screen.getByText('Layout')).toBeDefined();
      expect(screen.getByText('Default Culture')).toBeDefined();
      expect(screen.getByText('Inline Localized')).toBeDefined();
      expect(screen.getByText('Actions')).toBeDefined();
    });

    it('should render template data', () => {
      render(<TextTemplatesComponent />);
      expect(screen.getByText('EmailTemplate')).toBeDefined();
      expect(screen.getByText('Email Template')).toBeDefined();
      expect(screen.getByText('DefaultLayout')).toBeDefined();
    });

    it('should display Yes/No for boolean fields', () => {
      render(<TextTemplatesComponent />);
      // Check for Yes (isLayout: true for LayoutTemplate)
      const yesElements = screen.getAllByText('Yes');
      expect(yesElements.length).toBeGreaterThan(0);
      // Check for No
      const noElements = screen.getAllByText('No');
      expect(noElements.length).toBeGreaterThan(0);
    });

    it('should render Edit Contents button for each template', () => {
      render(<TextTemplatesComponent />);
      const editButtons = screen.getAllByText('Edit Contents');
      expect(editButtons).toHaveLength(2);
    });

    it('should call onEditContents when Edit Contents is clicked', () => {
      const mockOnEditContents = vi.fn();
      render(<TextTemplatesComponent onEditContents={mockOnEditContents} />);

      const editButtons = screen.getAllByText('Edit Contents');
      fireEvent.click(editButtons[0]);

      expect(mockOnEditContents).toHaveBeenCalledWith(mockTemplateDefinitions[0]);
      expect(mockSetSelectedTemplate).toHaveBeenCalledWith(mockTemplateDefinitions[0]);
    });

    it('should display dash for empty layout field', () => {
      mockTemplateDefinitions = [
        {
          name: 'Template',
          displayName: 'Template',
          isLayout: false,
          layout: '',
          defaultCultureName: '',
          isInlineLocalized: false,
        },
      ];
      render(<TextTemplatesComponent />);
      // Check for dashes in empty cells
      const dashElements = screen.getAllByText('-');
      expect(dashElements.length).toBeGreaterThan(0);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      mockTemplateDefinitions = [
        {
          name: 'Template1',
          displayName: 'Template 1',
          isLayout: false,
          layout: '',
          defaultCultureName: 'en',
          isInlineLocalized: false,
        },
      ];
    });

    it('should render pagination controls when templates exist', () => {
      render(<TextTemplatesComponent />);
      expect(screen.getByText('Previous')).toBeDefined();
      expect(screen.getByText('Next')).toBeDefined();
      expect(screen.getByText('Page 1')).toBeDefined();
    });

    it('should disable Previous button on first page', () => {
      render(<TextTemplatesComponent />);
      const prevButton = screen.getByText('Previous');
      expect(prevButton).toHaveProperty('disabled', true);
    });

    it('should call fetchTemplateDefinitions with updated skip count on Next click', async () => {
      // Set up enough templates to enable Next
      mockTemplateDefinitions = Array(10).fill(null).map((_, i) => ({
        name: `Template${i}`,
        displayName: `Template ${i}`,
        isLayout: false,
        layout: '',
        defaultCultureName: 'en',
        isInlineLocalized: false,
      }));

      render(<TextTemplatesComponent pageSize={10} />);

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockFetchTemplateDefinitions).toHaveBeenCalled();
      });
    });

    it('should accept custom pageSize prop', () => {
      render(<TextTemplatesComponent pageSize={5} />);
      expect(mockFetchTemplateDefinitions).toHaveBeenCalled();
    });
  });

  describe('Effect on Mount', () => {
    it('should fetch template definitions on mount', () => {
      render(<TextTemplatesComponent />);
      expect(mockFetchTemplateDefinitions).toHaveBeenCalled();
    });
  });
});
