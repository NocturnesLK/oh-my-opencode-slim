const INTERNAL_INITIATOR_SOURCE = 'oh-my-opencode-slim';

export const SLIM_INTERNAL_INITIATOR_MARKER =
  'oh-my-opencode-slim/internal-initiator';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function createInternalAgentTextPart(text: string): {
  type: 'text';
  text: string;
  synthetic: true;
  metadata: Record<string, unknown>;
} {
  return {
    type: 'text',
    text,
    synthetic: true,
    metadata: {
      [SLIM_INTERNAL_INITIATOR_MARKER]: true,
      initiator: 'agent',
      source: INTERNAL_INITIATOR_SOURCE,
    },
  };
}

export function hasInternalInitiatorMarker(part: unknown): boolean {
  if (!isRecord(part) || part.type !== 'text') {
    return false;
  }

  const { metadata } = part;
  if (!isRecord(metadata)) {
    return false;
  }

  return metadata[SLIM_INTERNAL_INITIATOR_MARKER] === true;
}
