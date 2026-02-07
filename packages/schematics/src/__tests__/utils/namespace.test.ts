/**
 * Namespace Parsing Utilities Tests
 */

import { describe, expect, it } from 'vitest';
import { parseNamespace } from '../../utils/namespace';

describe('Namespace Utils', () => {
  describe('parseNamespace', () => {
    it('should strip solution root namespace', () => {
      const result = parseNamespace('MyCompany.MyProduct', 'MyCompany.MyProduct.Users.UserDto');
      expect(result).toBe('Users');
    });

    it('should keep Controllers as namespace when it is the final segment', () => {
      // The regex only strips Controllers. (with trailing dot), not at end of string
      const result = parseNamespace(
        'MyCompany.MyProduct',
        'MyCompany.MyProduct.Controllers.UserController'
      );
      expect(result).toBe('Controllers');
    });

    it('should keep Controllers in nested namespace', () => {
      const result = parseNamespace(
        'MyCompany.MyProduct',
        'MyCompany.MyProduct.Users.Controllers.UserController'
      );
      expect(result).toBe('Users.Controllers');
    });

    it('should handle deeper namespaces', () => {
      const result = parseNamespace(
        'MyCompany.MyProduct',
        'MyCompany.MyProduct.Users.Dtos.UserCreateDto'
      );
      expect(result).toBe('Users.Dtos');
    });

    it('should handle generic types in namespace', () => {
      const result = parseNamespace(
        'MyCompany.MyProduct',
        'MyCompany.MyProduct.Users.PagedResultDto<UserDto>'
      );
      expect(result).toBe('Users');
    });

    it('should handle single segment solution', () => {
      const result = parseNamespace('MyProduct', 'MyProduct.Users.UserDto');
      expect(result).toBe('Users');
    });
  });
});
