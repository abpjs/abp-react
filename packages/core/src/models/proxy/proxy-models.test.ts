import { describe, it, expect } from 'vitest';
import type {
  ExtensionEnumDto,
  ExtensionPropertyUiDto,
  LocalizableStringDto,
  ObjectExtensionsDto,
} from './object-extending';
import type {
  ActionApiDescriptionModel,
  ApplicationApiDescriptionModel,
  TypeApiDescriptionModel,
} from './http-modeling';
import type { LanguageInfo } from './localization';
import type { NameValue } from './common-proxies';

describe('proxy/object-extending models (v4.0.0)', () => {
  describe('ObjectExtensionsDto', () => {
    it('should store modules and enums', () => {
      const dto: ObjectExtensionsDto = {
        modules: {
          identity: {
            entities: {
              User: {
                properties: {
                  socialSecurityNumber: {
                    type: 'System.String',
                    typeSimple: 'string',
                    displayName: { name: 'SocialSecurityNumber', resource: 'AbpIdentity' },
                    api: {
                      onGet: { isAvailable: true },
                      onCreate: { isAvailable: true },
                      onUpdate: { isAvailable: true },
                    },
                    ui: {
                      onTable: { isVisible: true },
                      onCreateForm: { isVisible: true },
                      onEditForm: { isVisible: true },
                      lookup: {},
                    } as ExtensionPropertyUiDto,
                    attributes: [],
                    configuration: {},
                    defaultValue: {} as object,
                  },
                },
                configuration: {},
              },
            },
            configuration: {},
          },
        },
        enums: {},
      };

      expect(dto.modules['identity'].entities['User'].properties['socialSecurityNumber'].type).toBe(
        'System.String'
      );
    });
  });

  describe('ExtensionEnumDto', () => {
    it('should store enum fields', () => {
      const dto: ExtensionEnumDto = {
        fields: [
          { name: 'Active', value: 0 as unknown as object },
          { name: 'Inactive', value: 1 as unknown as object },
        ],
        localizationResource: 'MyResource',
      };
      expect(dto.fields).toHaveLength(2);
      expect(dto.fields[0].name).toBe('Active');
      expect(dto.localizationResource).toBe('MyResource');
    });

    it('should allow optional localizationResource', () => {
      const dto: ExtensionEnumDto = { fields: [] };
      expect(dto.localizationResource).toBeUndefined();
    });
  });

  describe('LocalizableStringDto', () => {
    it('should store name and resource', () => {
      const dto: LocalizableStringDto = { name: 'DisplayName', resource: 'AbpIdentity' };
      expect(dto.name).toBe('DisplayName');
      expect(dto.resource).toBe('AbpIdentity');
    });

    it('should allow optional fields', () => {
      const dto: LocalizableStringDto = {};
      expect(dto.name).toBeUndefined();
      expect(dto.resource).toBeUndefined();
    });
  });
});

describe('proxy/http-modeling models (v4.0.0)', () => {
  describe('ApplicationApiDescriptionModel', () => {
    it('should store modules and types', () => {
      const model: ApplicationApiDescriptionModel = {
        modules: {
          identity: {
            rootPath: 'identity',
            remoteServiceName: 'AbpIdentity',
            controllers: {
              UserController: {
                controllerName: 'User',
                type: 'Volo.Abp.Identity.IdentityUserController',
                interfaces: [{ type: 'IIdentityUserAppService' }],
                actions: {
                  GetListAsync: {
                    uniqueName: 'GetListAsync',
                    name: 'GetListAsync',
                    httpMethod: 'GET',
                    url: 'api/identity/users',
                    supportedVersions: ['1.0'],
                    parametersOnMethod: [],
                    parameters: [],
                    returnValue: { type: 'PagedResultDto', typeSimple: 'PagedResultDto' },
                  },
                },
              },
            },
          },
        },
        types: {
          'PagedResultDto<IdentityUserDto>': {
            baseType: undefined,
            isEnum: false,
            enumNames: [],
            enumValues: [],
            genericArguments: ['IdentityUserDto'],
            properties: [
              { name: 'items', type: 'IdentityUserDto[]', typeSimple: 'IdentityUserDto[]', isRequired: false },
              { name: 'totalCount', type: 'System.Int32', typeSimple: 'number', isRequired: true },
            ],
          },
        },
      };

      const userController = model.modules['identity'].controllers['UserController'];
      expect(userController.controllerName).toBe('User');
      expect(userController.actions['GetListAsync'].httpMethod).toBe('GET');
      expect(model.types['PagedResultDto<IdentityUserDto>'].properties).toHaveLength(2);
    });
  });

  describe('ActionApiDescriptionModel', () => {
    it('should store action details', () => {
      const action: ActionApiDescriptionModel = {
        uniqueName: 'CreateAsync',
        name: 'CreateAsync',
        httpMethod: 'POST',
        url: 'api/identity/users',
        supportedVersions: ['1.0', '2.0'],
        parametersOnMethod: [
          {
            name: 'input',
            typeAsString: 'CreateUserDto',
            type: 'CreateUserDto',
            typeSimple: 'CreateUserDto',
            isOptional: false,
            defaultValue: {} as object,
          },
        ],
        parameters: [
          {
            nameOnMethod: 'input',
            name: 'input',
            type: 'CreateUserDto',
            typeSimple: 'CreateUserDto',
            isOptional: false,
            defaultValue: {} as object,
            constraintTypes: [],
            bindingSourceId: 'Body',
          },
        ],
        returnValue: { type: 'IdentityUserDto', typeSimple: 'IdentityUserDto' },
      };

      expect(action.httpMethod).toBe('POST');
      expect(action.supportedVersions).toContain('2.0');
      expect(action.parametersOnMethod).toHaveLength(1);
      expect(action.returnValue.type).toBe('IdentityUserDto');
    });
  });

  describe('TypeApiDescriptionModel', () => {
    it('should represent an enum type', () => {
      const type: TypeApiDescriptionModel = {
        isEnum: true,
        enumNames: ['Active', 'Inactive', 'Banned'],
        enumValues: [0, 1, 2] as unknown as object[],
        genericArguments: [],
        properties: [],
      };
      expect(type.isEnum).toBe(true);
      expect(type.enumNames).toHaveLength(3);
    });

    it('should represent a complex type', () => {
      const type: TypeApiDescriptionModel = {
        baseType: 'EntityDto',
        isEnum: false,
        enumNames: [],
        enumValues: [],
        genericArguments: [],
        properties: [
          { name: 'id', type: 'Guid', typeSimple: 'string', isRequired: true },
          { name: 'name', type: 'String', typeSimple: 'string', isRequired: true },
          { name: 'description', type: 'String', typeSimple: 'string', isRequired: false },
        ],
      };
      expect(type.baseType).toBe('EntityDto');
      expect(type.properties).toHaveLength(3);
      expect(type.properties[2].isRequired).toBe(false);
    });
  });
});

describe('proxy/localization models (v4.0.0)', () => {
  describe('LanguageInfo', () => {
    it('should store language details', () => {
      const lang: LanguageInfo = {
        cultureName: 'en',
        uiCultureName: 'en',
        displayName: 'English',
        flagIcon: 'us',
      };
      expect(lang.cultureName).toBe('en');
      expect(lang.displayName).toBe('English');
    });

    it('should allow all fields optional', () => {
      const lang: LanguageInfo = {};
      expect(lang.cultureName).toBeUndefined();
      expect(lang.flagIcon).toBeUndefined();
    });
  });
});

describe('proxy/common-proxies models (v4.0.0)', () => {
  describe('NameValue', () => {
    it('should store string name-value pair by default', () => {
      const nv: NameValue = { name: 'key', value: 'val' };
      expect(nv.name).toBe('key');
      expect(nv.value).toBe('val');
    });

    it('should support generic type parameter', () => {
      const nv: NameValue<number> = { name: 'count', value: 42 };
      expect(nv.name).toBe('count');
      expect(nv.value).toBe(42);
    });

    it('should support boolean generic', () => {
      const nv: NameValue<boolean> = { name: 'enabled', value: true };
      expect(nv.value).toBe(true);
    });
  });
});
