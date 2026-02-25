import { describe, expect, it } from 'bun:test';
import { buildPermissionRulesFromList } from './list-syntax';

describe('buildPermissionRulesFromList', () => {
  it('defaults to deny when no wildcard', () => {
    expect(buildPermissionRulesFromList([])).toEqual({ '*': 'deny' });
    expect(buildPermissionRulesFromList(['a'])).toEqual({
      '*': 'deny',
      a: 'allow',
    });
  });

  it('supports wildcard allow with exclusions', () => {
    expect(buildPermissionRulesFromList(['*', '!a'])).toEqual({
      '*': 'allow',
      a: 'deny',
    });
  });

  it('treats deny as higher priority regardless of order', () => {
    expect(buildPermissionRulesFromList(['a', '!a']).a).toBe('deny');
    expect(buildPermissionRulesFromList(['!a', 'a']).a).toBe('deny');
  });

  it('denies all when "!*" is present', () => {
    expect(buildPermissionRulesFromList(['*', '!*'])).toEqual({ '*': 'deny' });
    expect(buildPermissionRulesFromList(['!*', '*'])).toEqual({ '*': 'deny' });
  });
});
