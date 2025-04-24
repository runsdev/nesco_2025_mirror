'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Tables } from '@/types/database.types';

export default function AdminSeminarPage() {
  const [seminar, setSeminar] = useState<Tables<'seminars'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    key_speaker: '',
    seminar_start: '',
    seminar_end: '',
    start_time: '',
    end_time: '',
  });

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

  // Fetch seminar
  useEffect(() => {
    async function fetchSeminar() {
      setLoading(true);
      const { data, error } = await supabase
        .from('seminars')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        setError(error.message);
      } else {
        setSeminar(data || null);

        if (data) {
          // Format dates for form inputs
          const startDate = data.seminar_start
            ? new Date(data.seminar_start).toISOString().split('T')[0]
            : '';
          const endDate = data.seminar_end
            ? new Date(data.seminar_end).toISOString().split('T')[0]
            : '';

          // Format times for form inputs
          const startTime = data.start_time
            ? new Date(data.start_time).toISOString().substr(11, 5)
            : '';
          const endTime = data.end_time ? new Date(data.end_time).toISOString().substr(11, 5) : '';

          setFormData({
            title: data.title || '',
            key_speaker: data.key_speaker || '',
            seminar_start: startDate,
            seminar_end: endDate,
            start_time: startTime,
            end_time: endTime,
          });
        }
      }
      setLoading(false);
    }

    fetchSeminar();
  }, [supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.key_speaker || !formData.seminar_start) {
      setError('Please fill all required fields');
      return;
    }

    try {
      let data, submitError;

      if (seminar) {
        // Update existing seminar
        const { data: updateData, error: updateError } = await supabase
          .from('seminars')
          .update({
            title: formData.title,
            key_speaker: formData.key_speaker,
            seminar_start: formData.seminar_start,
            seminar_end: formData.seminar_end || null,
            start_time: formData.start_time
              ? new Date(`2000-01-01T${formData.start_time}:00`).toISOString()
              : null,
            end_time: formData.end_time
              ? new Date(`2000-01-01T${formData.end_time}:00`).toISOString()
              : null,
          })
          .eq('id', seminar.id)
          .select();

        data = updateData;
        submitError = updateError;
      } else {
        // Create new seminar
        const { data: insertData, error: insertError } = await supabase
          .from('seminars')
          .insert([
            {
              title: formData.title,
              key_speaker: formData.key_speaker,
              seminar_start: formData.seminar_start,
              seminar_end: formData.seminar_end || null,
              start_time: formData.start_time
                ? new Date(`2000-01-01T${formData.start_time}:00`).toISOString()
                : null,
              end_time: formData.end_time
                ? new Date(`2000-01-01T${formData.end_time}:00`).toISOString()
                : null,
            },
          ])
          .select();

        data = insertData;
        submitError = insertError;
      }

      if (submitError) throw submitError;

      // Update state with new data
      if (data && data[0]) setSeminar(data[0]);

      setIsEditing(false);

      // Refresh the page to show updated data
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    const time = new Date(timeString);
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(time);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003C43] to-[#61CCC2] p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-white">Manage Seminar</h1>

        {error && (
          <div className="mb-6 rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex h-40 items-center justify-center rounded-lg bg-white">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue border-b-transparent"></div>
            <span className="ml-2">Loading...</span>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 shadow-lg">
            {!isEditing && seminar ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{seminar.title}</h2>
                  <p className="mt-2 text-gray-700">
                    <span className="font-semibold">Speaker:</span> {seminar.key_speaker}
                  </p>
                  <p className="mt-2 text-gray-700">
                    <span className="font-semibold">Date:</span> {formatDate(seminar.seminar_start)}
                    {seminar.seminar_end &&
                      seminar.seminar_end !== seminar.seminar_start &&
                      ` - ${formatDate(seminar.seminar_end)}`}
                  </p>
                  {seminar.start_time && (
                    <p className="mt-1 text-gray-700">
                      <span className="font-semibold">Time:</span> {formatTime(seminar.start_time)}
                      {seminar.end_time && ` - ${formatTime(seminar.end_time)}`} WIB
                    </p>
                  )}
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-md bg-blue px-4 py-2 text-white hover:bg-yellow"
                  >
                    Edit Seminar
                  </button>

                  <button
                    onClick={() => router.push('/admin/seminar/participants')}
                    className="hover:bg-blue/80 rounded-md bg-blue px-4 py-2 text-white"
                  >
                    View Participants
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  {seminar ? 'Edit Seminar' : 'Create Seminar'}
                </h2>

                <div>
                  <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                    Seminar Title*:
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="key_speaker"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Key Speaker*:
                  </label>
                  <input
                    id="key_speaker"
                    name="key_speaker"
                    type="text"
                    value={formData.key_speaker}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="seminar_start"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Start Date*:
                    </label>
                    <input
                      id="seminar_start"
                      name="seminar_start"
                      type="date"
                      value={formData.seminar_start}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="seminar_end"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      End Date:
                    </label>
                    <input
                      id="seminar_end"
                      name="seminar_end"
                      type="date"
                      value={formData.seminar_end}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="start_time"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Start Time:
                    </label>
                    <input
                      id="start_time"
                      name="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="end_time"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      End Time:
                    </label>
                    <input
                      id="end_time"
                      name="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  {seminar && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="rounded-md bg-blue px-6 py-2 text-white transition-colors hover:bg-yellow"
                  >
                    {seminar ? 'Save Changes' : 'Create Seminar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
