'use client';

import { Button } from '@/components/ui-template/button';
import { Input } from '@/components/ui-template/input';
import { Label } from '@/components/ui-template/label';
import { BsGoogle, BsGithub } from 'react-icons/bs';
import { createClient } from '@/utils/supabase/client';
import { Provider } from '@supabase/supabase-js';
import { encodedRedirect } from '@/utils/utils';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const t = useTranslations('auth.signin');

  const signInWithProviderAction = async (provider: Provider) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/api/auth/callback`,
      },
    });
    if (error) {
      return encodedRedirect('error', '/auth/sign-in', error.message);
    }
  };

  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-[#F8D371]">{t('title')}</h1>
        <p className="text-balance text-sm text-[#69C7BF]">{t('description')}</p>
      </div>
      <div className="flex flex-col items-center gap-6">
        <Button
          variant="outline"
          className="w-full rounded-full bg-gradient-to-b from-[#61CCC2] to-[#FFE08D] py-6 text-sm text-[#474d52] lg:w-[60%] lg:text-base"
          onClick={() => signInWithProviderAction('google')}
        >
          <BsGoogle className="h-7 w-7" />
          {t('login_with_google')}
        </Button>
        <Button
          variant="outline"
          className="w-full rounded-full bg-gradient-to-b from-[#61CCC2] to-[#FFE08D] py-6 text-sm text-[#474d52] lg:w-[60%] lg:text-base"
          onClick={() => signInWithProviderAction('github')}
        >
          <BsGithub className="h-7 w-7" />
          {t('login_with_github')}
        </Button>
      </div>
      <div className="w-full text-center text-sm text-[#F8D371]">
        <p className="whitespace-nowrap text-balance">
          {t('terms_and_privacy.text')}{' '}
          <Link className="text-[#69C7BF] underline underline-offset-4 hover:text-primary" href="#">
            {t('terms_and_privacy.terms')}
          </Link>{' '}
          {t('terms_and_privacy.text_connector')}{' '}
          <Link className="text-[#69C7BF] underline underline-offset-4 hover:text-primary" href="#">
            {t('terms_and_privacy.privacy')}
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
