import { FormMessage, Message } from '@/components/form-message';
import { LoginForm as LoginFormPost } from '@/components/login-form';
import { LogoNesco } from '@/components/Element/index';
import Link from 'next/link';
import Image from 'next/image';

export default async function LoginPage(props: { searchParams: Promise<Message> }) {
  const { searchParams } = await props;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-darkblue to-[#0e1c28] p-6 sm:p-10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute -right-10 top-10 h-40 w-40 rounded-full bg-[#61CCC2]/10 blur-3xl"></div>
        <div className="animate-float absolute -left-20 bottom-40 h-60 w-60 rounded-full bg-[#F8D371]/10 blur-3xl"></div>
      </div>

      <Link
        href="/"
        className="group fixed left-6 top-6 z-10 flex cursor-pointer items-center space-x-1 transition-transform duration-300 hover:scale-105 2xl:space-x-4"
      >
        <LogoNesco className="w-[10vw] max-w-[100px] transition-transform duration-500 group-hover:scale-110" />
        <span className="font-kodeMono text-[6vw] font-bold text-[#61CCC2] transition-colors duration-500 group-hover:text-[#F8D371] xl:text-[2.5vw]">
          NESCO
        </span>
      </Link>

      <div className="relative z-10 flex w-full max-w-md flex-col gap-8 rounded-2xl bg-white/10 p-8 shadow-lg backdrop-blur-md">
        <LoginFormPost />
        {/* <FormMessage message={searchParams} /> */}
      </div>

      <div className="absolute bottom-0 w-full">
        <Image
          src="/assets/auth/Lantai.svg"
          alt="Background"
          width={1920}
          height={300}
          className="h-auto w-full object-cover"
          priority
        />
      </div>
    </div>
  );
}
