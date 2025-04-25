'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import ParticlesContainer from '@/components/UI/ParticlesContainer';
import { Tables } from '@/types/database.types';
import { User } from '@supabase/supabase-js';

export default function SeminarPage() {
  const [seminar, setSeminar] = useState<Tables<'seminars'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    instance: '',
    wa_handle: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // Check authentication and fetch user
  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/sign-in?redirect=/seminar');
        return;
      }

      setUser(user);

      // Check if user is already registered for the seminar
      if (user) {
        const { data } = await supabase
          .from('seminar_registrants')
          .select('*')
          .eq('user_id', user.id);

        if (data && data.length > 0) {
          setAlreadyRegistered(true);
        }
      }
    }

    getUser();
  }, [router, supabase]);

  // Fetch the seminar
  useEffect(() => {
    async function fetchSeminar() {
      setLoading(true);
      // Since there's only one seminar, fetch the latest one
      const { data, error } = await supabase
        .from('seminars')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching seminar:', error);
        setError('Failed to load seminar details. Please try again later.');
      } else {
        setSeminar(data);
      }
      setLoading(false);
    }

    fetchSeminar();
  }, [supabase]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.instance.trim()) {
      setError('Please enter your institution/organization');
      return false;
    }
    if (!formData.wa_handle.trim()) {
      setError('Please enter your WhatsApp number');
      return false;
    }
    // Simple WhatsApp number validation
    const waPattern = /^(\+\d{1,4})?[\s]?\d{9,15}$/;
    if (!waPattern.test(formData.wa_handle.replace(/\s/g, ''))) {
      setError('Please enter a valid WhatsApp number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!seminar) {
      setError('Seminar information is not available');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(user?.id);
      const { data, error: submitError } = await supabase
        .from('seminar_registrants')
        .insert([
          {
            name: formData.name,
            instance: formData.instance,
            wa_handle: formData.wa_handle,
            seminar_id: seminar.id,
            user_id: user?.id,
          },
        ])
        .select();

      if (submitError) {
        throw submitError;
      }

      setSuccess(true);
      setFormData({ name: '', instance: '', wa_handle: '' });
      setAlreadyRegistered(true);
      window.open(
        'https://chat.whatsapp.com/KLILQRXmVJJ6C2WJHmSTvu',
        '_blank',
        'noopener,noreferrer',
      );
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#003C43] to-[#61CCC2]">
        <ParticlesContainer className="absolute top-0 z-0 min-h-[100svh] w-full md:min-h-screen" />
        <div className="z-10 flex flex-col items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-b-transparent"></div>
          <p className="mt-4 text-white">Loading seminar information...</p>
        </div>
      </div>
    );
  }

  // No seminar available
  if (!loading && !seminar) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#003C43] to-[#61CCC2]">
        {/* <ParticlesContainer className="absolute top-0 z-0 min-h-[100svh] w-full md:min-h-screen" /> */}
        <div className="absolute left-4 top-4 z-20">
          <button
            onClick={() => router.push('/')}
            className="rounded-md bg-blue px-3 py-2 text-white transition-colors hover:bg-yellow"
          >
            Kembali ke Beranda
          </button>
        </div>
        <div className="z-10 max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">No Seminar Available</h1>
          <p className="text-gray-600">
            There are currently no upcoming seminars scheduled. Please check back later.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 rounded-md bg-blue px-6 py-2 text-white hover:bg-yellow"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-b from-[#003C43] to-[#61CCC2] py-[5%]">
      {/* <ParticlesContainer className="absolute top-0 z-0 min-h-[100svh] w-full md:min-h-screen" /> */}
      {/* <div className="absolute left-4 top-4 z-20">
        <button
          onClick={() => router.push('/')}
          className="rounded-md bg-blue px-3 py-2 text-white transition-colors hover:bg-yellow"
        >
          Kembali ke Beranda
        </button>
      </div> */}

      <div className="z-[10] mx-auto w-[90%] max-w-4xl md:w-[80%]">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">Seminar Registration</h1>

        {/* Seminar Details Card */}
        <div className="mb-10 overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="bg-blue p-6">
            <h2 className="text-2xl font-bold text-white">{seminar?.title}</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Theme:</span> {seminar?.theme}
              </p>
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Speaker:</span> {seminar?.key_speaker}
              </p>
              <p className="mt-2 text-gray-700">
                <span className="font-semibold">Date:</span> {formatDate(seminar?.seminar_start!)}
                {seminar?.seminar_end &&
                  seminar.seminar_end !== seminar.seminar_start &&
                  ` - ${formatDate(seminar.seminar_end)}`}
              </p>
              <p className="mt-1 text-gray-700">
                <span className="font-semibold">Time:</span> {formatTime(seminar?.start_time!)}
                {seminar?.end_time && ` - ${formatTime(seminar.end_time)} WIB`}
              </p>
              <p className="mt-1 text-gray-700">
                <span className="font-semibold">Place:</span> {seminar?.place}
              </p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          {alreadyRegistered ? (
            <div className="rounded-lg bg-green-50 p-6 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">You&apos;re Registered!</h2>
              <p className="mt-2 text-gray-600">
                You have successfully registered for this seminar. We look forward to seeing you
                there!
              </p>
              <div className="mt-6 rounded-lg bg-green-100 p-4">
                <p className="font-medium text-gray-700">
                  Please join our WhatsApp group for updates:
                </p>
                <a
                  href="https://chat.whatsapp.com/KLILQRXmVJJ6C2WJHmSTvu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700"
                >
                  Join WhatsApp Group
                </a>
              </div>
              <button
                onClick={() => router.push('/')}
                className="mt-6 rounded-md bg-blue px-6 py-2 text-white hover:bg-yellow"
              >
                Return to Home
              </button>
            </div>
          ) : (
            <>
              <h2 className="mb-6 text-2xl font-bold text-gray-800">Registration Form</h2>

              {success && (
                <div className="mb-6 rounded-lg border border-green-400 bg-green-100 p-4 text-green-700">
                  Registration successful! You have been registered for the seminar.
                </div>
              )}

              {error && (
                <div className="mb-6 rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name:
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label
                    htmlFor="instance"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Institution/Organization:
                  </label>
                  <input
                    id="instance"
                    name="instance"
                    type="text"
                    value={formData.instance}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                    placeholder="Enter your institution or organization"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label
                    htmlFor="wa_handle"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    WhatsApp Number:
                  </label>
                  <input
                    id="wa_handle"
                    name="wa_handle"
                    type="text"
                    value={formData.wa_handle}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                    placeholder="e.g., +62812345678"
                    disabled={isSubmitting}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Include country code (e.g., +62 for Indonesia)
                  </p>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`rounded-md px-6 py-3 text-white transition-colors ${
                      isSubmitting
                        ? 'cursor-not-allowed bg-gray-400'
                        : 'bg-blue hover:bg-yellow focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2'
                    }`}
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
