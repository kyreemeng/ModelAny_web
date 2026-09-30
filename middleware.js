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
 * The homepage defaults to English for everyone. No browser-language, geo or
 * timezone guessing: first-time visitors land on the English homepage and
 * switch languages with the toggle in the header. The only redirect left is
 * memory of an explicit choice—a visitor who previously picked 中文 (cookie
 * modelany_locale=zh) keeps landing on /zh/. Bots are never redirected so
 * each language version keeps its own ranking signals.
 */
export default function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') ?? '';

  if (url.pathname !== '/' || BOT_PATTERN.test(userAgent)) {
    return;
  }

  if (readCookie(request, LOCALE_COOKIE) !== 'zh') return;

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
