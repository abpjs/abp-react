/**
 * Tests for file-utils
 * @since 3.2.0
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { downloadBlob } from './file-utils';

describe('file-utils (v3.2.0)', () => {
  describe('downloadBlob', () => {
    let mockCreateObjectURL: ReturnType<typeof vi.fn>;
    let mockRevokeObjectURL: ReturnType<typeof vi.fn>;
    let mockCreateElement: ReturnType<typeof vi.fn>;
    let mockAppendChild: ReturnType<typeof vi.fn>;
    let mockRemoveChild: ReturnType<typeof vi.fn>;
    let mockLink: { href: string; download: string; click: ReturnType<typeof vi.fn> };

    beforeEach(() => {
      // Mock URL methods
      mockCreateObjectURL = vi.fn().mockReturnValue('blob:test-url');
      mockRevokeObjectURL = vi.fn();

      // Mock link element
      mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };

      // Mock document methods
      mockCreateElement = vi.fn().mockReturnValue(mockLink);
      mockAppendChild = vi.fn();
      mockRemoveChild = vi.fn();

      // Apply mocks
      vi.stubGlobal('URL', {
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL,
      });

      Object.defineProperty(window, 'URL', {
        value: {
          createObjectURL: mockCreateObjectURL,
          revokeObjectURL: mockRevokeObjectURL,
        },
        writable: true,
      });

      vi.spyOn(document, 'createElement').mockImplementation(mockCreateElement);
      vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
      vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    });

    it('should create a URL for the blob', () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });

      downloadBlob(blob, 'test.txt');

      expect(mockCreateObjectURL).toHaveBeenCalledWith(blob);
    });

    it('should create an anchor element', () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });

      downloadBlob(blob, 'test.txt');

      expect(mockCreateElement).toHaveBeenCalledWith('a');
    });

    it('should set the href to the blob URL', () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });

      downloadBlob(blob, 'test.txt');

      expect(mockLink.href).toBe('blob:test-url');
    });

    it('should set the download attribute to the filename', () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });

      downloadBlob(blob, 'test.txt');

      expect(mockLink.download).toBe('test.txt');
    });

    it('should append the link to the document body', () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });

      downloadBlob(blob, 'test.txt');

      expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
    });

    it('should trigger a click on the link', () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });

      downloadBlob(blob, 'test.txt');

      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should remove the link from the document body', () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });

      downloadBlob(blob, 'test.txt');

      expect(mockRemoveChild).toHaveBeenCalledWith(mockLink);
    });

    it('should revoke the blob URL after download', () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });

      downloadBlob(blob, 'test.txt');

      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test-url');
    });

    it('should handle empty filenames', () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });

      downloadBlob(blob, '');

      expect(mockLink.download).toBe('');
    });

    it('should handle filenames with special characters', () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });

      downloadBlob(blob, 'test file (1).txt');

      expect(mockLink.download).toBe('test file (1).txt');
    });

    it('should handle different blob types', () => {
      const jsonBlob = new Blob(['{"key": "value"}'], { type: 'application/json' });

      downloadBlob(jsonBlob, 'data.json');

      expect(mockCreateObjectURL).toHaveBeenCalledWith(jsonBlob);
    });

    it('should handle empty blobs', () => {
      const emptyBlob = new Blob([], { type: 'text/plain' });

      downloadBlob(emptyBlob, 'empty.txt');

      expect(mockCreateObjectURL).toHaveBeenCalledWith(emptyBlob);
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should handle binary blobs', () => {
      const binaryData = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
      const binaryBlob = new Blob([binaryData], { type: 'application/octet-stream' });

      downloadBlob(binaryBlob, 'binary.bin');

      expect(mockCreateObjectURL).toHaveBeenCalledWith(binaryBlob);
    });

    it('should execute operations in correct order', () => {
      const callOrder: string[] = [];

      mockCreateObjectURL.mockImplementation(() => {
        callOrder.push('createObjectURL');
        return 'blob:test-url';
      });
      mockCreateElement.mockImplementation(() => {
        callOrder.push('createElement');
        return mockLink;
      });
      mockAppendChild.mockImplementation(() => {
        callOrder.push('appendChild');
      });
      mockLink.click = vi.fn().mockImplementation(() => {
        callOrder.push('click');
      });
      mockRemoveChild.mockImplementation(() => {
        callOrder.push('removeChild');
      });
      mockRevokeObjectURL.mockImplementation(() => {
        callOrder.push('revokeObjectURL');
      });

      const blob = new Blob(['test'], { type: 'text/plain' });
      downloadBlob(blob, 'test.txt');

      expect(callOrder).toEqual([
        'createObjectURL',
        'createElement',
        'appendChild',
        'click',
        'removeChild',
        'revokeObjectURL',
      ]);
    });
  });
});
