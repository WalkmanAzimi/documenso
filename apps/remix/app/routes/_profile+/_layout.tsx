import { useEffect, useState } from 'react';

import { Trans } from '@lingui/macro';
import { PlusIcon } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import { Link, Outlet } from 'react-router';

import LogoIcon from '@documenso/assets/logo_icon.png';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';

import { Header as AuthenticatedHeader } from '~/components/(dashboard)/layout/header';
import { Logo } from '~/components/general/branding-logo';

import type { Route } from './+types/_layout';

export function loader({ context }: Route.LoaderArgs) {
  const { session } = context;

  return {
    session,
  };
}

export default function PublicProfileLayout({ loaderData }: Route.ComponentProps) {
  const { session } = loaderData;

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {session ? (
        <AuthenticatedHeader user={session.user} teams={session.teams} />
      ) : (
        <header
          className={cn(
            'supports-backdrop-blur:bg-background/60 bg-background/95 sticky top-0 z-[60] flex h-16 w-full items-center border-b border-b-transparent backdrop-blur duration-200',
            scrollY > 5 && 'border-b-border',
          )}
        >
          <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-x-4 px-4 md:px-8">
            <Link
              to="/"
              className="focus-visible:ring-ring ring-offset-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:inline"
            >
              <Logo className="hidden h-6 w-auto sm:block" />

              <img
                src={LogoIcon}
                alt="Documenso Logo"
                width={48}
                height={48}
                className="h-10 w-auto sm:hidden dark:invert"
              />
            </Link>

            <div className="flex flex-row items-center justify-center">
              <p className="text-muted-foreground mr-4">
                <span className="text-sm sm:hidden">
                  <Trans>Want your own public profile?</Trans>
                </span>
                <span className="hidden text-sm sm:block">
                  <Trans>Like to have your own public profile with agreements?</Trans>
                </span>
              </p>

              <Button asChild variant="secondary">
                <Link to="/signup">
                  <div className="hidden flex-row items-center sm:flex">
                    <PlusIcon className="mr-1 h-5 w-5" />
                    <Trans>Create now</Trans>
                  </div>

                  <span className="sm:hidden">
                    <Trans>Create</Trans>
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </header>
      )}

      <main className="my-8 px-4 md:my-12 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}

// Todo: Test
export function ErrorBoundary() {
  return (
    <div className="mx-auto flex min-h-[80vh] w-full items-center justify-center py-32">
      <div>
        <p className="text-muted-foreground font-semibold">
          <Trans>404 Profile not found</Trans>
        </p>

        <h1 className="mt-3 text-2xl font-bold md:text-3xl">
          <Trans>Oops! Something went wrong.</Trans>
        </h1>

        <p className="text-muted-foreground mt-4 text-sm">
          <Trans>The profile you are looking for could not be found.</Trans>
        </p>

        <div className="mt-6 flex gap-x-2.5 gap-y-4 md:items-center">
          <Button asChild className="w-32">
            <Link to="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              <Trans>Go Back</Trans>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
