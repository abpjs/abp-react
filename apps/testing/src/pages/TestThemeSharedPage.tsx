/**
 * Test page for @abpjs/theme-shared package
 * Tests: Toaster, Confirmation dialogs, Modal, Error handler, LoaderBar, ErrorComponent
 */
import { useState } from 'react'
import {
  useToaster,
  useConfirmation,
  useErrorHandler,
  Modal,
  Toaster,
  LoaderBar,
  ErrorComponent,
  ChangePassword,
  Profile,
} from '@abpjs/theme-shared'
import { useAbp, useAuth } from '@abpjs/core'

function TestLoaderBar() {
  const { restService } = useAbp()
  const [showLoaderBar, setShowLoaderBar] = useState(true)

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

      {showLoaderBar && <LoaderBar />}

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

  const showSuccessToast = () => {
    toaster.success('Operation completed successfully!', 'Success')
  }

  const showInfoToast = () => {
    toaster.info('Here is some information for you.', 'Info')
  }

  const showWarningToast = () => {
    toaster.warn('Please be careful with this action.', 'Warning')
  }

  const showErrorToast = () => {
    toaster.error('Something went wrong!', 'Error')
  }

  const showStickyToast = () => {
    toaster.info('This toast will stay until you close it.', 'Sticky Toast', { sticky: true })
  }

  const showMultipleToasts = () => {
    toaster.success('First toast', 'Success')
    setTimeout(() => toaster.info('Second toast', 'Info'), 300)
    setTimeout(() => toaster.warn('Third toast', 'Warning'), 600)
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
      </div>

      <div className="test-card">
        <h3>Advanced Toasts</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={showStickyToast}>Sticky Toast (no auto-dismiss)</button>
          <button onClick={showMultipleToasts}>Show Multiple Toasts</button>
        </div>
      </div>
    </div>
  )
}

function TestConfirmation() {
  const confirmation = useConfirmation()
  const [confirmResult, setConfirmResult] = useState<string | null>(null)

  const showConfirmation = async () => {
    setConfirmResult(null)
    const status = await confirmation.warn(
      'Are you sure you want to proceed with this action?',
      'Confirm Action'
    )
    setConfirmResult(status === Toaster.Status.confirm ? 'Confirmed!' : status === Toaster.Status.reject ? 'Cancelled' : 'Dismissed')
  }

  const showDeleteConfirmation = async () => {
    setConfirmResult(null)
    const status = await confirmation.error(
      'This action cannot be undone. Are you sure you want to delete this item?',
      'Delete Confirmation',
      { yesCopy: 'Delete', cancelCopy: 'Keep' }
    )
    setConfirmResult(status === Toaster.Status.confirm ? 'Item deleted!' : 'Deletion cancelled')
  }

  const showInfoConfirmation = async () => {
    setConfirmResult(null)
    const status = await confirmation.info(
      'Your changes have been saved successfully.',
      'Saved',
      { hideCancelBtn: true, yesCopy: 'OK' }
    )
    setConfirmResult(status === Toaster.Status.confirm ? 'Acknowledged' : 'Dismissed')
  }

  const showSuccessConfirmation = async () => {
    setConfirmResult(null)
    const status = await confirmation.success(
      'Your operation was completed successfully!',
      'Success'
    )
    setConfirmResult(status === Toaster.Status.confirm ? 'Confirmed' : 'Dismissed')
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
          <p style={{ marginTop: '0.5rem', color: confirmResult.includes('!') ? '#6f6' : '#f88' }}>
            Result: {confirmResult}
          </p>
        )}
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
      <h1>@abpjs/theme-shared Tests</h1>
      <p>Testing toast notifications, confirmation dialogs, modals, error handling, and shared components.</p>

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
