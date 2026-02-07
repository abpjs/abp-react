/**
 * Tests for Text Template Management Proxy Models
 * @since 3.2.0
 */
import { describe, it, expect } from 'vitest';
import type {
  GetTemplateContentInput,
  GetTemplateDefinitionListInput,
  RestoreTemplateContentInput,
  TemplateDefinitionDto,
  TextTemplateContentDto,
  UpdateTemplateContentInput,
} from '../../../proxy/text-templates/models';

describe('Proxy Models', () => {
  describe('GetTemplateContentInput', () => {
    it('should have required templateName and cultureName', () => {
      const input: GetTemplateContentInput = {
        templateName: 'EmailTemplate',
        cultureName: 'en',
      };

      expect(input.templateName).toBe('EmailTemplate');
      expect(input.cultureName).toBe('en');
    });

    it('should support different culture names', () => {
      const inputs: GetTemplateContentInput[] = [
        { templateName: 'Template1', cultureName: 'en' },
        { templateName: 'Template2', cultureName: 'fr' },
        { templateName: 'Template3', cultureName: 'de-DE' },
        { templateName: 'Template4', cultureName: 'zh-CN' },
      ];

      expect(inputs).toHaveLength(4);
      expect(inputs[2].cultureName).toBe('de-DE');
    });
  });

  describe('GetTemplateDefinitionListInput', () => {
    it('should allow empty object (all optional)', () => {
      const input: GetTemplateDefinitionListInput = {};

      expect(input.filterText).toBeUndefined();
      expect(input.skipCount).toBeUndefined();
      expect(input.maxResultCount).toBeUndefined();
      expect(input.sorting).toBeUndefined();
    });

    it('should support filterText', () => {
      const input: GetTemplateDefinitionListInput = {
        filterText: 'email',
      };

      expect(input.filterText).toBe('email');
    });

    it('should support pagination parameters', () => {
      const input: GetTemplateDefinitionListInput = {
        skipCount: 10,
        maxResultCount: 20,
      };

      expect(input.skipCount).toBe(10);
      expect(input.maxResultCount).toBe(20);
    });

    it('should support sorting', () => {
      const input: GetTemplateDefinitionListInput = {
        sorting: 'name asc',
      };

      expect(input.sorting).toBe('name asc');
    });

    it('should support all parameters together', () => {
      const input: GetTemplateDefinitionListInput = {
        filterText: 'notification',
        skipCount: 0,
        maxResultCount: 50,
        sorting: 'displayName desc',
      };

      expect(input.filterText).toBe('notification');
      expect(input.skipCount).toBe(0);
      expect(input.maxResultCount).toBe(50);
      expect(input.sorting).toBe('displayName desc');
    });
  });

  describe('RestoreTemplateContentInput', () => {
    it('should have required templateName and cultureName', () => {
      const input: RestoreTemplateContentInput = {
        templateName: 'WelcomeEmail',
        cultureName: 'en-US',
      };

      expect(input.templateName).toBe('WelcomeEmail');
      expect(input.cultureName).toBe('en-US');
    });
  });

  describe('TemplateDefinitionDto', () => {
    it('should have all required properties', () => {
      const dto: TemplateDefinitionDto = {
        name: 'EmailVerification',
        displayName: 'Email Verification Template',
        isLayout: false,
        layout: '',
        isInlineLocalized: false,
        defaultCultureName: 'en',
      };

      expect(dto.name).toBe('EmailVerification');
      expect(dto.displayName).toBe('Email Verification Template');
      expect(dto.isLayout).toBe(false);
      expect(dto.layout).toBe('');
      expect(dto.isInlineLocalized).toBe(false);
      expect(dto.defaultCultureName).toBe('en');
    });

    it('should support layout template', () => {
      const layoutDto: TemplateDefinitionDto = {
        name: 'DefaultEmailLayout',
        displayName: 'Default Email Layout',
        isLayout: true,
        layout: '',
        isInlineLocalized: false,
        defaultCultureName: 'en',
      };

      expect(layoutDto.isLayout).toBe(true);
    });

    it('should support template with layout reference', () => {
      const dto: TemplateDefinitionDto = {
        name: 'PasswordReset',
        displayName: 'Password Reset Email',
        isLayout: false,
        layout: 'DefaultEmailLayout',
        isInlineLocalized: false,
        defaultCultureName: 'en',
      };

      expect(dto.layout).toBe('DefaultEmailLayout');
    });

    it('should support inline localized templates', () => {
      const dto: TemplateDefinitionDto = {
        name: 'InlineTemplate',
        displayName: 'Inline Localized Template',
        isLayout: false,
        layout: '',
        isInlineLocalized: true,
        defaultCultureName: 'en',
      };

      expect(dto.isInlineLocalized).toBe(true);
    });
  });

  describe('TextTemplateContentDto', () => {
    it('should have all required properties', () => {
      const dto: TextTemplateContentDto = {
        name: 'WelcomeEmail',
        cultureName: 'en',
        content: '<html><body>Welcome!</body></html>',
      };

      expect(dto.name).toBe('WelcomeEmail');
      expect(dto.cultureName).toBe('en');
      expect(dto.content).toBe('<html><body>Welcome!</body></html>');
    });

    it('should support empty content', () => {
      const dto: TextTemplateContentDto = {
        name: 'EmptyTemplate',
        cultureName: 'en',
        content: '',
      };

      expect(dto.content).toBe('');
    });

    it('should support multiline content', () => {
      const content = `
        <html>
          <head><title>Test</title></head>
          <body>
            <h1>Hello</h1>
            <p>This is a test template.</p>
          </body>
        </html>
      `;
      const dto: TextTemplateContentDto = {
        name: 'MultilineTemplate',
        cultureName: 'en',
        content,
      };

      expect(dto.content).toContain('<html>');
      expect(dto.content).toContain('</html>');
    });
  });

  describe('UpdateTemplateContentInput', () => {
    it('should have all required properties', () => {
      const input: UpdateTemplateContentInput = {
        templateName: 'NotificationEmail',
        cultureName: 'en',
        content: 'Updated content',
      };

      expect(input.templateName).toBe('NotificationEmail');
      expect(input.cultureName).toBe('en');
      expect(input.content).toBe('Updated content');
    });

    it('should support updating with empty content', () => {
      const input: UpdateTemplateContentInput = {
        templateName: 'ClearTemplate',
        cultureName: 'en',
        content: '',
      };

      expect(input.content).toBe('');
    });

    it('should support special characters in content', () => {
      const input: UpdateTemplateContentInput = {
        templateName: 'SpecialCharsTemplate',
        cultureName: 'zh-CN',
        content: '你好世界 <script>alert("test")</script> {{variable}}',
      };

      expect(input.content).toContain('你好世界');
      expect(input.content).toContain('{{variable}}');
    });
  });
});
