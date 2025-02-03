import { type Page } from '@playwright/test';

import { NEXT_PUBLIC_WEBAPP_URL } from '@documenso/lib/constants/app';

type LoginOptions = {
  page: Page;
  email?: string;
  password?: string;

  /**
   * Where to navigate after login.
   */
  redirectPath?: string;
};

export const apiSignin = async ({
  page,
  email = 'example@documenso.com',
  password = 'password',
  redirectPath = '/documents',
}: LoginOptions) => {
  const { request } = page.context();

  const csrfToken = await getCsrfToken(page);

  await request.post(`${NEXT_PUBLIC_WEBAPP_URL()}/api/auth/callback/credentials`, {
    form: {
      email,
      password,
      json: true,
      csrfToken,
    },
  });

  await page.goto(`${NEXT_PUBLIC_WEBAPP_URL()}${redirectPath}`);
};

export const apiSignout = async ({ page }: { page: Page }) => {
  const { request } = page.context();

  const csrfToken = await getCsrfToken(page);

  await request.post(`${NEXT_PUBLIC_WEBAPP_URL()}/api/auth/signout`, {
    form: {
      csrfToken,
      json: true,
    },
  });

  await page.goto(`${NEXT_PUBLIC_WEBAPP_URL()}/signin`);
};

const getCsrfToken = async (page: Page) => {
  const { request } = page.context();

  const response = await request.fetch(`${NEXT_PUBLIC_WEBAPP_URL()}/api/auth/csrf`, {
    method: 'get',
  });

  const { csrfToken } = await response.json();
  if (!csrfToken) {
    throw new Error('Invalid session');
  }

  return csrfToken;
};
