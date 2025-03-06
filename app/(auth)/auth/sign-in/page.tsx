import { GalleryVerticalEnd } from 'lucide-react';
import { FormMessage, Message } from '@/components/form-message';
import { LoginForm as LoginFormPost } from '@/components/login-form';
import { LogoNesco } from '@/components/Element/index';
import Link from 'next/link';
import Image from 'next/image';

export default async function LoginPage(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="relative flex w-full min-h-screen flex-col items-center justify-center gap-6 bg-darkblue p-6 sm:p-10">
      <Link href="/" className="group fixed top-6 left-6 z-10 group flex cursor-pointer items-center space-x-1 2xl:space-x-4">
        <LogoNesco className="w-[10vw] max-w-[100px] transition-transform duration-500 group-hover:scale-110" />
        <span className="text-[6vw] font-bold font-kodeMono text-[#61CCC2] transition-colors duration-500 group-hover:text-blue xl:text-[2.5vw]">
          NESCO
        </span>
      </Link>

      <div className="flex w-full max-w-md flex-col gap-6">
        <LoginFormPost />
        <FormMessage message={searchParams} />
      </div>

      <Image
        src="/assets/auth/lantai.svg"
        alt="Image"
        width={1}
        height={1}
        className="absolute bottom-0 h-auto w-full object-cover"
      />
    </div>
    
    // <div className="grid min-h-svh lg:grid-cols-2">
    // <div className="flex flex-col gap-4 p-6 md:p-10">
    //   <div className="flex justify-center gap-2 md:justify-start">
    //     <a href="#" className="flex items-center gap-2 font-medium">
    //       {/* <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
    //         <GalleryVerticalEnd className="size-4" />
    //       </div> */}
    //       NESCO 2025
    //     </a>
    //   </div>
    //   <div className="flex flex-1 items-center justify-center">
    //     <div className="w-full max-w-xs">
    //       <LoginFormPost />
    //       {/* <FormMessage message={searchParams} /> */}
    //     </div>
    //   </div>
    // </div>
    // <div className="relative hidden bg-muted lg:block">
    //   <Image
    //     src="/tsmemes.jpg"
    //     alt="Image"
    //     width={720}
    //     height={1280}
    //     className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
    //   />
    // </div>
  );
}
