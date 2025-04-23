'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { Button } from '@/components/UI/button';
import { AlertCircle, FileIcon, XCircleIcon } from 'lucide-react';
import { dataTimeline } from '@/modules/data/timeline';
import DashboardSkeleton from '@/components/Skeleton/DashboardSkeleton';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [teamData, setTeamData] = useState<any>(null);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamFiles, setTeamFiles] = useState<any>(null);
  const [teamLink, setTeamLink] = useState<string>('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [secondSubmissionFile, setSecondSubmissionFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [secondUploadStatus, setSecondUploadStatus] = useState('idle');
  const [originalityUploadStatus, setOriginalityUploadStatus] = useState('idle');
  const [originalityFile, setOriginalityFile] = useState<File | null>(null);
  const [originals, setOriginals] = useState<any[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [submissionFolderId, setSubmissionFolderId] = useState<string | null>(null);
  const [submissionFileId, setSubmissionFileId] = useState<string | null>(null);

  const [deadlineData, setDeadlineData] = useState<any>(null);
  const [isPastDeadline, setIsPastDeadline] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchUserAndTeamData() {
      setIsLoading(true);

      // Fetch user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/sign-in');
        return;
      }
      setUser(user);

      // Fetch deadline data from Supabase
      const { data: deadline, error: deadlineError } = await supabase
        .from('deadlines')
        .select('*')
        .eq('id', '1')
        .single();

      if (deadlineError) {
        console.error('Error fetching deadline:', deadlineError);
      } else if (deadline) {
        setDeadlineData(deadline);

        // Check if current time is past the deadline
        const now = new Date();
        const deadlineTime = new Date(deadline.deadline);
        setIsPastDeadline(now > deadlineTime);
      }

      // Fetch team data
      const { data: teamsData } = await supabase
        .from('teams')
        .select('*')
        .eq('email', user.email)
        .single();

      // Rest of your existing code...
      if (teamsData) {
        if (teamsData.competition) {
          const FolderId =
            teamsData.competition === 'Innovation Challenge'
              ? process.env.NEXT_PUBLIC_INNOVATION_SUBMISSION_FOLDER_ID
              : teamsData.competition.includes('Poster')
                ? process.env.NEXT_PUBLIC_POSTER_SUBMISSION_FOLDER_ID
                : process.env.NEXT_PUBLIC_PAPER_SUBMISSION_FOLDER_ID;
          setSubmissionFolderId(FolderId!);
        }
        setTeamData(teamsData);

        // Fetch team members
        const { data: membersData } = await supabase
          .from('team_members')
          .select('*')
          .eq('team_id', teamsData.id);

        if (membersData) {
          setTeamMembers(membersData);
        }

        // Fetch team files
        const { data: filesData } = await supabase
          .from('team_files')
          .select('*')
          .eq('team_id', teamsData.id)
          .single();

        if (filesData) {
          setTeamFiles(filesData);
        }

        // Fetch team links
        const { data: linksData } = await supabase
          .from('team_links')
          .select('*')
          .eq('team_id', teamsData.id)
          .single();

        if (linksData) {
          setTeamLink(linksData.drive_link);
        }

        // Fetch submissions
        const { data: submissionData } = await supabase
          .from('submissions')
          .select('*')
          .eq('team_id', teamsData.id);

        if (submissionData) {
          setSubmissions(submissionData);
        } else {
          const { data: submissionData } = await supabase
            .from('submissions')
            .insert([
              {
                team_id: teamsData.id,
                created_at: new Date().toISOString(),
              },
            ])
            .select('*');
          setSubmissions(submissionData!);
        }

        const { data: registrationData } = await supabase
          .from('registrations')
          .select('*')
          .eq('team_id', teamsData.id)
          .single();

        if (registrationData) {
          setRegistrationData(registrationData);
        }
      } else {
        router.push('/register');
      }

      setIsLoading(false);
    }

    fetchUserAndTeamData();

    // Set up a timer to check the deadline status every minute
    const timer = setInterval(() => {
      if (deadlineData) {
        const now = new Date();
        const deadlineTime = new Date(deadlineData.deadline);
        setTimeRemaining(
          `${Math.floor((deadlineTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))}d ${Math.floor(
            (deadlineTime.getTime() - now.getTime()) / (1000 * 60 * 60),
          )}h ${Math.floor((deadlineTime.getTime() - now.getTime()) / (1000 * 60))}m`,
        );
        setIsPastDeadline(now > deadlineTime);
      }
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [router, supabase]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setSubmissionFile(e.target.files[0]);
  };

  const handleSecondFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setSecondSubmissionFile(e.target.files[0]);
  };

  const handleOriginalityFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setOriginalityFile(e.target.files[0]);
  };

  const uploadSubmissionToSupabase = async (
    fileName: string,
    competitionCode: string,
    file: File,
    type: number,
    team_id: string,
  ) => {
    if (type === 1) {
      if (!submissionFile || !teamData) return;

      setUploadStatus('loading');
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('submission')
          .upload(`${competitionCode}/${team_id}/${fileName}`, file);

        if (uploadError) {
          console.error('Error uploading to Supabase:', uploadError);
          return;
        }
        // Find existing submission record
        const { data: existingSubmission } = await supabase
          .from('submissions')
          .select('id')
          .eq('team_id', teamData.id)
          .single();

        // Update the existing record or create a new one if it doesn't exist
        const { error: submissionError } = existingSubmission
          ? await supabase
              .from('submissions')
              .update({ submission: uploadData.path, submitted_at_1: new Date().toISOString() })
              .eq('id', existingSubmission.id)
          : await supabase.from('submissions').insert({
              team_id: teamData.id,
              submission: uploadData.path,
              submitted_at_1: new Date().toISOString(),
              created_at: new Date().toISOString(),
            });

        if (submissionError) throw submissionError;

        // Refresh submissions
        const { data: submissionData } = await supabase
          .from('submissions')
          .select('*')
          .eq('team_id', teamData.id);

        if (submissionData) {
          setSubmissions(submissionData);
        }

        setUploadStatus('success');
        setSubmissionFile(null);
      } catch (error) {
        console.error('Submission error:', error);
        setUploadStatus('error');
      }
    } else if (type === 2) {
      if (!secondSubmissionFile || !teamData) return;

      setSecondUploadStatus('loading');
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('submission')
          .upload(`${competitionCode}/${team_id}/${fileName}`, file);

        if (uploadError) {
          console.error('Error uploading to Supabase:', uploadError);
          return;
        }
        // Find existing submission record
        const { data: existingSubmission } = await supabase
          .from('submissions')
          .select('id')
          .eq('team_id', teamData.id)
          .single();

        // Update the existing record or create a new one if it doesn't exist
        const { error: submissionError } = existingSubmission
          ? await supabase
              .from('submissions')
              .update({ submission_2: uploadData.path, submitted_at_2: new Date().toISOString() })
              .eq('id', existingSubmission.id)
          : await supabase.from('submissions').insert({
              team_id: teamData.id,
              submission_2: uploadData.path,
              submitted_at_2: new Date().toISOString(),
              created_at: new Date().toISOString(),
            });

        if (submissionError) throw submissionError;

        // Refresh submissions
        const { data: submissionData } = await supabase
          .from('submissions')
          .select('*')
          .eq('team_id', teamData.id);

        if (submissionData) {
          setSubmissions(submissionData);
        }

        setSecondUploadStatus('success');
        setSecondSubmissionFile(null);
      } catch (error) {
        console.error('Submission error:', error);
        setSecondUploadStatus('error');
      }
    } else {
      if (!originalityFile || !teamData) return;

      setOriginalityUploadStatus('loading');
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('submission')
          .upload(`${competitionCode}/${team_id}/${fileName}`, file);

        if (uploadError) {
          console.error('Error uploading to Supabase:', uploadError);
          return;
        }
        // Find existing submission record
        const { data: existingSubmission } = await supabase
          .from('submissions')
          .select('id')
          .eq('team_id', teamData.id)
          .single();

        // Update the existing record or create a new one if it doesn't exist
        const { error: submissionError } = existingSubmission
          ? await supabase
              .from('submissions')
              .update({ originality: uploadData.path, submitted_at_3: new Date().toISOString() })
              .eq('id', existingSubmission.id)
          : await supabase.from('submissions').insert({
              team_id: teamData.id,
              originality: uploadData.path,
              submitted_at_3: new Date().toISOString(),
              created_at: new Date().toISOString(),
            });

        if (submissionError) throw submissionError;

        // Refresh submissions
        const { data: submissionData } = await supabase
          .from('submissions')
          .select('*')
          .eq('team_id', teamData.id);

        if (submissionData) {
          setSubmissions(submissionData);
        }

        setOriginalityUploadStatus('success');
        setOriginalityFile(null);
      } catch (error) {
        console.error('Submission error:', error);
        setOriginalityUploadStatus('error');
      }
    }
  };

  const viewSupabaseBucketFile = async (path: string) => {
    const { data, error } = await supabase.storage.from('submission').createSignedUrl(path, 60, {
      download: true,
    });

    if (error) {
      console.error('Error fetching signed URL:', error);
      return;
    }

    window.open(data?.signedUrl, '_blank');
  };

  const deleteSupabaseBucketFile = async (path: string, type: number) => {
    const { error } = await supabase.storage.from('submission').remove([path]);

    if (error) {
      console.error('Error deleting file:', error);
      return;
    }

    if (type === 1) {
      const { data, error } = await supabase
        .from('submissions')
        .update({ submission: null })
        .eq('team_id', teamData.id)
        .select();

      if (error) {
        console.error('Error deleting submission:', error);
        return;
      }

      if (data) {
        setSubmissions(data);
      }
    } else if (type === 2) {
      const { data, error } = await supabase
        .from('submissions')
        .update({ submission_2: null })
        .eq('team_id', teamData.id)
        .select();

      if (error) {
        console.error('Error deleting submission:', error);
        return;
      }

      if (data) {
        setSubmissions(data);
      }
    } else {
      const { data, error } = await supabase
        .from('submissions')
        .update({ originality: null })
        .eq('team_id', teamData.id)
        .select();

      if (error) {
        console.error('Error deleting submission:', error);
        return;
      }

      if (data) {
        setSubmissions(data);
      }
    }
  };

  const convertCompetitionCode = (competition: string) => {
    if (competition === 'Innovation Challenge') return 'innovation';
    if (competition === 'Poster Competition 1 Karya') return 'poster';
    if (competition === 'Poster Competition 2 Karya') return 'poster';
    if (competition === 'Paper Competition') return 'paper';
    return 'originality';
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-[100svh] w-full bg-gradient-to-b from-[#61CCC2] to-[#FFE08D] md:min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Button
            onClick={() => router.push('/')}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <span>&#8592;</span> Kembali ke Beranda
          </Button>
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{teamData?.competition}</span>
                <Badge variant={registrationData?.verified ? 'success' : 'secondary'}>
                  {registrationData?.verified ? 'Terverifikasi' : 'Menunggu Verifikasi'}
                </Badge>
              </CardTitle>
              <CardDescription>Status Pendaftaran dan Informasi Tim</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="data" className="w-full">
          <TabsList
            className={`mb-4 grid w-full ${registrationData?.verified && teamData?.competition !== 'Scientific Debate' ? 'grid-cols-3' : 'grid-cols-2'}`}
          >
            <TabsTrigger value="data" className="data-[state=active]:text-white">
              Data
            </TabsTrigger>
            {/* <TabsTrigger value="timeline">Timeline</TabsTrigger> */}
            {registrationData?.verified && teamData?.competition !== 'Scientific Debate' && (
              <TabsTrigger value="submission" className="data-[state=active]:text-white">
                Submission
              </TabsTrigger>
            )}
            <TabsTrigger value="timeline" className="data-[state=active]:text-white">
              Timeline
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Data Tim</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Nama Tim</h3>
                      <p>{teamData?.team_name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Institusi</h3>
                      <p>{teamData?.institution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Anggota</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {teamMembers.map((member, index) => (
                      <li
                        key={member.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <span>{member.name}</span>
                        <Badge variant="outline">
                          {index === 0 ? 'Ketua' : `Anggota ${index}`}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Data Registrasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {teamFiles &&
                      [
                        { label: 'Foto 3x4', fileId: teamFiles.photo },
                        { label: 'Kartu Pelajar/Mahasiswa', fileId: teamFiles.student_card },
                        { label: 'Bukti Follow Instagram', fileId: teamFiles.instagram_follow },
                        { label: 'Bukti Upload Twibbon', fileId: teamFiles.twibbon },
                        { label: 'Bukti Pembayaran', fileId: teamFiles.payment },
                      ].map((file, index) => (
                        <div key={index} className="flex items-center gap-2 rounded-md border p-3">
                          <FileIcon size={18} />
                          <span>{file.label}</span>
                          <a
                            href={`https://drive.google.com/file/d/${file.fileId}/view`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 ml-auto hover:underline"
                          >
                            Lihat
                          </a>
                        </div>
                      ))}
                    {teamLink && (
                      <div className="flex items-center gap-2 rounded-md border p-3">
                        <FileIcon size={18} />
                        <span>Link Google Drive</span>
                        <a
                          href={teamLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 ml-auto hover:underline"
                        >
                          Lihat
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="submission">
            <Card>
              <CardHeader>
                <CardTitle>Upload Submission</CardTitle>
                <CardDescription>
                  Upload berkas submission lomba {teamData?.competition}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {teamData?.competition === 'Scientific Debate' ? (
                    <div className="rounded-md bg-amber-50 p-4 text-amber-800">
                      Lomba Scientific Debate tidak memerlukan submission karya.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Submission Deadline Alert */}
                      <div className="col-span-full mb-6">
                        <div className="flex items-center rounded-lg border border-amber-200 bg-amber-50 p-4">
                          <div className="mr-4 rounded-full bg-amber-100 p-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-amber-600"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="8" x2="12" y2="12" />
                              <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-amber-800">Deadline Submission</h4>
                            <p className="text-amber-700">
                              {deadlineData
                                ? new Date(deadlineData.deadline).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })
                                : ''}
                              {deadlineData
                                ? ' ' +
                                  new Date(deadlineData.deadline).toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZoneName: 'short',
                                  })
                                : ''}
                            </p>
                            <div className="mt-1 text-sm text-amber-600">
                              {isPastDeadline ? (
                                <span className="font-medium text-red-600">
                                  Deadline telah berakhir
                                </span>
                              ) : deadlineData ? (
                                <>
                                  <span className="font-medium text-green-600">
                                    Tersisa {timeRemaining}
                                  </span>
                                </>
                              ) : (
                                'Loading...'
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {isPastDeadline && (
                        <div className="col-span-full mb-4 rounded-md bg-red-50 p-4 text-red-800">
                          <div className="flex items-center">
                            <AlertCircle className="mr-2 h-5 w-5" />
                            <span className="font-medium">Periode submission telah berakhir.</span>
                          </div>
                          <p className="mt-1">
                            Submission ditutup pada{' '}
                            {deadlineData
                              ? new Date(deadlineData.deadline).toLocaleDateString('id-ID')
                              : ''}{' '}
                            pukul{' '}
                            {deadlineData
                              ? new Date(deadlineData.deadline).toLocaleTimeString('id-ID')
                              : ''}
                            .
                          </p>
                        </div>
                      )}
                      {/* Main Submission */}
                      {submissions.find((s) => s.submission) ? (
                        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-800">Karya Lomba</h3>
                            <Badge variant="success" className="px-2 py-1 text-xs">
                              Submitted
                            </Badge>
                          </div>
                          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 flex h-10 w-10 items-center justify-center rounded-full">
                                <FileIcon size={20} className="text-blue-600" />
                              </div>
                              <div className="space-y-1">
                                <p className="font-medium text-gray-700">Submission File</p>
                                <p className="text-xs text-gray-500">
                                  Submitted on{' '}
                                  {new Date(
                                    submissions.find((s) => s.submitted_at_1)?.submitted_at_1,
                                  ).toLocaleDateString()}{' '}
                                  at{' '}
                                  {new Date(
                                    submissions.find((s) => s.submitted_at_1)?.submitted_at_1,
                                  ).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                onClick={() =>
                                  viewSupabaseBucketFile(
                                    submissions.find((s) => s.submission)?.submission!,
                                  )
                                }
                              >
                                <FileIcon size={16} className="mr-1" /> View File
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                onClick={() => {
                                  deleteSupabaseBucketFile(
                                    submissions.find((s) => s.submission)?.submission!,
                                    1,
                                  );
                                }}
                                disabled={isPastDeadline}
                              >
                                <XCircleIcon size={16} className="mr-1" /> Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-gray-300 p-6">
                          <div className="flex flex-col items-center justify-center space-y-2 text-center">
                            <input
                              id="submission-file"
                              type="file"
                              accept={
                                teamData?.competition.includes('Poster')
                                  ? 'image/*,.zip,.rar'
                                  : '.pdf'
                              }
                              onChange={handleFileUpload}
                              className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
                            />
                          </div>
                          <Button
                            onClick={async () =>
                              uploadSubmissionToSupabase(
                                `${teamData.id}-${Date.now()}.${submissionFile?.name.split('.').pop()}`,
                                convertCompetitionCode(teamData.competition),
                                submissionFile!,
                                1,
                                teamData.id,
                              )
                            }
                            disabled={
                              !submissionFile || uploadStatus === 'loading' || isPastDeadline
                            }
                            className="mt-4 w-full"
                          >
                            {uploadStatus === 'loading' ? 'Uploading...' : 'Submit Karya'}
                          </Button>
                        </div>
                      )}

                      {/* Second submission (only for Poster 2 Karya) */}
                      {teamData?.competition === 'Poster Competition 2 Karya' &&
                        (submissions.find((s) => s.submission_2) ? (
                          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="mb-3 flex items-center justify-between">
                              <h3 className="text-base font-semibold text-gray-800">Karya Kedua</h3>
                              <Badge variant="success" className="px-2 py-1 text-xs">
                                Submitted
                              </Badge>
                            </div>
                            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-100 flex h-10 w-10 items-center justify-center rounded-full">
                                  <FileIcon size={20} className="text-blue-600" />
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium text-gray-700">Submission File</p>
                                  <p className="text-xs text-gray-500">
                                    Submitted on{' '}
                                    {new Date(
                                      submissions.find((s) => s.submitted_at_2)?.submitted_at_2,
                                    ).toLocaleDateString()}{' '}
                                    at{' '}
                                    {new Date(
                                      submissions.find((s) => s.submitted_at_2)?.submitted_at_2,
                                    ).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                  onClick={() =>
                                    viewSupabaseBucketFile(
                                      submissions.find((s) => s.submission_2)?.submission_2!,
                                    )
                                  }
                                >
                                  <FileIcon size={16} className="mr-1" /> View File
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                  onClick={() => {
                                    deleteSupabaseBucketFile(
                                      submissions.find((s) => s.submission_2)?.submission_2!,
                                      2,
                                    );
                                  }}
                                  disabled={isPastDeadline}
                                >
                                  <XCircleIcon size={16} className="mr-1" /> Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed border-gray-300 p-6">
                            <div className="flex flex-col items-center justify-center space-y-2 text-center">
                              {/* <UploadIcon className="h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-500">Upload file poster kedua</p> */}
                              <input
                                id="second-submission-file"
                                type="file"
                                accept="image/*,.zip,.rar"
                                onChange={handleSecondFileUpload}
                                className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
                              />
                            </div>
                            <Button
                              onClick={async () =>
                                uploadSubmissionToSupabase(
                                  `${teamData.id}-${Date.now()}.${secondSubmissionFile?.name.split('.').pop()}`,
                                  convertCompetitionCode(teamData.competition),
                                  secondSubmissionFile!,
                                  2,
                                  teamData.id,
                                )
                              }
                              disabled={
                                !secondSubmissionFile ||
                                secondUploadStatus === 'loading' ||
                                isPastDeadline
                              }
                              className="mt-4 w-full"
                            >
                              {secondUploadStatus === 'loading'
                                ? 'Uploading...'
                                : 'Submit Karya Kedua'}
                            </Button>
                          </div>
                        ))}

                      {/* Originality file (only for Poster competitions) */}
                      {teamData?.competition.includes('Poster') &&
                        (submissions.find((s) => s.originality) ? (
                          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="mb-3 flex items-center justify-between">
                              <h3 className="text-base font-semibold text-gray-800">
                                Pernyataan Orisinalitas
                              </h3>
                              <Badge variant="success" className="px-2 py-1 text-xs">
                                Submitted
                              </Badge>
                            </div>
                            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-100 flex h-10 w-10 items-center justify-center rounded-full">
                                  <FileIcon size={20} className="text-blue-600" />
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium text-gray-700">Submission File</p>
                                  <p className="text-xs text-gray-500">
                                    Submitted on{' '}
                                    {new Date(
                                      submissions.find((s) => s.submitted_at_3)?.submitted_at_3,
                                    ).toLocaleDateString()}{' '}
                                    at{' '}
                                    {new Date(
                                      submissions.find((s) => s.submitted_at_3)?.submitted_at_3,
                                    ).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                  onClick={() =>
                                    viewSupabaseBucketFile(
                                      submissions.find((s) => s.originality)?.originality!,
                                    )
                                  }
                                >
                                  <FileIcon size={16} className="mr-1" /> View File
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                  onClick={() => {
                                    deleteSupabaseBucketFile(
                                      submissions.find((s) => s.originality)?.originality!,
                                      3,
                                    );
                                  }}
                                  disabled={isPastDeadline}
                                >
                                  <XCircleIcon size={16} className="mr-1" /> Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed border-gray-300 p-6">
                            <div className="flex flex-col items-center justify-center space-y-2 text-center">
                              <input
                                id="originality-file"
                                type="file"
                                accept=".pdf"
                                onChange={handleOriginalityFileUpload}
                                className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
                              />
                            </div>
                            <Button
                              onClick={async () =>
                                uploadSubmissionToSupabase(
                                  `${teamData.id}-${Date.now()}.${originalityFile?.name.split('.').pop()}`,
                                  convertCompetitionCode(teamData.competition),
                                  originalityFile!,
                                  3,
                                  teamData.id,
                                )
                              }
                              disabled={
                                !originalityFile ||
                                originalityUploadStatus === 'loading' ||
                                isPastDeadline
                              }
                              className="mt-4 w-full"
                            >
                              {originalityUploadStatus === 'loading'
                                ? 'Uploading...'
                                : 'Submit Pernyataan Orisinalitas'}
                            </Button>
                          </div>
                        ))}

                      {/* Status messages */}
                      {uploadStatus === 'error' && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 md:col-span-2">
                          Terjadi kesalahan saat upload. Silakan coba lagi.
                        </div>
                      )}

                      {uploadStatus === 'success' && (
                        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 md:col-span-2">
                          Submission berhasil diupload!
                        </div>
                      )}
                    </div>
                  )}

                  {teamData?.competition !== 'Scientific Debate' && (
                    <div className="bg-blue-50 text-blue-800 rounded-md p-4 text-sm">
                      <p className="font-medium">Petunjuk Submission:</p>
                      <ul className="ml-5 mt-2 list-disc space-y-1">
                        {teamData?.competition.includes('Poster') && (
                          <>
                            <li>
                              Poster harus diunggah dalam format gambar (JPG/PNG) atau file
                              terkompresi (ZIP/RAR)
                            </li>
                            <li>Surat pernyataan orisinalitas wajib diunggah dalam format PDF</li>
                          </>
                        )}
                        {!teamData?.competition.includes('Poster') &&
                          !teamData?.competition.includes('Scientific Debate') && (
                            <li>Karya harus diunggah dalam format PDF</li>
                          )}
                        <li>Deadline submission sesuai dengan timeline yang telah ditentukan</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Timeline Lomba</CardTitle>
                <CardDescription>
                  Jadwal kegiatan untuk lomba {teamData?.competition}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {teamData && (
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute bottom-0 left-4 top-0 w-0.5 bg-gray-200"></div>
                      <div className="space-y-6">
                        {(() => {
                          const competitionKey =
                            teamData?.competition === 'Technology Innovation'
                              ? 'innovation'
                              : teamData?.competition === 'Poster Competition 1 Karya' ||
                                  teamData?.competition === 'Poster Competition 2 Karya'
                                ? 'poster'
                                : 'paper';

                          // Import this at the top of your component when implementing

                          return dataTimeline[competitionKey].map((item, index) => (
                            <div key={index} className="flex">
                              <div className="mr-4 mt-1 flex-none">
                                <div className="bg-blue-500 flex h-8 w-8 items-center justify-center rounded-full text-white">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-medium">{item.kegiatan}</h3>
                                <div className="text-sm text-gray-600">
                                  {item.start === item.end
                                    ? item.start
                                    : `${item.start} - ${item.end}`}
                                </div>
                                <div className="bg-blue-50 mt-2 rounded-md px-3 py-2 text-sm">
                                  {index === 0
                                    ? 'Masa pendaftaran lomba'
                                    : index === dataTimeline[competitionKey].length - 1
                                      ? 'Pengumuman pemenang'
                                      : `Tahap ${index}`}
                                </div>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
