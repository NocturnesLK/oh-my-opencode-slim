export type AllowDenyAction = 'allow' | 'deny';

/**
 * Parse a list using the plugin's wildcard/exclusion syntax into permission
 * rules compatible with OpenCode's PermissionObjectConfig.
 *
 * Syntax:
 * - "*"   → allow all
 * - "!x"  → deny x
 * - "!*"  → deny all (wins over "*")
 *
 * Rules:
 * - Deny wins regardless of list order
 * - When "*" is absent, default is deny
 */
export function buildPermissionRulesFromList(
  items: string[],
): Record<string, AllowDenyAction> {
  const allow = new Set<string>();
  const deny = new Set<string>();

  for (const raw of items) {
    const item = raw.trim();
    if (item.length === 0) continue;

    if (item.startsWith('!')) {
      deny.add(item.slice(1));
    } else {
      allow.add(item);
    }
  }

  const allowAll = allow.has('*');
  const denyAll = deny.has('*');

  const rules: Record<string, AllowDenyAction> = {
    '*': allowAll && !denyAll ? 'allow' : 'deny',
  };

  for (const item of allow) {
    if (item === '*') continue;
    if (denyAll || deny.has(item)) continue;
    rules[item] = 'allow';
  }

  for (const item of deny) {
    if (item === '*') continue;
    rules[item] = 'deny';
  }

  return rules;
}
