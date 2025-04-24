'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Tables } from '@/types/database.types';

export default function SeminarParticipantsPage() {
  const [participants, setParticipants] = useState<Tables<'seminar_registrants'>[]>([]);
  const [seminar, setSeminar] = useState<Tables<'seminars'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  // Check if user is admin
  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/sign-in');
        return;
      }

      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('email', user.email)
        .single();

      if (!adminData) {
        router.push('/'); // Not an admin
      }
    }

    checkAdmin();
  }, [router, supabase]);

  // Fetch seminar details and participants
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Get latest seminar
      const { data: seminarData, error: seminarError } = await supabase
        .from('seminars')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (seminarError) {
        setError(`Error loading seminar: ${seminarError.message}`);
        setLoading(false);
        return;
      }

      setSeminar(seminarData);

      // Get participants for this seminar
      const { data: participantsData, error: participantsError } = await supabase
        .from('seminar_registrants')
        .select('*')
        .eq('seminar_id', seminarData.id)
        .order('created_at', { ascending: false });

      if (participantsError) {
        setError(`Error loading participants: ${participantsError.message}`);
      } else {
        setParticipants(participantsData || []);
      }

      setLoading(false);
    }

    fetchData();
  }, [supabase]);

  // Export participants to CSV
  const exportToCSV = () => {
    if (!participants.length) return;

    // Create CSV content
    const headers = ['Name', 'Institution', 'WhatsApp', 'User ID', 'Registration Date'];
    const csvRows = [headers];

    participants.forEach((participant) => {
      const date = participant.created_at ? new Date(participant.created_at).toLocaleString() : '';
      csvRows.push([
        participant.name || '',
        participant.instance || '',
        participant.wa_handle || '',
        participant.user_id || '',
        date,
      ]);
    });

    const csvContent = csvRows
      .map((row) =>
        row
          .map((cell) => (typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell))
          .join(','),
      )
      .join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const seminarTitle = seminar?.title?.replace(/\s+/g, '_') || 'seminar';

    link.setAttribute('href', url);
    link.setAttribute('download', `${seminarTitle}_participants.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003C43] to-[#61CCC2] p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 rounded-md bg-white px-3 py-2 text-blue hover:bg-gray-100"
          >
            &larr; Back
          </button>
          <h1 className="text-3xl font-bold text-white">
            {loading ? 'Loading...' : `Participants: ${seminar?.title}`}
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-lg bg-white p-6 shadow-lg">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue border-b-transparent"></div>
              <span className="ml-2">Loading participants...</span>
            </div>
          ) : participants.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {participants.length}{' '}
                    {participants.length === 1 ? 'Participant' : 'Participants'}
                  </h2>
                </div>
                <button
                  onClick={exportToCSV}
                  className="rounded-md bg-blue px-4 py-2 text-white hover:bg-yellow"
                >
                  Export to CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Institution
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        WhatsApp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        User ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Registration Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {participants.map((participant) => (
                      <tr key={participant.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">{participant.name}</td>
                        <td className="whitespace-nowrap px-6 py-4">{participant.instance}</td>
                        <td className="whitespace-nowrap px-6 py-4">{participant.wa_handle}</td>
                        <td className="whitespace-nowrap px-6 py-4">{participant.user_id}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {participant.created_at
                            ? new Date(participant.created_at).toLocaleString()
                            : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No participants registered for this seminar yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
