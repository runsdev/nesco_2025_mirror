'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Tables } from '@/types/database.types';

// Extend the seminar_registrants type to include email
type ParticipantWithEmail = Tables<'seminar_registrants'> & {
  email?: string;
};

export default function SeminarParticipantsPage() {
  const [participants, setParticipants] = useState<ParticipantWithEmail[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<ParticipantWithEmail[]>([]);
  const [seminar, setSeminar] = useState<Tables<'seminars'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'name', 'email', 'institution'

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

      // Get participants with email for this seminar
      const { data: participantsData, error: participantsError } = await supabase
        .from('seminar_registrants')
        .select('*')
        .eq('seminar_id', seminarData.id)
        .order('created_at', { ascending: false });

      if (participantsError) {
        setError(`Error loading participants: ${participantsError.message}`);
        setLoading(false);
        return;
      }

      const participantsWithEmail = participantsData || [];
      setParticipants(participantsWithEmail);
      setFilteredParticipants(participantsWithEmail);
      setLoading(false);
    }

    fetchData();
  }, [supabase]);

  // Filter participants when search term or filter option changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredParticipants(participants);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    const filtered = participants.filter((participant) => {
      if (filterBy === 'all') {
        return (
          participant.name?.toLowerCase().includes(lowerSearchTerm) ||
          false ||
          participant.email?.toLowerCase().includes(lowerSearchTerm) ||
          false ||
          participant.instance?.toLowerCase().includes(lowerSearchTerm) ||
          false ||
          participant.wa_handle?.toLowerCase().includes(lowerSearchTerm) ||
          false
        );
      } else if (filterBy === 'name') {
        return participant.name?.toLowerCase().includes(lowerSearchTerm) || false;
      } else if (filterBy === 'email') {
        return participant.email?.toLowerCase().includes(lowerSearchTerm) || false;
      } else if (filterBy === 'institution') {
        return participant.instance?.toLowerCase().includes(lowerSearchTerm) || false;
      } else if (filterBy === 'whatsapp') {
        return participant.wa_handle?.toLowerCase().includes(lowerSearchTerm) || false;
      }
      return false;
    });

    setFilteredParticipants(filtered);
  }, [searchTerm, filterBy, participants]);

  // Export participants to CSV
  const exportToCSV = () => {
    if (!participants.length) return;

    // Create CSV content
    const headers = ['Name', 'Email', 'Institution', 'WhatsApp', 'User ID', 'Registration Date'];
    const csvRows = [headers];

    participants.forEach((participant) => {
      const date = participant.created_at ? new Date(participant.created_at).toLocaleString() : '';
      csvRows.push([
        participant.name || '',
        participant.email || '',
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterBy(e.target.value);
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
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Search participants..."
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue focus:outline-none"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                <div>
                  <select
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue focus:outline-none"
                    value={filterBy}
                    onChange={handleFilterChange}
                  >
                    <option value="all">Search All Fields</option>
                    <option value="name">Search by Name</option>
                    <option value="email">Search by Email</option>
                    <option value="institution">Search by Institution</option>
                    <option value="whatsapp">Search by WhatsApp</option>
                  </select>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {filteredParticipants.length}{' '}
                    {filteredParticipants.length === 1 ? 'Participant' : 'Participants'}
                    {searchTerm && ` found for "${searchTerm}"`}
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
                        Email
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
                    {filteredParticipants.map((participant) => (
                      <tr key={participant.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">{participant.name}</td>
                        <td className="whitespace-nowrap px-6 py-4">{participant.email}</td>
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
