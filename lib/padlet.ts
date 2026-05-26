const padletHosts = new Set(['padlet.com', 'www.padlet.com']);
const iframeSrcPattern = /src\s*=\s*(['"])(.*?)\1/i;

function parseUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function getSourceFromEmbedCode(value: string): string {
  const decoded = value.replaceAll('&quot;', '"').trim();
  const match = decoded.match(iframeSrcPattern);
  if (!match?.[2]) {
    return value.trim();
  }

  return match[2].trim();
}

function toAbsoluteUrl(value: string): string {
  if (value.startsWith('//')) {
    return `https:${value}`;
  }

  return value;
}

function toEmbedUrl(parsed: URL): string {
  if (!padletHosts.has(parsed.hostname)) {
    return parsed.toString();
  }

  const segments = parsed.pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    return '';
  }

  if (segments[0] === 'embed' && segments[1]) {
    return `https://padlet.com/embed/${segments[1]}`;
  }

  if (segments.length >= 2) {
    const boardId = segments[segments.length - 1];
    return `https://padlet.com/embed/${boardId}`;
  }

  return parsed.toString();
}

export function normalizePadletUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  const source = toAbsoluteUrl(getSourceFromEmbedCode(trimmed));
  const parsed = parseUrl(source);
  if (!parsed) {
    return '';
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return '';
  }

  return toEmbedUrl(parsed);
}
