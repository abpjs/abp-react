/**
 * Tests for SettingLayout component
 * @abpjs/setting-management v0.9.0
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

// Define mocks before any imports that use them
const mockNavigate = vi.fn();
const mockLocation = { pathname: '/settings' };

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

// Import after mocks are set up
import { SettingLayout } from '../components/SettingLayout/SettingLayout';
import { getSettingManagementService, SettingManagementService } from '../services/setting-management.service';

// Helper to get a fresh service instance for isolated tests
function createTestService(): SettingManagementService {
  return new SettingManagementService();
}

describe('SettingLayout', () => {
  beforeEach(() => {
    // Clear service state and mocks before each test
    const service = getSettingManagementService();
    service.clearSettings();
    vi.clearAllMocks();
    mockLocation.pathname = '/settings';
  });

  describe('rendering', () => {
    it('should render the layout container', async () => {
      await act(async () => {
        render(<SettingLayout />);
      });
      expect(document.querySelector('.setting-layout')).toBeInTheDocument();
    });

    it('should render sidebar and content areas', async () => {
      await act(async () => {
        render(<SettingLayout />);
      });
      expect(document.querySelector('.setting-layout-sidebar')).toBeInTheDocument();
      expect(document.querySelector('.setting-layout-content')).toBeInTheDocument();
    });

    it('should render children in content area', async () => {
      await act(async () => {
        render(
          <SettingLayout>
            <div data-testid="child-content">Test Content</div>
          </SettingLayout>
        );
      });
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('should apply custom className', async () => {
      await act(async () => {
        render(<SettingLayout className="custom-class" />);
      });
      expect(document.querySelector('.setting-layout.custom-class')).toBeInTheDocument();
    });

    it('should render without tabs when no settings are registered', async () => {
      await act(async () => {
        render(<SettingLayout />);
      });
      expect(screen.queryAllByRole('button')).toHaveLength(0);
    });
  });

  describe('tab rendering with pre-populated service', () => {
    it('should render setting tabs', async () => {
      const service = getSettingManagementService();
      service.addSettings([
        { name: 'Account', order: 1 },
        { name: 'Security', order: 2 },
      ]);
      // Pre-select to avoid auto-selection loop
      service.setSelected(service.settings[0]);

      await act(async () => {
        render(<SettingLayout />);
      });

      expect(screen.getByText('Account')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
    });

    it('should render tabs sorted by order', async () => {
      const service = getSettingManagementService();
      service.addSettings([
        { name: 'Third', order: 30 },
        { name: 'First', order: 10 },
        { name: 'Second', order: 20 },
      ]);
      service.setSelected(service.settings[0]);

      await act(async () => {
        render(<SettingLayout />);
      });

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveTextContent('First');
      expect(buttons[1]).toHaveTextContent('Second');
      expect(buttons[2]).toHaveTextContent('Third');
    });

    it('should mark selected tab as active', async () => {
      const service = getSettingManagementService();
      service.addSettings([
        { name: 'Account', order: 1 },
        { name: 'Security', order: 2 },
      ]);
      service.selectByName('Security');

      await act(async () => {
        render(<SettingLayout />);
      });

      const securityButton = screen.getByText('Security');
      expect(securityButton).toHaveClass('active');
    });
  });

  describe('tab interactions', () => {
    it('should select tab on click', async () => {
      const service = getSettingManagementService();
      service.addSettings([
        { name: 'Account', order: 1 },
        { name: 'Security', order: 2 },
      ]);
      service.setSelected(service.settings[0]);

      await act(async () => {
        render(<SettingLayout />);
      });

      await act(async () => {
        fireEvent.click(screen.getByText('Security'));
      });

      expect(service.selected?.name).toBe('Security');
    });

    it('should call onTabSelect callback when tab is clicked', async () => {
      const service = getSettingManagementService();
      service.addSettings([
        { name: 'Account', order: 1 },
        { name: 'Security', order: 2 },
      ]);
      service.setSelected(service.settings[0]);

      const onTabSelect = vi.fn();

      await act(async () => {
        render(<SettingLayout onTabSelect={onTabSelect} />);
      });

      await act(async () => {
        fireEvent.click(screen.getByText('Security'));
      });

      expect(onTabSelect).toHaveBeenCalledTimes(1);
      expect(onTabSelect).toHaveBeenCalledWith(expect.objectContaining({ name: 'Security' }));
    });

    it('should navigate when tab with URL is clicked', async () => {
      const service = getSettingManagementService();
      service.addSettings([
        { name: 'Account', order: 1, url: '/settings/account' },
        { name: 'Security', order: 2, url: '/settings/security' },
      ]);
      service.setSelected(service.settings[0]);

      await act(async () => {
        render(<SettingLayout />);
      });

      await act(async () => {
        fireEvent.click(screen.getByText('Security'));
      });

      expect(mockNavigate).toHaveBeenCalledWith('/settings/security');
    });

    it('should not navigate when tab without URL is clicked', async () => {
      const service = getSettingManagementService();
      service.addSettings([
        { name: 'Account', order: 1 },
        { name: 'Security', order: 2 },
      ]);
      service.setSelected(service.settings[0]);

      await act(async () => {
        render(<SettingLayout />);
      });

      await act(async () => {
        fireEvent.click(screen.getByText('Security'));
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
