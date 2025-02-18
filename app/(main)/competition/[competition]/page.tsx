'use server';

import { agendaData } from '@/modules/data/data';
import { notFound } from 'next/navigation';
import { Details, Hero, Prizepool, Timeline } from '@/modules/competition';

export default async function Page({ params }: { params: Promise<{ competition: string }> }) {
  const { competition: slug } = await params;
  const slugList = agendaData.map((agenda) => agenda.slug);
  if (slug === 'seminar') {
    return notFound();
  }
  if (!slugList.includes(slug)) {
    return notFound();
  }
  return (
    <>
      <Hero slug={slug} />
      <Details slug={slug} />
      <Prizepool slug={slug} />
      <Timeline slug={slug} />
    </>
  );
}
