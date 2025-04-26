'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Tables } from '@/types/database.types';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { FiCalendar, FiClock, FiMapPin, FiUser, FiUsers, FiMic } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { IoArrowBackOutline } from 'react-icons/io5';

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
  const [formErrors, setFormErrors] = useState({
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

    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      instance: '',
      wa_handle: '',
    };

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.instance.trim()) {
      errors.instance = 'Institution/organization is required';
      isValid = false;
    }

    if (!formData.wa_handle.trim()) {
      errors.wa_handle = 'WhatsApp number is required';
      isValid = false;
    } else {
      // Simple WhatsApp number validation
      const waPattern = /^(\+\d{1,4})?[\s]?\d{9,15}$/;
      if (!waPattern.test(formData.wa_handle.replace(/\s/g, ''))) {
        errors.wa_handle = 'Please enter a valid WhatsApp number';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
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
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#002A30] to-[#61CCC2]">
        <div className="z-10 flex flex-col items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent shadow-lg"></div>
          <p className="mt-6 text-lg font-medium text-white">Loading seminar information...</p>
        </div>
      </div>
    );
  }

  // No seminar available
  if (!loading && !seminar) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#002A30] to-[#61CCC2]">
        <div className="absolute left-4 top-4 z-20">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md bg-white bg-opacity-20 px-4 py-2 text-white transition-all duration-300 hover:bg-opacity-30 hover:shadow-lg"
          >
            <IoArrowBackOutline size={18} />
            <span>Back to Home</span>
          </Link>
        </div>
        <div className="z-10 max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-800">No Seminar Available</h1>
          <p className="mb-6 text-gray-600">
            There are currently no upcoming seminars scheduled. Please check back later for future
            events.
          </p>
          <Link
            href="/"
            className="inline-block rounded-md bg-gradient-to-r from-[#003C43] to-[#0A6C74] px-6 py-3 text-white transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0A6C74] focus:ring-offset-2"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#002A30] to-[#61CCC2] py-16">
      <div className="fixed left-4 top-4 z-30">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md bg-white bg-opacity-20 px-4 py-2 text-white transition-all duration-300 hover:bg-opacity-30 hover:shadow-lg"
        >
          <IoArrowBackOutline size={18} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="mx-auto max-w-[60%] px-4">
        {/* Google Form Style Header */}
        <div className="mb-6 overflow-hidden rounded-t-xl bg-white">
          <div className="h-40 w-full overflow-hidden sm:h-56">
            <img
              src="/seminar/registration/header.png"
              alt="Seminar Header"
              className="h-full w-full object-cover"
            />
          </div>
          {/* <div className="border-l-8 border-blue p-6">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">Seminar Registration</h1>
            <p className="text-gray-600">
              Register for our upcoming seminar and join us for an insightful discussion
            </p>
          </div> */}
        </div>

        {/* Seminar Details Card - Google Form Style */}
        <div className="mb-6 overflow-hidden rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-5 text-xl font-bold text-gray-800">Seminar Details</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-blue">
                  <FiUser className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Theme</p>
                  <p className="text-base text-gray-800">{seminar?.theme || 'TBA'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-blue">
                  <FiUsers className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Speakers</p>
                  <p className="text-base text-gray-800">{seminar?.key_speaker || 'TBA'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-blue">
                  <FiMic className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Moderator</p>
                  <p className="text-base text-gray-800">{seminar?.moderator || 'TBA'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-blue">
                  <FiCalendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-base text-gray-800">
                    {formatDate(seminar?.seminar_start || '')}
                    {seminar?.seminar_end &&
                      seminar.seminar_end !== seminar.seminar_start &&
                      ` - ${formatDate(seminar.seminar_end)}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-blue">
                  <FiClock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="text-base text-gray-800">
                    {formatTime(seminar?.start_time || '')}
                    {seminar?.end_time && ` - ${formatTime(seminar.end_time)} WIB`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-blue">
                  <FiMapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-base text-gray-800">{seminar?.place || 'TBA'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form - Google Form Style */}
        <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-md">
          {alreadyRegistered ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-green-600"
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
              </div>
              <h2 className="mb-4 text-2xl font-bold text-gray-800">You're Registered!</h2>
              <p className="mb-8 text-lg text-gray-600">
                You have successfully registered for this seminar. We look forward to seeing you
                there!
              </p>

              <div className="mb-6 w-full max-w-md rounded-xl bg-green-50 p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Join our WhatsApp Group
                </h3>
                <p className="mb-4 text-gray-600">
                  Stay updated with the latest information about the seminar.
                </p>
                <a
                  href="https://chat.whatsapp.com/KLILQRXmVJJ6C2WJHmSTvu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-base font-medium text-white transition-all duration-300 hover:bg-green-700 hover:shadow-lg"
                >
                  <FaWhatsapp className="h-5 w-5" />
                  <span>Join WhatsApp Group</span>
                </a>
              </div>

              <Link
                href="/"
                className="mt-2 inline-flex items-center rounded-lg bg-gradient-to-r from-[#003C43] to-[#0A6C74] px-6 py-3 text-white transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0A6C74] focus:ring-offset-2"
              >
                Return to Home
              </Link>
            </div>
          ) : (
            <>
              <div className="border-l-8 border-blue p-6">
                <h2 className="text-xl font-bold text-gray-800">Registration Form</h2>
                <p className="mt-1 text-gray-600">
                  Please fill out the form below to register for the seminar.
                </p>
              </div>

              <div className="px-6 pb-6">
                {success && (
                  <div className="mb-6 flex items-center rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Registration successful! You have been registered for the seminar.
                  </div>
                )}

                {error && (
                  <div className="mb-6 flex items-center rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div className="rounded-lg bg-gray-50 p-5">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-4 py-3 shadow-sm transition-all focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue ${
                        formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Enter your full name"
                      disabled={isSubmitting}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="rounded-lg bg-gray-50 p-5">
                    <label
                      htmlFor="instance"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Institution/Organization <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="instance"
                      name="instance"
                      type="text"
                      value={formData.instance}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-4 py-3 shadow-sm transition-all focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue ${
                        formErrors.instance
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Enter your institution or organization"
                      disabled={isSubmitting}
                    />
                    {formErrors.instance && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.instance}</p>
                    )}
                  </div>

                  <div className="rounded-lg bg-gray-50 p-5">
                    <label
                      htmlFor="wa_handle"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaWhatsapp className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="wa_handle"
                        name="wa_handle"
                        type="text"
                        value={formData.wa_handle}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border bg-white py-3 pl-10 pr-4 shadow-sm transition-all focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue ${
                          formErrors.wa_handle ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="e.g., +62812345678"
                        disabled={isSubmitting}
                      />
                    </div>
                    {formErrors.wa_handle ? (
                      <p className="mt-1 text-sm text-red-600">{formErrors.wa_handle}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">
                        Include country code (e.g., +62 for Indonesia)
                      </p>
                    )}
                  </div>

                  <div className="border-t pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full rounded-lg px-6 py-3 font-medium text-white shadow-sm transition-all duration-300 ${
                        isSubmitting
                          ? 'cursor-not-allowed bg-gray-400'
                          : 'bg-gradient-to-r from-[#003C43] to-[#0A6C74] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0A6C74] focus:ring-offset-2'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="mr-2 h-5 w-5 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Registering...
                        </div>
                      ) : (
                        'Complete Registration'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
