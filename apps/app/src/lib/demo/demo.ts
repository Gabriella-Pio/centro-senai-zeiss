export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const DEMO_CURRENT_USER_ID_KEY = 'cem_demo_current_user_id';

export const DEMO_USER_COOKIE = 'cem_demo_user_id';

export const DEMO_LOGGED_OUT_KEY = 'cem_demo_logged_out';

export const DEMO_USERS_KEY = 'cem_demo_users';

const COOKIE_MAX_AGE = 8 * 60 * 60;

export function setDemoUserCookie(userId: string) {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie =
    `${DEMO_USER_COOKIE}=${encodeURIComponent(userId)}; ` +
    `path=/; ` +
    `max-age=${COOKIE_MAX_AGE}; ` +
    `samesite=lax`;
}

export function clearDemoUserCookie() {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${DEMO_USER_COOKIE}=; ` + `path=/; ` + `max-age=0; ` + `samesite=lax`;
}
