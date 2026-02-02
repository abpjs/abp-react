import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ErrorComponent } from '../components/errors/ErrorComponent';
import { abpSystem } from '../theme';

/**
 * Tests for ErrorComponent.tsx
 * @since 2.7.0 - Added tests for isHomeShow, onHomeClick, homeButtonText
 */

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={abpSystem}>{children}</ChakraProvider>
);

describe('ErrorComponent', () => {
  describe('Basic rendering', () => {
    it('should render with default props', () => {
      render(
        <Wrapper>
          <ErrorComponent />
        </Wrapper>
      );

      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('An error has occurred.')).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      render(
        <Wrapper>
          <ErrorComponent title="404" />
        </Wrapper>
      );

      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should render with custom details', () => {
      render(
        <Wrapper>
          <ErrorComponent details="Page not found." />
        </Wrapper>
      );

      expect(screen.getByText('Page not found.')).toBeInTheDocument();
    });

    it('should render with custom title and details', () => {
      render(
        <Wrapper>
          <ErrorComponent title="500" details="Internal server error." />
        </Wrapper>
      );

      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('Internal server error.')).toBeInTheDocument();
    });
  });

  describe('Close button', () => {
    it('should show close button by default when onDestroy is provided', () => {
      const onDestroy = vi.fn();
      render(
        <Wrapper>
          <ErrorComponent onDestroy={onDestroy} />
        </Wrapper>
      );

      expect(screen.getByText('Go Back')).toBeInTheDocument();
    });

    it('should not show close button when showCloseButton is false', () => {
      const onDestroy = vi.fn();
      render(
        <Wrapper>
          <ErrorComponent onDestroy={onDestroy} showCloseButton={false} />
        </Wrapper>
      );

      expect(screen.queryByText('Go Back')).not.toBeInTheDocument();
    });

    it('should not show close button when onDestroy is not provided', () => {
      render(
        <Wrapper>
          <ErrorComponent showCloseButton={true} />
        </Wrapper>
      );

      expect(screen.queryByText('Go Back')).not.toBeInTheDocument();
    });

    it('should call onDestroy when close button is clicked', () => {
      const onDestroy = vi.fn();
      render(
        <Wrapper>
          <ErrorComponent onDestroy={onDestroy} />
        </Wrapper>
      );

      fireEvent.click(screen.getByText('Go Back'));

      expect(onDestroy).toHaveBeenCalledTimes(1);
    });

    it('should render custom close button text', () => {
      const onDestroy = vi.fn();
      render(
        <Wrapper>
          <ErrorComponent onDestroy={onDestroy} closeButtonText="Dismiss" />
        </Wrapper>
      );

      expect(screen.getByText('Dismiss')).toBeInTheDocument();
    });
  });

  describe('Home button (v2.7.0)', () => {
    it('should not show home button by default', () => {
      render(
        <Wrapper>
          <ErrorComponent />
        </Wrapper>
      );

      expect(screen.queryByText('Go Home')).not.toBeInTheDocument();
    });

    it('should show home button when isHomeShow is true and onHomeClick is provided', () => {
      const onHomeClick = vi.fn();
      render(
        <Wrapper>
          <ErrorComponent isHomeShow={true} onHomeClick={onHomeClick} />
        </Wrapper>
      );

      expect(screen.getByText('Go Home')).toBeInTheDocument();
    });

    it('should not show home button when isHomeShow is true but onHomeClick is not provided', () => {
      render(
        <Wrapper>
          <ErrorComponent isHomeShow={true} />
        </Wrapper>
      );

      expect(screen.queryByText('Go Home')).not.toBeInTheDocument();
    });

    it('should not show home button when isHomeShow is false', () => {
      const onHomeClick = vi.fn();
      render(
        <Wrapper>
          <ErrorComponent isHomeShow={false} onHomeClick={onHomeClick} />
        </Wrapper>
      );

      expect(screen.queryByText('Go Home')).not.toBeInTheDocument();
    });

    it('should call onHomeClick when home button is clicked', () => {
      const onHomeClick = vi.fn();
      render(
        <Wrapper>
          <ErrorComponent isHomeShow={true} onHomeClick={onHomeClick} />
        </Wrapper>
      );

      fireEvent.click(screen.getByText('Go Home'));

      expect(onHomeClick).toHaveBeenCalledTimes(1);
    });

    it('should render custom home button text', () => {
      const onHomeClick = vi.fn();
      render(
        <Wrapper>
          <ErrorComponent
            isHomeShow={true}
            onHomeClick={onHomeClick}
            homeButtonText="Return to Homepage"
          />
        </Wrapper>
      );

      expect(screen.getByText('Return to Homepage')).toBeInTheDocument();
    });

    it('should show both home and close buttons together', () => {
      const onHomeClick = vi.fn();
      const onDestroy = vi.fn();
      render(
        <Wrapper>
          <ErrorComponent
            isHomeShow={true}
            onHomeClick={onHomeClick}
            onDestroy={onDestroy}
          />
        </Wrapper>
      );

      expect(screen.getByText('Go Home')).toBeInTheDocument();
      expect(screen.getByText('Go Back')).toBeInTheDocument();
    });

    it('should handle both button clicks independently', () => {
      const onHomeClick = vi.fn();
      const onDestroy = vi.fn();
      render(
        <Wrapper>
          <ErrorComponent
            isHomeShow={true}
            onHomeClick={onHomeClick}
            onDestroy={onDestroy}
          />
        </Wrapper>
      );

      fireEvent.click(screen.getByText('Go Home'));
      expect(onHomeClick).toHaveBeenCalledTimes(1);
      expect(onDestroy).not.toHaveBeenCalled();

      fireEvent.click(screen.getByText('Go Back'));
      expect(onHomeClick).toHaveBeenCalledTimes(1);
      expect(onDestroy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty strings for title and details', () => {
      render(
        <Wrapper>
          <ErrorComponent title="" details="" />
        </Wrapper>
      );

      // Component should still render without errors
      expect(document.body).toBeInTheDocument();
    });

    it('should handle long text in title and details', () => {
      const longTitle = 'Error: Something went terribly wrong with the application';
      const longDetails =
        'This is a very long error message that describes what went wrong in great detail. ' +
        'It might span multiple lines and contain a lot of information for the user to understand ' +
        'what happened and what they can do about it.';

      render(
        <Wrapper>
          <ErrorComponent title={longTitle} details={longDetails} />
        </Wrapper>
      );

      expect(screen.getByText(longTitle)).toBeInTheDocument();
      expect(screen.getByText(longDetails)).toBeInTheDocument();
    });

    it('should handle all props together', () => {
      const onHomeClick = vi.fn();
      const onDestroy = vi.fn();

      render(
        <Wrapper>
          <ErrorComponent
            title="503"
            details="Service temporarily unavailable."
            showCloseButton={true}
            closeButtonText="Try Again"
            isHomeShow={true}
            onHomeClick={onHomeClick}
            homeButtonText="Go to Dashboard"
            onDestroy={onDestroy}
          />
        </Wrapper>
      );

      expect(screen.getByText('503')).toBeInTheDocument();
      expect(screen.getByText('Service temporarily unavailable.')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    });
  });
});
