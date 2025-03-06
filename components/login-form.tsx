'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-template/button';
import { Input } from '@/components/ui-template/input';
import { Label } from '@/components/ui-template/label';
import { createClient } from '@/utils/supabase/client';
import { Provider } from '@supabase/supabase-js';
import { encodedRedirect } from '@/utils/utils';
import { useTranslations } from 'next-intl';

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
    <div className="inline-flex h-[243.34px] w-[531px] flex-col items-center justify-start gap-2.5">
      <div className="flex h-20 flex-col items-center justify-start gap-2.5">
        <div className="self-stretch font-['Poppins'] text-[32px] font-bold text-[#ffe08d]">
          Login to your account
        </div>
        <div className="self-stretch text-center font-['Poppins'] text-sm font-normal text-[#61ccc2]">
          Use one of these services to login
        </div>
      </div>
      <div className="flex h-[121.34px] flex-col items-start justify-start gap-[15px]">
        <button
          className="flex h-[53.17px] flex-col items-start justify-start gap-2 self-stretch rounded-[26.59px] border-2 border-[#ffe08d] bg-gradient-to-b from-[#61ccc2] to-[#ffe08d] px-[108px] py-[13px]"
          onClick={() => signInWithProviderAction('google')}
        >
          <div className="inline-flex items-center justify-center gap-2.5">
            <div data-svg-wrapper>
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.8175 10.3374C23.9574 11.1429 24.0272 11.9589 24.026 12.7764C24.026 16.4274 22.721 19.5144 20.45 21.6039H20.453C18.467 23.4384 15.737 24.5004 12.5 24.5004C9.3174 24.5004 6.26516 23.2361 4.01472 20.9857C1.76428 18.7353 0.5 15.683 0.5 12.5004C0.5 9.31783 1.76428 6.26558 4.01472 4.01514C6.26516 1.76471 9.3174 0.500426 12.5 0.500426C15.4789 0.465538 18.3558 1.58467 20.528 3.62343L17.102 7.04943C15.8636 5.86889 14.2107 5.22241 12.5 5.24943C9.3695 5.24943 6.71 7.36143 5.762 10.2054C5.25936 11.6957 5.25936 13.3097 5.762 14.7999H5.7665C6.719 17.6394 9.374 19.7514 12.5045 19.7514C14.1215 19.7514 15.5105 19.3374 16.5875 18.6054H16.583C17.2084 18.1911 17.7433 17.6544 18.1555 17.0277C18.5678 16.401 18.8487 15.6972 18.9815 14.9589H12.5V10.3389H23.8175V10.3374Z"
                  fill="black"
                />
              </svg>
            </div>
            <div className="font-['Poppins'] text-[16.92px] font-normal text-[#474d52]">
              Login with Google
            </div>
          </div>
        </button>
        <button
          className="flex h-[53.17px] flex-col items-start justify-start gap-2 self-stretch rounded-[26.59px] border-2 border-[#ffe08d] bg-gradient-to-b from-[#61ccc2] to-[#ffe08d] px-[110px] py-[13px]"
          onClick={() => signInWithProviderAction('github')}
        >
          <div className="inline-flex items-center justify-center gap-2.5">
            <div data-svg-wrapper>
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 0.968262C5.87 0.968262 0.5 6.33826 0.5 12.9683C0.5 18.2783 3.935 22.7633 8.705 24.3533C9.305 24.4583 9.53 24.0983 9.53 23.7833C9.53 23.4983 9.515 22.5533 9.515 21.5483C6.5 22.1033 5.72 20.8133 5.48 20.1383C5.345 19.7933 4.76 18.7283 4.25 18.4433C3.83 18.2183 3.23 17.6633 4.235 17.6483C5.18 17.6333 5.855 18.5183 6.08 18.8783C7.16 20.6933 8.885 20.1833 9.575 19.8683C9.68 19.0883 9.995 18.5633 10.34 18.2633C7.67 17.9633 4.88 16.9283 4.88 12.3383C4.88 11.0333 5.345 9.95326 6.11 9.11326C5.99 8.81326 5.57 7.58326 6.23 5.93326C6.23 5.93326 7.235 5.61826 9.53 7.16326C10.49 6.89326 11.51 6.75826 12.53 6.75826C13.55 6.75826 14.57 6.89326 15.53 7.16326C17.825 5.60326 18.83 5.93326 18.83 5.93326C19.49 7.58326 19.07 8.81326 18.95 9.11326C19.715 9.95326 20.18 11.0183 20.18 12.3383C20.18 16.9433 17.375 17.9633 14.705 18.2633C15.14 18.6383 15.515 19.3583 15.515 20.4833C15.515 22.0883 15.5 23.3783 15.5 23.7833C15.5 24.0983 15.725 24.4733 16.325 24.3533C18.7073 23.5492 20.7775 22.0183 22.244 19.9759C23.7106 17.9335 24.4996 15.4826 24.5 12.9683C24.5 6.33826 19.13 0.968262 12.5 0.968262Z"
                  fill="black"
                />
              </svg>
            </div>
            <div className="font-['Poppins'] text-[16.92px] font-normal text-[#474d52]">
              Login with GitHub
            </div>
          </div>
        </button>
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
