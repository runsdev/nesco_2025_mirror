'use client';

import ErrorPage from '@/components/ErrorPage';

export default function NotFound() {
  return <ErrorPage pesan="404" text1="Halaman Tidak Ditemukan :(" text2="Kembali ke Beranda" />;
}
