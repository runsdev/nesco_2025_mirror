'use client';

import ErrorPageWithCustomRedirect from '@/components/ErrorPageWithCustomRedirect';

export default function Page() {
  return (
    <ErrorPageWithCustomRedirect
      pesan="SOON"
      text1="Namun pendaftaran sudah dibuka!"
      text2="Daftar seminar sekarang!"
      redirect="/seminar/register"
    />
  );
}
