/**
 * VOLO Constants
 * Translated from @abp/ng.schematics v3.1.0
 *
 * Constants for VOLO ABP types.
 */

import { Interface, Property } from '../models/model';

/**
 * Regex pattern to match VOLO ABP types.
 */
export const VOLO_REGEX = /^Volo\.Abp\.(Application\.Dtos|ObjectExtending)/;

/**
 * Predefined NameValue interface from VOLO ABP.
 */
export const VOLO_NAME_VALUE = new Interface({
  base: null,
  identifier: 'NameValue<T = string>',
  ref: 'Volo.Abp.NameValue',
  namespace: 'Volo.Abp',
  properties: [
    new Property({
      name: 'name',
      type: 'string',
      refs: ['System.String'],
    }),
    new Property({
      name: 'value',
      type: 'T',
      refs: ['T'],
    }),
  ],
});
