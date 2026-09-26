const LOCALE_COOKIE = 'modelany_locale';
const BOT_PATTERN = /Googlebot|bingbot|Baiduspider|YandexBot|DuckDuckBot|Slurp|facebookexternalhit|GPTBot|OAI-SearchBot|ClaudeBot|anthropic-ai|PerplexityBot/i;

function readCookie(request, name) {
  const header = request.headers.get('cookie');
  if (!header) return undefined;

  for (const part of header.split(';')) {
    const [rawKey, ...rest] = part.trim().split('=');
    if (rawKey === name) return decodeURIComponent(rest.join('='));
  }
  return undefined;
}

/**
 * Prefer Chinese only from an explicit language preference.
 * Do not use x-vercel-ip-country for hard redirects: geo-IP redirects on the
 * English homepage send CN/HK/TW/MO visitors (including English SERP clickers)
 * to /zh/, which weakens English ranking signals and hurts CTR.
 * Country is still read so edge logs/debug retain region context without acting on it.
 */
function prefersChineseLanguage(request) {
  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase();
  void country;
  const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() ?? '';
  const primary = acceptLanguage.split(',')[0]?.trim() ?? '';
  return primary.startsWith('zh');
}

function hasLocalePreference(request) {
  const locale = readCookie(request, LOCALE_COOKIE);
  return locale === 'en' || locale === 'zh';
}

export default function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') ?? '';

  if (url.pathname !== '/' || hasLocalePreference(request) || BOT_PATTERN.test(userAgent)) {
    return;
  }

  if (!prefersChineseLanguage(request)) return;

  return new Response(null, {
    status: 307,
    headers: {
      Location: new URL('/zh/', request.url).toString(),
      'Set-Cookie': `${LOCALE_COOKIE}=zh; Path=/; Max-Age=31536000; SameSite=Lax; Secure`,
    },
  });
}

export const config = {
  matcher: ['/'],
};
