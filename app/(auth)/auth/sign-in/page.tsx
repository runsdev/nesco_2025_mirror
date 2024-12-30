import { GalleryVerticalEnd } from 'lucide-react';
import { FormMessage, Message } from '@/components/form-message';
import { LoginForm as LoginFormPost } from '@/components/login-form';
import Image from 'next/image';

export default async function LoginPage(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    // <div className="flex w-full min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    //   <div className="flex w-full max-w-sm flex-col gap-6">
    //     <a href="#" className="flex items-center gap-2 self-center font-medium">
    //       <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
    //         <GalleryVerticalEnd className="size-4" />
    //       </div>
    //       NESCO 2025
    //     </a>
    //     <LoginForm />
    //     <FormMessage message={searchParams} />
    //   </div>
    // </div>
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            {/* <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div> */}
            NESCO 2025
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginFormPost />
            {/* <FormMessage message={searchParams} /> */}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/tsmemes.jpg"
          alt="Image"
          width={720}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
