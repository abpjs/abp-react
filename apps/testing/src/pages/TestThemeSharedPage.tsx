/**
 * Test page for @abpjs/theme-shared package
 * Tests: Toaster, Confirmation dialogs, Modal, Error handler
 */
import { useState } from 'react'
import {
  useToaster,
  useConfirmation,
  useErrorHandler,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Toaster,
} from '@abpjs/theme-shared'

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
          header={<ModalHeader>Test Modal ({modalSize.toUpperCase()})</ModalHeader>}
          footer={
            <ModalFooter>
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
            </ModalFooter>
          }
        >
          <ModalBody>
            <p>This is a modal dialog using Chakra UI.</p>
            <p>Current size: <strong>{modalSize}</strong></p>
            <p>It supports:</p>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li>Custom header, body, and footer</li>
              <li>Different sizes (sm, md, lg, xl)</li>
              <li>Close on overlay click (configurable)</li>
              <li>Close on Escape key (configurable)</li>
              <li>Animations</li>
            </ul>
          </ModalBody>
        </Modal>
      </div>
    </div>
  )
}

export function TestThemeSharedPage() {
  return (
    <div>
      <h1>@abpjs/theme-shared Tests</h1>
      <p>Testing toast notifications, confirmation dialogs, modals, and error handling.</p>

      <TestToaster />
      <TestConfirmation />
      <TestErrorHandler />
      <TestModal />
    </div>
  )
}

export default TestThemeSharedPage
