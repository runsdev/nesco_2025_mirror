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
      {/* <div className="self-stretch text-center">
        <span class="font-['Poppins'] text-sm font-normal text-[#ffe08d]">
          By clicking continue, you agree to our 
        </span>
        <span class="font-['Poppins'] text-sm font-normal text-[#61ccc2] underline">
          Terms of Service
        </span>
        <span class="font-['Poppins'] text-sm font-normal text-[#ffe08d]"> and</span>
        <span class="font-['Poppins'] text-sm font-normal text-[#ffe08d] underline"> </span>
        <span class="font-['Poppins'] text-sm font-normal text-[#61ccc2] underline">
          Privacy Policy
        </span>
        <span class="font-['Poppins'] text-sm font-normal text-[#61ccc2]">.</span>
      </div> */}
    </div>
    // <form className="flex flex-col gap-6">
    //   <div className="flex flex-col items-center gap-2 text-center">
    //     <h1 className="text-2xl font-bold">{t('title')}</h1>
    //     <p className="text-balance text-sm text-muted-foreground">{t('description')}</p>
    //   </div>
    //   <div className="grid gap-6">
    //     <Button
    //       variant="outline"
    //       className="w-full"
    //       onClick={() => signInWithProviderAction('google')}
    //     >
    //       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    //         <path
    //           d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
    //           fill="currentColor"
    //         />
    //       </svg>
    //       {t('login_with_google')}
    //     </Button>
    //     <Button
    //       variant="outline"
    //       className="w-full"
    //       onClick={() => signInWithProviderAction('github')}
    //     >
    //       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    //         <path
    //           d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    //           fill="currentColor"
    //         />
    //       </svg>
    //       {t('login_with_github')}
    //     </Button>
    //   </div>
    //   <div className="text-center text-sm">
    //     <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
    //       {t('terms_and_privacy.text')} <a href="#">{t('terms_and_privacy.terms')}</a>{' '}
    //       {t('terms_and_privacy.text_connector')} <a href="#">{t('terms_and_privacy.privacy')}</a>.
    //     </div>
    //   </div>
    // </form>
  );
}
