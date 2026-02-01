/**
 * Test page for @abpjs/theme-shared package
 * Tests: Toaster, Confirmation dialogs, Modal, Error handler, LoaderBar, ErrorComponent
 * @since 0.9.0
 * @updated 2.2.0 - Dependency updates and cleanup (no new features)
 * @updated 2.4.0 - THEME_SHARED_APPEND_CONTENT token, Toaster.Status deprecation update
 */
import { useState, useContext } from 'react'
import {
  useToaster,
  useConfirmation,
  useErrorHandler,
  Modal,
  Confirmation,
  LoaderBar,
  ErrorComponent,
  ChangePassword,
  Profile,
  // v2.4.0: New append content token and context
  THEME_SHARED_APPEND_CONTENT,
  ThemeSharedAppendContentContext,
  // v2.1.0: Deprecated in favor of Confirmation.Status (removal now in v3.0 per v2.4.0)
  Toaster,
} from '@abpjs/theme-shared'
import { useAbp, useAuth } from '@abpjs/core'

/**
 * v2.4.0 Features Section
 * Demonstrates:
 * - THEME_SHARED_APPEND_CONTENT token
 * - ThemeSharedAppendContentContext
 * - Toaster.Status deprecation update (removal in v3.0)
 */
function TestV240Features() {
  const [appendCalled, setAppendCalled] = useState(false)
  const [customAppendResult, setCustomAppendResult] = useState<string | null>(null)

  // Demonstrate accessing context value (will be undefined without provider)
  const appendContentFromContext = useContext(ThemeSharedAppendContentContext)

  // Custom append function for demo
  const customAppendContent = async () => {
    setCustomAppendResult('Appending content...')
    await new Promise(resolve => setTimeout(resolve, 500))
    setCustomAppendResult('Content appended successfully!')
    setAppendCalled(true)
  }

  // Demonstrate Toaster.Status deprecation (still works but deprecated)
  const demonstrateDeprecatedStatus = () => {
    // These still work but are deprecated in favor of Confirmation.Status
    const confirmStatus = Toaster.Status.confirm
    const rejectStatus = Toaster.Status.reject
    const dismissStatus = Toaster.Status.dismiss
    return { confirmStatus, rejectStatus, dismissStatus }
  }

  const deprecatedStatuses = demonstrateDeprecatedStatus()

  return (
    <div className="test-section">
      <h2>v2.4.0 New Features</h2>

      <div className="test-card">
        <h3>THEME_SHARED_APPEND_CONTENT Token</h3>
        <p>New token for content appending functionality (React equivalent of Angular InjectionToken).</p>
        <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#222', borderRadius: '4px', fontSize: '0.85rem' }}>
          <code style={{ color: '#6cf' }}>THEME_SHARED_APPEND_CONTENT</code> = "{THEME_SHARED_APPEND_CONTENT}"
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#888' }}>
          This token name matches the Angular InjectionToken for compatibility.
        </p>
      </div>

      <div className="test-card">
        <h3>ThemeSharedAppendContentContext</h3>
        <p>React Context for providing custom content appending logic.</p>
        <p style={{ fontSize: '0.85rem', color: '#888' }}>
          Default value: <code>{appendContentFromContext === undefined ? 'undefined' : 'defined'}</code>
        </p>
        <div style={{ marginTop: '0.75rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Demo with custom provider:</p>
          <ThemeSharedAppendContentContext.Provider value={customAppendContent}>
            <AppendContentDemo
              appendCalled={appendCalled}
              result={customAppendResult}
            />
          </ThemeSharedAppendContentContext.Provider>
        </div>
      </div>

      <div className="test-card">
        <h3>Toaster.Status Deprecation Update</h3>
        <p>
          <code>Toaster.Status</code> deprecation notice updated: will be removed in <strong>v3.0</strong> (was v2.2).
        </p>
        <p style={{ fontSize: '0.85rem', color: '#f88', marginTop: '0.5rem' }}>
          Use <code>Confirmation.Status</code> instead of <code>Toaster.Status</code>.
        </p>
        <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#222', borderRadius: '4px', fontSize: '0.85rem' }}>
          <p style={{ marginBottom: '0.25rem' }}>Deprecated values (still work until v3.0):</p>
          <code style={{ color: '#fc6' }}>Toaster.Status.confirm</code> = "{deprecatedStatuses.confirmStatus}"<br />
          <code style={{ color: '#fc6' }}>Toaster.Status.reject</code> = "{deprecatedStatuses.rejectStatus}"<br />
          <code style={{ color: '#fc6' }}>Toaster.Status.dismiss</code> = "{deprecatedStatuses.dismissStatus}"
        </div>
        <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#6f6' }}>
          Migration: Replace <code>Toaster.Status</code> with <code>Confirmation.Status</code>
        </p>
      </div>

      <div className="test-card">
        <h3>appendScript Deprecation Notice</h3>
        <p style={{ color: '#f88' }}>
          The <code>appendScript</code> function is deprecated and will be deleted in v2.6.
        </p>
        <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>
          Use the <code>ThemeSharedAppendContentContext</code> with a custom append function instead.
        </p>
      </div>
    </div>
  )
}

// Helper component for demonstrating ThemeSharedAppendContentContext usage
function AppendContentDemo({
  appendCalled,
  result,
}: {
  appendCalled: boolean
  result: string | null
}) {
  const appendContent = useContext(ThemeSharedAppendContentContext)

  const handleAppend = async () => {
    if (appendContent) {
      await appendContent()
    }
  }

  return (
    <div style={{ padding: '0.5rem', border: '1px solid #444', borderRadius: '4px' }}>
      <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
        Context value: <code>{appendContent ? 'function provided' : 'undefined'}</code>
      </p>
      <button onClick={handleAppend} disabled={!appendContent}>
        Call appendContent()
      </button>
      {result && (
        <p style={{ marginTop: '0.5rem', color: appendCalled ? '#6f6' : '#6cf', fontSize: '0.85rem' }}>
          {result}
        </p>
      )}
    </div>
  )
}

function TestLoaderBar() {
  const { restService } = useAbp()
  const [showLoaderBar, setShowLoaderBar] = useState(true)
  // v1.1.0: New intervalPeriod and stopDelay props
  const [intervalPeriod, setIntervalPeriod] = useState(300)
  const [stopDelay, setStopDelay] = useState(400)

  const triggerLoading = async () => {
    try {
      // This will trigger the loader bar via the API interceptor
      await restService.get('/api/abp/application-configuration')
    } catch (err) {
      console.log('API call completed')
    }
  }

  const triggerMultipleLoads = async () => {
    try {
      await Promise.all([
        restService.get('/api/abp/application-configuration'),
        restService.get('/api/abp/application-configuration'),
        restService.get('/api/abp/application-configuration'),
      ])
    } catch (err) {
      console.log('API calls completed')
    }
  }

  return (
    <div className="test-section">
      <h2>LoaderBar Component</h2>

      {showLoaderBar && (
        <LoaderBar
          intervalPeriod={intervalPeriod}
          stopDelay={stopDelay}
        />
      )}

      <div className="test-card">
        <h3>Loading Progress Bar</h3>
        <p>The LoaderBar shows a progress bar at the top of the page during HTTP requests.</p>
        <p>It automatically listens to LoaderStart/LoaderStop actions dispatched by the API interceptor.</p>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              type="checkbox"
              checked={showLoaderBar}
              onChange={(e) => setShowLoaderBar(e.target.checked)}
            />
            {' '}Show LoaderBar
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={triggerLoading}>
            Trigger Single API Call
          </button>
          <button onClick={triggerMultipleLoads}>
            Trigger 3 Concurrent Calls
          </button>
        </div>
        <p style={{ marginTop: '0.5rem', color: '#888', fontSize: '0.85rem' }}>
          Watch the blue progress bar at the top of the page when clicking the buttons.
        </p>
      </div>

      <div className="test-card">
        <h3>v1.1.0: intervalPeriod & stopDelay Props</h3>
        <p>Control the animation timing of the progress bar.</p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            intervalPeriod (animation interval, default: 300ms):{' '}
            <input
              type="number"
              value={intervalPeriod}
              onChange={(e) => setIntervalPeriod(Number(e.target.value))}
              min={50}
              max={1000}
              step={50}
              style={{ padding: '0.25rem', marginLeft: '0.5rem', width: '80px' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            stopDelay (hide delay after loading, default: 400ms):{' '}
            <input
              type="number"
              value={stopDelay}
              onChange={(e) => setStopDelay(Number(e.target.value))}
              min={0}
              max={2000}
              step={100}
              style={{ padding: '0.25rem', marginLeft: '0.5rem', width: '80px' }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => { setIntervalPeriod(100); setStopDelay(200); }}>
            Fast Animation
          </button>
          <button onClick={() => { setIntervalPeriod(300); setStopDelay(400); }}>
            Default Settings
          </button>
          <button onClick={() => { setIntervalPeriod(500); setStopDelay(1000); }}>
            Slow Animation
          </button>
        </div>
        <p style={{ marginTop: '0.5rem', color: '#888', fontSize: '0.85rem' }}>
          Trigger an API call after changing settings to see the difference.
        </p>
      </div>
    </div>
  )
}

function TestErrorComponentDisplay() {
  const [showError, setShowError] = useState(false)
  const [errorTitle, setErrorTitle] = useState('404')
  const [errorDetails, setErrorDetails] = useState('The page you are looking for was not found.')

  const errorPresets = [
    { title: '404', details: 'The page you are looking for was not found.' },
    { title: '500', details: 'An internal server error occurred. Please try again later.' },
    { title: '403', details: 'You do not have permission to access this resource.' },
    { title: 'Error', details: 'Something went wrong. Please contact support.' },
  ]

  return (
    <div className="test-section">
      <h2>ErrorComponent</h2>

      <div className="test-card">
        <h3>Error Display Component</h3>
        <p>The ErrorComponent is used for displaying full-page error states.</p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Error Title:{' '}
            <input
              type="text"
              value={errorTitle}
              onChange={(e) => setErrorTitle(e.target.value)}
              style={{ padding: '0.25rem', marginLeft: '0.5rem' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Error Details:{' '}
            <input
              type="text"
              value={errorDetails}
              onChange={(e) => setErrorDetails(e.target.value)}
              style={{ padding: '0.25rem', marginLeft: '0.5rem', width: '300px' }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {errorPresets.map((preset) => (
            <button
              key={preset.title}
              onClick={() => {
                setErrorTitle(preset.title)
                setErrorDetails(preset.details)
                setShowError(true)
              }}
            >
              Show {preset.title} Error
            </button>
          ))}
        </div>

        <button onClick={() => setShowError(!showError)}>
          {showError ? 'Hide' : 'Show'} Error Component
        </button>

        {showError && (
          <div style={{ marginTop: '1rem', border: '1px solid #333', borderRadius: '8px', padding: '1rem' }}>
            <ErrorComponent
              title={errorTitle}
              details={errorDetails}
              showCloseButton
              onDestroy={() => setShowError(false)}
              closeButtonText="Dismiss"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function TestToaster() {
  const toaster = useToaster()
  const [lastToastId, setLastToastId] = useState<number | null>(null)

  const showSuccessToast = () => {
    const id = toaster.success('Operation completed successfully!', 'Success')
    setLastToastId(id)
  }

  const showInfoToast = () => {
    const id = toaster.info('Here is some information for you.', 'Info')
    setLastToastId(id)
  }

  const showWarningToast = () => {
    const id = toaster.warn('Please be careful with this action.', 'Warning')
    setLastToastId(id)
  }

  const showErrorToast = () => {
    const id = toaster.error('Something went wrong!', 'Error')
    setLastToastId(id)
  }

  const showStickyToast = () => {
    const id = toaster.info('This toast will stay until you close it.', 'Sticky Toast', { sticky: true })
    setLastToastId(id)
  }

  const showMultipleToasts = () => {
    toaster.success('First toast', 'Success')
    setTimeout(() => toaster.info('Second toast', 'Info'), 300)
    setTimeout(() => toaster.warn('Third toast', 'Warning'), 600)
  }

  // v1.1.0: LocalizationParam support for message and title
  const showLocalizationParamToast = () => {
    const id = toaster.success(
      { key: 'AbpUi::Success', defaultValue: 'Operation completed successfully!' },
      { key: 'AbpUi::SuccessTitle', defaultValue: 'Success' }
    )
    setLastToastId(id)
  }

  const showMixedParamToast = () => {
    // Mix of string and LocalizationParam
    const id = toaster.info(
      { key: 'AbpUi::Info', defaultValue: 'This message uses LocalizationParam' },
      'Plain String Title'
    )
    setLastToastId(id)
  }

  // v2.0.0: show() method with severity parameter
  const showNeutralToast = () => {
    const id = toaster.show('This is a neutral message.', 'Neutral', 'neutral', { sticky: true })
    setLastToastId(id)
  }

  // v2.0.0: remove() method to manually dismiss a toast
  const removeLastToast = () => {
    if (lastToastId !== null) {
      toaster.remove(lastToastId)
      setLastToastId(null)
    }
  }

  // v2.0.0: clear() with optional containerKey
  const clearAllToasts = () => {
    toaster.clear()
    setLastToastId(null)
  }

  return (
    <div className="test-section">
      <h2>Toast Notifications (useToaster)</h2>

      <div className="test-card">
        <h3>Basic Toasts</h3>
        <p>Click buttons to show different toast types:</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={showSuccessToast}>Success Toast</button>
          <button onClick={showInfoToast}>Info Toast</button>
          <button onClick={showWarningToast}>Warning Toast</button>
          <button onClick={showErrorToast}>Error Toast</button>
        </div>
        {lastToastId !== null && (
          <p style={{ marginTop: '0.5rem', color: '#888', fontSize: '0.85rem' }}>
            Last toast ID: {lastToastId}
          </p>
        )}
      </div>

      <div className="test-card">
        <h3>Advanced Toasts</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={showStickyToast}>Sticky Toast (no auto-dismiss)</button>
          <button onClick={showMultipleToasts}>Show Multiple Toasts</button>
        </div>
      </div>

      <div className="test-card">
        <h3>v1.1.0: LocalizationParam Support</h3>
        <p>Toaster now accepts <code>LocalizationParam</code> objects with <code>key</code> and <code>defaultValue</code>.</p>
        <p style={{ fontSize: '0.85rem', color: '#888' }}>
          This allows for easier localization by providing a fallback value when the key is not found.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <button onClick={showLocalizationParamToast}>LocalizationParam (both)</button>
          <button onClick={showMixedParamToast}>Mixed (object + string)</button>
        </div>
      </div>

      <div className="test-card">
        <h3>v2.0.0: New Features</h3>
        <p>New <code>show()</code> method with severity parameter, <code>remove()</code> to dismiss by ID, <code>neutral</code> severity.</p>
        <p style={{ fontSize: '0.85rem', color: '#888' }}>
          Methods now return a numeric toast ID instead of a Promise, enabling manual removal.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <button onClick={showNeutralToast}>Neutral Toast (v2.0.0)</button>
          <button onClick={removeLastToast} disabled={lastToastId === null}>
            Remove Last Toast
          </button>
          <button onClick={clearAllToasts}>Clear All Toasts</button>
        </div>
      </div>
    </div>
  )
}

function TestConfirmation() {
  const confirmation = useConfirmation()
  const [confirmResult, setConfirmResult] = useState<string | null>(null)
  const [escapeEnabled, setEscapeEnabled] = useState(false)

  // v2.1.0: Now uses Confirmation.Status instead of Toaster.Status
  const showConfirmation = async () => {
    setConfirmResult(null)
    const status = await confirmation.warn(
      'Are you sure you want to proceed with this action?',
      'Confirm Action'
    )
    setConfirmResult(status === Confirmation.Status.confirm ? 'Confirmed!' : status === Confirmation.Status.reject ? 'Cancelled' : 'Dismissed')
  }

  // v2.0.0: yesCopy/cancelCopy removed, use yesText/cancelText instead
  const showDeleteConfirmation = async () => {
    setConfirmResult(null)
    const status = await confirmation.error(
      'This action cannot be undone. Are you sure you want to delete this item?',
      'Delete Confirmation',
      { yesText: 'Delete', cancelText: 'Keep' }
    )
    setConfirmResult(status === Confirmation.Status.confirm ? 'Item deleted!' : 'Deletion cancelled')
  }

  // v1.1.0: New cancelText and yesText props
  const showV110Confirmation = async () => {
    setConfirmResult(null)
    const status = await confirmation.warn(
      'This uses the yesText and cancelText props.',
      'Custom Button Text',
      {
        yesText: 'Proceed',
        cancelText: 'Go Back'
      }
    )
    setConfirmResult(status === Confirmation.Status.confirm ? 'Proceeded!' : 'Went back')
  }

  // v1.1.0: LocalizationParam support for cancelText/yesText
  const showLocalizationParamConfirmation = async () => {
    setConfirmResult(null)
    const status = await confirmation.info(
      'This uses LocalizationParam objects with key and defaultValue.',
      'LocalizationParam Demo',
      {
        yesText: { key: 'AbpUi::Yes', defaultValue: 'Yes (Default)' },
        cancelText: { key: 'AbpUi::No', defaultValue: 'No (Default)' }
      }
    )
    setConfirmResult(status === Confirmation.Status.confirm ? 'Yes selected!' : 'No selected')
  }

  // v2.0.0: yesCopy removed, use yesText
  const showInfoConfirmation = async () => {
    setConfirmResult(null)
    const status = await confirmation.info(
      'Your changes have been saved successfully.',
      'Saved',
      { hideCancelBtn: true, yesText: 'OK' }
    )
    setConfirmResult(status === Confirmation.Status.confirm ? 'Acknowledged' : 'Dismissed')
  }

  const showSuccessConfirmation = async () => {
    setConfirmResult(null)
    const status = await confirmation.success(
      'Your operation was completed successfully!',
      'Success'
    )
    setConfirmResult(status === Confirmation.Status.confirm ? 'Confirmed' : 'Dismissed')
  }

  // v2.0.0: show() method with severity parameter
  const showNeutralConfirmation = async () => {
    setConfirmResult(null)
    const status = await confirmation.show(
      'This is a neutral confirmation with no specific severity.',
      'Neutral Confirmation',
      'neutral'
    )
    setConfirmResult(status === Confirmation.Status.confirm ? 'Confirmed!' : 'Dismissed')
  }

  // v2.0.0: listenToEscape() method
  const enableEscapeKey = () => {
    confirmation.listenToEscape()
    setEscapeEnabled(true)
  }

  // v2.0.0: clear() method
  const clearConfirmation = () => {
    confirmation.clear()
    setConfirmResult('Cleared programmatically')
  }

  // v2.1.0: Demonstrate all three Status values
  const showV210StatusDemo = async () => {
    setConfirmResult(null)
    const status = await confirmation.warn(
      'This demo shows all Confirmation.Status values. Click Yes, Cancel, or click outside/press Escape.',
      'v2.1.0 Status Demo'
    )
    // Demonstrate the new Confirmation.Status enum
    switch (status) {
      case Confirmation.Status.confirm:
        setConfirmResult('Status: Confirmation.Status.confirm')
        break
      case Confirmation.Status.reject:
        setConfirmResult('Status: Confirmation.Status.reject')
        break
      case Confirmation.Status.dismiss:
        setConfirmResult('Status: Confirmation.Status.dismiss')
        break
    }
  }

  return (
    <div className="test-section">
      <h2>Confirmation Dialogs (useConfirmation)</h2>

      <div className="test-card">
        <h3>Confirmation Types</h3>
        <p>Click buttons to show different confirmation dialogs:</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={showConfirmation}>Warning Confirmation</button>
          <button onClick={showDeleteConfirmation}>Delete Confirmation</button>
          <button onClick={showInfoConfirmation}>Info (OK only)</button>
          <button onClick={showSuccessConfirmation}>Success Confirmation</button>
        </div>
        {confirmResult && (
          <p style={{ marginTop: '0.5rem', color: confirmResult.includes('!') || confirmResult.includes('confirm') ? '#6f6' : '#f88' }}>
            Result: {confirmResult}
          </p>
        )}
      </div>

      <div className="test-card">
        <h3>v1.1.0: cancelText & yesText Props</h3>
        <p>Props for custom button text. Also support <code>LocalizationParam</code> objects.</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <button onClick={showV110Confirmation}>yesText/cancelText (strings)</button>
          <button onClick={showLocalizationParamConfirmation}>LocalizationParam objects</button>
        </div>
      </div>

      <div className="test-card">
        <h3>v2.0.0: New Features</h3>
        <p>New <code>show()</code> method, <code>neutral</code> severity, <code>listenToEscape()</code>, <code>clear()</code>.</p>
        <p style={{ fontSize: '0.85rem', color: '#888' }}>
          Note: <code>yesCopy</code> and <code>cancelCopy</code> have been removed. Use <code>yesText</code> and <code>cancelText</code>.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <button onClick={showNeutralConfirmation}>Neutral Confirmation</button>
          <button onClick={enableEscapeKey} disabled={escapeEnabled}>
            {escapeEnabled ? 'Escape Enabled' : 'Enable Escape Key'}
          </button>
          <button onClick={clearConfirmation}>Clear (dismiss)</button>
        </div>
        {escapeEnabled && (
          <p style={{ marginTop: '0.5rem', color: '#6f6', fontSize: '0.85rem' }}>
            Escape key listener enabled. Press Escape to dismiss open confirmations.
          </p>
        )}
      </div>

      <div className="test-card">
        <h3>v2.1.0: Confirmation.Status Enum</h3>
        <p>Confirmation methods now return <code>Confirmation.Status</code> instead of <code>Toaster.Status</code>.</p>
        <p style={{ fontSize: '0.85rem', color: '#888' }}>
          <code>Toaster.Status</code> is deprecated and will be removed in v3.0 (updated in v2.4.0). The values are: <code>confirm</code>, <code>reject</code>, <code>dismiss</code>.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <button onClick={showV210StatusDemo}>Test Confirmation.Status</button>
        </div>
        <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#222', borderRadius: '4px', fontSize: '0.85rem' }}>
          <code style={{ color: '#6cf' }}>Confirmation.Status.confirm</code> - User clicked Yes/OK<br />
          <code style={{ color: '#fc6' }}>Confirmation.Status.reject</code> - User clicked Cancel/No<br />
          <code style={{ color: '#888' }}>Confirmation.Status.dismiss</code> - User dismissed (Escape/overlay)
        </div>
      </div>
    </div>
  )
}

function TestErrorHandler() {
  const errorHandler = useErrorHandler()

  const simulateHttpError = async () => {
    await errorHandler.showError('This is a simulated error message from the error handler.', 'Simulated Error')
  }

  const simulate404Error = async () => {
    await errorHandler.handleError({
      status: 404,
      statusText: 'Not Found',
      error: {
        error: {
          message: 'The requested resource was not found.',
        },
      },
    })
  }

  const simulate500Error = async () => {
    await errorHandler.handleError({
      status: 500,
      statusText: 'Internal Server Error',
      error: {
        error: {
          message: 'An unexpected error occurred on the server.',
        },
      },
    })
  }

  return (
    <div className="test-section">
      <h2>Error Handler (useErrorHandler)</h2>

      <div className="test-card">
        <h3>Test Error Dialogs</h3>
        <p>Simulate different HTTP errors:</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={simulateHttpError}>Show Error Dialog</button>
          <button onClick={simulate404Error}>Simulate 404 Error</button>
          <button onClick={simulate500Error}>Simulate 500 Error</button>
        </div>
      </div>
    </div>
  )
}

function TestModal() {
  const toaster = useToaster()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md')

  return (
    <div className="test-section">
      <h2>Modal Component</h2>

      <div className="test-card">
        <h3>Modal Sizes</h3>
        <p>Test different modal sizes:</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => { setModalSize('sm'); setModalVisible(true); }}>Small Modal</button>
          <button onClick={() => { setModalSize('md'); setModalVisible(true); }}>Medium Modal</button>
          <button onClick={() => { setModalSize('lg'); setModalVisible(true); }}>Large Modal</button>
          <button onClick={() => { setModalSize('xl'); setModalVisible(true); }}>XL Modal</button>
        </div>

        <Modal
          visible={modalVisible}
          onVisibleChange={setModalVisible}
          size={modalSize}
          header={`Test Modal (${modalSize.toUpperCase()})`}
          footer={
            <>
              <button
                onClick={() => setModalVisible(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #666', background: 'transparent', color: '#aaa', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toaster.success('Modal action completed!', 'Success')
                  setModalVisible(false)
                }}
                style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: '#646cff', color: 'white', cursor: 'pointer' }}
              >
                Confirm
              </button>
            </>
          }
        >
          <p>This is a modal dialog using Chakra UI v3.</p>
          <p>Current size: <strong>{modalSize}</strong></p>
          <p>It supports:</p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Custom header, body, and footer</li>
            <li>Different sizes (sm, md, lg, xl)</li>
            <li>Close on overlay click (configurable)</li>
            <li>Close on Escape key (configurable)</li>
            <li>Animations</li>
          </ul>
        </Modal>
      </div>
    </div>
  )
}

function TestModalV090() {
  const toaster = useToaster()
  const [busyModalVisible, setBusyModalVisible] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [heightModalVisible, setHeightModalVisible] = useState(false)
  const [initCount, setInitCount] = useState(0)

  const handleBusySubmit = async () => {
    setIsBusy(true)
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsBusy(false)
    toaster.success('Operation completed!', 'Success')
    setBusyModalVisible(false)
  }

  return (
    <div className="test-section">
      <h2>Modal Advanced Features</h2>

      <div className="test-card">
        <h3>Busy State (prevents closing)</h3>
        <p>When <code>busy=true</code>, the modal cannot be closed via overlay click, Escape, or close button.</p>
        <button onClick={() => setBusyModalVisible(true)}>Open Busy Modal Demo</button>

        <Modal
          visible={busyModalVisible}
          onVisibleChange={setBusyModalVisible}
          busy={isBusy}
          header="Busy Modal Demo"
          footer={
            <>
              <button
                onClick={() => setBusyModalVisible(false)}
                disabled={isBusy}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  border: '1px solid #666',
                  background: 'transparent',
                  color: isBusy ? '#666' : '#aaa',
                  cursor: isBusy ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleBusySubmit}
                disabled={isBusy}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  border: 'none',
                  background: isBusy ? '#444' : '#646cff',
                  color: 'white',
                  cursor: isBusy ? 'not-allowed' : 'pointer'
                }}
              >
                {isBusy ? 'Saving...' : 'Save'}
              </button>
            </>
          }
        >
          <p>Click "Save" to simulate a 2-second operation.</p>
          <p>During this time, you <strong>cannot close</strong> the modal (try clicking outside or pressing Escape).</p>
          <p style={{ marginTop: '1rem', color: isBusy ? '#f88' : '#888' }}>
            Busy state: <strong>{isBusy ? 'Yes (locked)' : 'No'}</strong>
          </p>
        </Modal>
      </div>

      <div className="test-card">
        <h3>Height & onInit Props</h3>
        <p>Test <code>height</code>, <code>minHeight</code>, and <code>onInit</code> callback.</p>
        <p>onInit fired: <strong>{initCount}</strong> times</p>
        <button onClick={() => setHeightModalVisible(true)}>Open Height Demo Modal</button>

        <Modal
          visible={heightModalVisible}
          onVisibleChange={setHeightModalVisible}
          minHeight={300}
          onInit={() => {
            setInitCount(prev => prev + 1)
            console.log('Modal initialized!')
          }}
          header="Height Demo Modal"
          footer={
            <button
              onClick={() => setHeightModalVisible(false)}
              style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: '#646cff', color: 'white', cursor: 'pointer' }}
            >
              Close
            </button>
          }
        >
          <p>This modal has <code>minHeight={'{300}'}</code> set.</p>
          <p>The <code>onInit</code> callback fires each time the modal opens.</p>
          <p style={{ marginTop: '1rem', color: '#888' }}>
            Check the console for "Modal initialized!" message.
          </p>
        </Modal>
      </div>
    </div>
  )
}

function TestChangePassword() {
  const { isAuthenticated } = useAuth()
  const [visible, setVisible] = useState(false)

  return (
    <div className="test-section">
      <h2>ChangePassword Component</h2>

      {!isAuthenticated ? (
        <div className="test-card">
          <p style={{ color: '#f88' }}>
            You must be authenticated to test the ChangePassword component
          </p>
        </div>
      ) : (
        <div className="test-card">
          <h3>Change Password Modal</h3>
          <p>Opens a modal for changing the current user's password.</p>
          <p style={{ fontSize: '14px', color: '#888' }}>
            The component handles success/error notifications internally.
          </p>
          <button onClick={() => setVisible(true)}>Open Change Password</button>

          <ChangePassword
            visible={visible}
            onVisibleChange={setVisible}
          />
        </div>
      )}
    </div>
  )
}

function TestProfile() {
  const { isAuthenticated } = useAuth()
  const [visible, setVisible] = useState(false)

  return (
    <div className="test-section">
      <h2>Profile Component</h2>

      {!isAuthenticated ? (
        <div className="test-card">
          <p style={{ color: '#f88' }}>
            You must be authenticated to test the Profile component
          </p>
        </div>
      ) : (
        <div className="test-card">
          <h3>Profile Modal</h3>
          <p>Opens a modal for editing the current user's profile.</p>
          <p style={{ fontSize: '14px', color: '#888' }}>
            The component handles success/error notifications internally.
          </p>
          <button onClick={() => setVisible(true)}>Open Profile</button>

          <Profile
            visible={visible}
            onVisibleChange={setVisible}
          />
        </div>
      )}
    </div>
  )
}

export function TestThemeSharedPage() {
  return (
    <div>
      <h1>@abpjs/theme-shared Tests (v2.4.0)</h1>
      <p style={{ marginBottom: '8px' }}>Testing toast notifications, confirmation dialogs, modals, error handling, and shared components.</p>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
        Version 2.4.0 - THEME_SHARED_APPEND_CONTENT token, Toaster.Status deprecation update (v3.0), appendScript deprecated
      </p>

      <TestV240Features />
      <TestLoaderBar />
      <TestErrorComponentDisplay />
      <TestToaster />
      <TestConfirmation />
      <TestErrorHandler />
      <TestModal />
      <TestModalV090 />
      <TestChangePassword />
      <TestProfile />
    </div>
  )
}

export default TestThemeSharedPage
