import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ManageProfile } from '../components/ManageProfile';

vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({ t: (key: string) => key }),
}));

vi.mock('../components/ChangePassword', () => ({
  ChangePassword: () => <div data-testid="change-password">ChangePassword Component</div>,
}));

vi.mock('../components/PersonalSettings', () => ({
  PersonalSettings: () => <div data-testid="personal-settings">PersonalSettings Component</div>,
}));

describe('ManageProfile', () => {
  it('should render the manage profile heading', () => {
    render(<ManageProfile />);
    expect(screen.getByText('AbpAccount::ManageYourProfile')).toBeInTheDocument();
  });

  it('should render tabs for personal settings and change password', () => {
    render(<ManageProfile />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByText('AbpAccount::PersonalSettings')).toBeInTheDocument();
    expect(screen.getByText('AbpAccount::ChangePassword')).toBeInTheDocument();
  });

  it('should render PersonalSettings component', () => {
    render(<ManageProfile />);
    expect(screen.getByTestId('personal-settings')).toBeInTheDocument();
  });

  it('should render ChangePassword component', () => {
    render(<ManageProfile />);
    expect(screen.getByTestId('change-password')).toBeInTheDocument();
  });

  it('should use personal-settings as default tab', () => {
    render(<ManageProfile />);
    const tabsRoot = screen.getByRole('tablist').parentElement;
    expect(tabsRoot).toHaveAttribute('data-value', 'personal-settings');
  });

  it('should accept change-password as default tab', () => {
    render(<ManageProfile defaultTab="change-password" />);
    const tabsRoot = screen.getByRole('tablist').parentElement;
    expect(tabsRoot).toHaveAttribute('data-value', 'change-password');
  });
});
