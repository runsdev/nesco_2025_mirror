'use client';

import { useState } from 'react';
import { Button } from '@/components/ui-template/button';
import { BsGoogle, BsGithub, BsArrowRight } from 'react-icons/bs';
import { createClient } from '@/utils/supabase/client';
import { Provider } from '@supabase/supabase-js';
import { encodedRedirect } from '@/utils/utils';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const t = useTranslations('auth.signin');
  const searchParams = useSearchParams();
  const redirectTo = searchParams!.get('redirectTo') || '/';
  const [isLoading, setIsLoading] = useState<Provider | null>(null);

  const signInWithProviderAction = async (provider: Provider) => {
    setIsLoading(provider);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/api/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (error) {
        return encodedRedirect('error', '/auth/sign-in', error.message);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      // In real-world applications, this might not be reached since OAuth redirects the user
      setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold text-[#F8D371]">{t('title')}</h1>
        <p className="text-balance text-sm text-[#69C7BF] opacity-90">{t('description')}</p>
      </div>

      <div className="mt-2 flex flex-col items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="bg-green group relative w-full overflow-hidden rounded-full border-[#61CCC2]/30 py-6 text-sm text-white transition-all duration-300 hover:border-[#61CCC2] hover:from-[#61CCC2]/20 hover:to-[#FFE08D]/20 hover:shadow-lg hover:shadow-[#61CCC2]/20 lg:text-base"
          onClick={() => signInWithProviderAction('google')}
          disabled={isLoading !== null}
        >
          {isLoading === 'google' ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <BsGoogle className="mr-2 h-5 w-5" />
          )}
          <span>{t('login_with_google')}</span>
          <span className="absolute right-4 opacity-0 transition-all duration-300 group-hover:right-6 group-hover:opacity-100">
            <BsArrowRight />
          </span>
        </Button>

        {/* <Button
          type="button"
          variant="outline"
          className="group relative w-full overflow-hidden rounded-full border-[#61CCC2]/30 bg-gradient-to-b from-[#61CCC2]/10 to-[#FFE08D]/10 py-6 text-sm text-white transition-all duration-300 hover:border-[#61CCC2] hover:from-[#61CCC2]/20 hover:to-[#FFE08D]/20 hover:shadow-lg hover:shadow-[#61CCC2]/20 lg:text-base"
          onClick={() => signInWithProviderAction('github')}
          disabled={isLoading !== null}
        >
          {isLoading === 'github' ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <BsGithub className="mr-2 h-5 w-5" />
          )}
          <span>{t('login_with_github')}</span>
          <span className="absolute right-4 opacity-0 transition-all duration-300 group-hover:right-6 group-hover:opacity-100">
            <BsArrowRight />
          </span>
        </Button> */}
      </div>

      {/* Additional options */}
      {/* <div className="mt-2 flex flex-col items-center text-sm text-[#69C7BF]/80">
        <p>
          {t('no_account_question') || "Don't have an account?"}
          <Link href="/auth/sign-up" className="ml-1 font-semibold text-[#F8D371] hover:underline">
            {t('sign_up') || 'Sign up'}
          </Link>
        </p>

        <Link
          href="/"
          className="mt-4 text-xs text-[#69C7BF]/60 hover:text-[#69C7BF] hover:underline"
        >
          {t('back_to_home') || 'Back to home'}
        </Link>
      </div> */}
    </div>
  );
}
