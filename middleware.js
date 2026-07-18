const LOCALE_COOKIE = 'modelany_locale';
const CHINESE_COUNTRIES = new Set(['CN', 'HK', 'MO', 'TW']);
const BOT_PATTERN = /Googlebot|bingbot|Baiduspider|YandexBot|DuckDuckBot|Slurp|facebookexternalhit/i;

function prefersChinese(request) {
  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase();
  const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() ?? '';
  return CHINESE_COUNTRIES.has(country) || acceptLanguage.startsWith('zh');
}

function hasLocalePreference(request) {
  return request.cookies.get(LOCALE_COOKIE)?.value === 'en'
    || request.cookies.get(LOCALE_COOKIE)?.value === 'zh';
}

export default function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') ?? '';

  if (url.pathname !== '/' || hasLocalePreference(request) || BOT_PATTERN.test(userAgent)) {
    return;
  }

  if (!prefersChinese(request)) return;

  const response = Response.redirect(new URL('/zh/', request.url), 307);
  response.headers.append(
    'Set-Cookie',
    `${LOCALE_COOKIE}=zh; Path=/; Max-Age=31536000; SameSite=Lax; Secure`,
  );
  return response;
}

export const config = {
  matcher: ['/'],
};
