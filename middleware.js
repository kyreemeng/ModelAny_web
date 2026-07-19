const LOCALE_COOKIE = 'modelany_locale';
const CHINESE_COUNTRIES = new Set(['CN', 'HK', 'MO', 'TW']);
const BOT_PATTERN = /Googlebot|bingbot|Baiduspider|YandexBot|DuckDuckBot|Slurp|facebookexternalhit/i;

function readCookie(request, name) {
  const header = request.headers.get('cookie');
  if (!header) return undefined;

  for (const part of header.split(';')) {
    const [rawKey, ...rest] = part.trim().split('=');
    if (rawKey === name) return decodeURIComponent(rest.join('='));
  }
  return undefined;
}

function prefersChinese(request) {
  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase();
  const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() ?? '';
  return CHINESE_COUNTRIES.has(country) || acceptLanguage.startsWith('zh');
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

  if (!prefersChinese(request)) return;

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
