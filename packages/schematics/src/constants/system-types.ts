/**
 * System Types Mapping
 * Translated from @abp/ng.schematics v3.1.0
 *
 * Maps .NET system types to their TypeScript equivalents.
 */

export const SYSTEM_TYPES = new Map<string, string>([
  ['Bool', 'boolean'],
  ['Byte', 'number'],
  ['Char', 'string'],
  ['DateTime', 'string'],
  ['DateTimeOffset', 'string'],
  ['Decimal', 'number'],
  ['Double', 'number'],
  ['Guid', 'string'],
  ['Int16', 'number'],
  ['Int32', 'number'],
  ['Int64', 'number'],
  ['Net.HttpStatusCode', 'number'],
  ['Object', 'object'],
  ['Sbyte', 'number'],
  ['Single', 'number'],
  ['String', 'string'],
  ['TimeSpan', 'string'],
  ['UInt16', 'number'],
  ['UInt32', 'number'],
  ['UInt64', 'number'],
  ['Void', 'void'],
]);
