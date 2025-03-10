'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { Button } from '@/components/UI/button';
import { FileIcon, UploadIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { dataTimeline } from '@/modules/data/timeline';
import { uploadToDrive, createFolder, deleteFile } from '@/utils/google/action';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [teamData, setTeamData] = useState<any>(null);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamFiles, setTeamFiles] = useState<any>(null);
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

  const originalityFolderId = process.env.NEXT_PUBLIC_ORIGINALITY_SUBMISSION_FOLDER_ID;

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

      // Fetch team data
      const { data: teamsData } = await supabase
        .from('teams')
        .select('*')
        .eq('email', user.email)
        .single();

      if (teamsData) {
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

        const FolderId =
          teamData.competition === 'Innovation Challenge'
            ? process.env.NEXT_PUBLIC_INNOVATION_SUBMISSION_FOLDER_ID
            : teamData.competition.includes('Poster')
              ? process.env.NEXT_PUBLIC_POSTER_SUBMISSION_FOLDER_ID
              : process.env.NEXT_PUBLIC_PAPER_SUBMISSION_FOLDER_ID;

        setSubmissionFolderId(FolderId!);
      } else {
        router.push('/register');
      }

      setIsLoading(false);
    }

    fetchUserAndTeamData();
  }, [router, supabase]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setSubmissionFile(e.target.files[0]);
  };

  const handleSubmission = async () => {
    if (!submissionFile || !teamData) return;

    setUploadStatus('loading');

    try {
      // Create unique filename
      const fileExt = submissionFile.name.split('.').pop();
      const fileName = `${teamData.competition}_${teamData.team_name}_${Date.now()}.${fileExt}`;

      // Upload file to Google Drive in the team's folder
      const uploadResult = await uploadToDrive(
        submissionFile,
        submissionFolderId!,
        fileName,
        user!.email,
      );

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
            .update({ submission: uploadResult, submitted_at_1: new Date().toISOString() })
            .eq('id', existingSubmission.id)
        : await supabase.from('submissions').insert({
            team_id: teamData.id,
            submission: uploadResult,
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

      // Reset file input
      const fileInput = document.getElementById('submission-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Submission error:', error);
      setUploadStatus('error');
    }
  };

  const handleSecondFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setSecondSubmissionFile(e.target.files[0]);
  };

  const handleSecondSubmission = async () => {
    if (!secondSubmissionFile || !teamData) return;

    // setUploadStatus('loading');
    setSecondUploadStatus('loading');

    try {
      // Create unique filename
      const fileExt = secondSubmissionFile.name.split('.').pop();
      const fileName = `${teamData.competition}_${teamData.team_name}_${Date.now()}.${fileExt}`;

      // Upload file to Google Drive in the team's folder
      const uploadResult = await uploadToDrive(
        secondSubmissionFile,
        submissionFolderId!,
        fileName,
        user!.email,
      );

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
            .update({ submission_2: uploadResult, submitted_at_2: new Date().toISOString() })
            .eq('id', existingSubmission.id)
        : await supabase.from('submissions').insert({
            team_id: teamData.id,
            submission_2: uploadResult,
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

      // setUploadStatus('success');
      setSecondUploadStatus('success');
      setSecondSubmissionFile(null);

      // Reset file input
      const fileInput = document.getElementById('second-submission-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Submission error:', error);
      setUploadStatus('error');
    }
  };

  const handleOriginalityFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setOriginalityFile(e.target.files[0]);
  };

  const handleOriginalitySubmission = async () => {
    if (!originalityFile || !teamData) return;

    // setUploadStatus('loading');
    setOriginalityUploadStatus('loading');

    try {
      // Create unique filename
      const fileExt = originalityFile.name.split('.').pop();
      const fileName = `${teamData.competition}_${teamData.team_name}_Originality_${Date.now()}.${fileExt}`;

      // Upload file to Google Drive in the team's folder
      const uploadResult = await uploadToDrive(
        originalityFile,
        originalityFolderId!,
        fileName,
        user!.email,
      );

      // Find existing submission record
      const { data: existingSubmission } = await supabase
        .from('submissions')
        .select('id')
        .eq('team_id', teamData.id)
        .single();

      // Update the existing record or create a new one if it doesn't exist
      const { error } = existingSubmission
        ? await supabase
            .from('submissions')
            .update({ originality: uploadResult, submitted_at_3: new Date().toISOString() })
            .eq('id', existingSubmission.id)
        : await supabase.from('submissions').insert({
            team_id: teamData.id,
            originality: uploadResult,
            submitted_at_3: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });

      if (error) throw error;

      // Refresh submissions
      const { data: originalsData } = await supabase
        .from('submissions')
        .select('*')
        .eq('team_id', teamData.id);

      if (originalsData) {
        setOriginals(originalsData);
      }

      setIsVerified(true);
      setOriginalityUploadStatus('success');
      setOriginalityFile(null);

      // Reset file input
      const fileInput = document.getElementById('originality-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Originality upload error:', error);
      setUploadStatus('error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-b-transparent"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Dashboard Peserta</h1>
        <p className="text-gray-600">Selamat datang, {teamData?.leader}</p>
      </div> */}

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
                    <li key={member.id} className="flex items-center justify-between border-b pb-2">
                      <span>{member.name}</span>
                      <Badge variant="outline">{index === 0 ? 'Ketua' : `Anggota ${index}`}</Badge>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* {registrationData?.verified && teamData?.competition !== 'Scientific Debate' && (
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
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-dashed border-gray-300 p-6">
                      <div className="flex flex-col items-center justify-center space-y-2 text-center">
                        <UploadIcon className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          {teamData.competition === 'Poster Competition 1 Karya' ||
                          teamData.competition === 'Poster Competition 2 Karya'
                            ? 'Upload file gambar poster'
                            : 'Upload file PDF karya lomba'}
                        </p>
                        <input
                          id="submission-file"
                          type="file"
                          accept={
                            teamData.competition === 'Poster Competition 1 Karya' ||
                            teamData.competition === 'Poster Competition 2 Karya'
                              ? 'image/*,.zip,.rar'
                              : '.pdf'
                          }
                          onChange={handleFileUpload}
                          className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
                        />
                      </div>
                      <Button
                        onClick={handleSubmission}
                        disabled={!submissionFile || uploadStatus === 'loading'}
                        className="w-full"
                      >
                        {uploadStatus === 'loading' ? 'Uploading...' : 'Submit Karya'}
                      </Button>
                    </div>

                    {teamData.competition === 'Poster Competition 2 Karya' && (
                      <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-6">
                        <div className="flex flex-col items-center justify-center space-y-2 text-center">
                          <UploadIcon className="h-8 w-8 text-gray-400" />
                          <p className="text-sm text-gray-500">Upload file poster kedua</p>
                          <input
                            id="second-submission-file"
                            type="file"
                            accept="image/*,.zip,.rar"
                            onChange={handleSecondFileUpload}
                            className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
                          />
                        </div>
                        <Button
                          onClick={handleSecondSubmission}
                          disabled={!secondSubmissionFile || secondUploadStatus === 'loading'}
                          className="mt-2 w-full"
                        >
                          {secondUploadStatus === 'loading' ? 'Uploading...' : 'Submit Karya Kedua'}
                        </Button>
                      </div>
                    )}

                    {(teamData.competition === 'Poster Competition 1 Karya' ||
                      teamData.competition === 'Poster Competition 2 Karya') && (
                      <>
                        <div className="rounded-lg border border-dashed border-gray-300 p-6">
                          <div className="flex flex-col items-center justify-center space-y-2 text-center">
                            <UploadIcon className="h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-500">
                              Upload surat pernyataan orisinalitas karya
                            </p>
                            <input
                              id="originality-file"
                              type="file"
                              accept=".pdf"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setOriginalityFile(e.target.files[0]);
                                }
                              }}
                              className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
                            />
                          </div>
                          <Button
                            onClick={handleOriginalitySubmission}
                            disabled={!originalityFile || originalityUploadStatus === 'loading'}
                            className="mt-2 w-full"
                          >
                            {originalityUploadStatus === 'loading'
                              ? 'Uploading...'
                              : 'Submit Pernyataan Orisinalitas'}
                          </Button>
                        </div>

                        <div className="mt-4">
                          <h3 className="mb-2 font-medium">Pernyataan Orisinalitas</h3>
                          {originals.length > 0 ? (
                            <div className="flex items-center justify-between rounded-md border p-3">
                              <div>
                                <p className="font-medium">Pernyataan Orisinalitas</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(originals[0].submitted_at).toLocaleString()}
                                </p>
                              </div>
                              <Badge variant="success" className="flex items-center gap-1">
                                <CheckCircleIcon size={14} />
                                <span>Terupload</span>
                              </Badge>
                            </div>
                          ) : (
                            <p className="text-sm text-amber-600">
                              *Harap upload surat pernyataan orisinalitas karya
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {uploadStatus === 'error' && (
                      <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                        Terjadi kesalahan saat upload. Silakan coba lagi.
                      </div>
                    )}

                    {uploadStatus === 'success' && (
                      <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                        Submission berhasil diupload!
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )} */}
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
                    {/* Main Submission */}
                    {submissions.find((s) => s.submission) ? (
                      <div className="flex flex-col rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Karya Lomba</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileIcon size={18} className="text-blue-500" />
                            <strong>Submission</strong> submitted at{' '}
                            {new Date(
                              submissions.find((s) => s.submitted_at_1)?.submitted_at_1,
                            ).toLocaleString()}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 flex items-center gap-1"
                              asChild
                            >
                              <a
                                href={`https://drive.google.com/file/d/${submissions.find((s) => s.submission)?.submission}/view`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Lihat File
                              </a>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={async () => {
                                if (confirm('Yakin ingin menghapus submission ini?')) {
                                  const submissionId = submissions.find((s) => s.submission)?.id;
                                  await deleteFile(
                                    submissions.find((s) => s.submission)?.submission!,
                                  );
                                  const { error } = await supabase
                                    .from('submissions')
                                    .update({ submission: null })
                                    .eq('id', submissionId);

                                  if (!error) {
                                    // Refresh submissions
                                    const { data } = await supabase
                                      .from('submissions')
                                      .select('*')
                                      .eq('team_id', teamData.id);

                                    if (data) setSubmissions(data);
                                  }
                                }
                              }}
                            >
                              Hapus
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-gray-300 p-6">
                        <div className="flex flex-col items-center justify-center space-y-2 text-center">
                          {/* <UploadIcon className="h-8 w-8 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            {teamData.competition.includes('Poster')
                              ? 'Upload file gambar poster'
                              : 'Upload file PDF karya lomba'}
                          </p> */}
                          <input
                            id="submission-file"
                            type="file"
                            accept={
                              teamData.competition.includes('Poster') ? 'image/*,.zip,.rar' : '.pdf'
                            }
                            onChange={handleFileUpload}
                            className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
                          />
                        </div>
                        <Button
                          onClick={handleSubmission}
                          disabled={!submissionFile || uploadStatus === 'loading'}
                          className="mt-4 w-full"
                        >
                          {uploadStatus === 'loading' ? 'Uploading...' : 'Submit Karya'}
                        </Button>
                      </div>
                    )}

                    {/* Second submission (only for Poster 2 Karya) */}
                    {teamData.competition === 'Poster Competition 2 Karya' &&
                      (submissions.find((s) => s.submission_2) ? (
                        <div className="flex flex-col rounded-lg border p-4">
                          <h3 className="mb-2 font-medium">Karya Kedua</h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileIcon size={18} className="text-blue-500" />
                              <strong>Submission Kedua</strong> submitted at{' '}
                              {new Date(
                                submissions.find((s) => s.submitted_at_2)?.submitted_at_2,
                              ).toLocaleString()}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 flex items-center gap-1"
                                asChild
                              >
                                <a
                                  href={`https://drive.google.com/file/d/${submissions.find((s) => s.submission_2)?.submission_2}/view`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Lihat File
                                </a>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={async () => {
                                  if (
                                    confirm('Yakin ingin menghapus submission karya kedua ini?')
                                  ) {
                                    const submissionId = submissions.find(
                                      (s) => s.submission_2,
                                    )?.id;
                                    await deleteFile(
                                      submissions.find((s) => s.submission_2)?.submission_2!,
                                    );
                                    const { error } = await supabase
                                      .from('submissions')
                                      .update({ submission_2: null })
                                      .eq('id', submissionId);

                                    if (!error) {
                                      // Refresh submissions
                                      const { data } = await supabase
                                        .from('submissions')
                                        .select('*')
                                        .eq('team_id', teamData.id);

                                      if (data) setSubmissions(data);
                                    }
                                  }
                                }}
                              >
                                Hapus
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
                            onClick={handleSecondSubmission}
                            disabled={!secondSubmissionFile || secondUploadStatus === 'loading'}
                            className="mt-4 w-full"
                          >
                            {secondUploadStatus === 'loading'
                              ? 'Uploading...'
                              : 'Submit Karya Kedua'}
                          </Button>
                        </div>
                      ))}

                    {/* Originality file (only for Poster competitions) */}
                    {teamData.competition.includes('Poster') &&
                      (submissions.find((s) => s.originality) ? (
                        <div className="flex flex-col rounded-lg border p-4">
                          <h3 className="mb-2 font-medium">Surat Pernyataan Orisinalitas</h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileIcon size={18} className="text-blue-500" />
                              <strong>Pernyataan Orisinalitas</strong> submitted at{' '}
                              {new Date(
                                submissions.find((s) => s.submitted_at_3)?.submitted_at_3,
                              ).toLocaleString()}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 flex items-center gap-1"
                                asChild
                              >
                                <a
                                  href={`https://drive.google.com/file/d/${submissions.find((s) => s.originality)?.originality}/view`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 text-sm hover:underline"
                                >
                                  Lihat File
                                </a>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={async () => {
                                  if (
                                    confirm('Yakin ingin menghapus pernyataan orisinalitas ini?')
                                  ) {
                                    const submissionId = submissions.find((s) => s.originality)?.id;
                                    await deleteFile(
                                      submissions.find((s) => s.originality)?.originality!,
                                    );
                                    const { error } = await supabase
                                      .from('submissions')
                                      .update({ originality: null })
                                      .eq('id', submissionId);

                                    if (!error) {
                                      // Refresh submissions
                                      const { data } = await supabase
                                        .from('submissions')
                                        .select('*')
                                        .eq('team_id', teamData.id);

                                      if (data) setSubmissions(data);
                                    }
                                  }
                                }}
                              >
                                Hapus
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-gray-300 p-6">
                          <div className="flex flex-col items-center justify-center space-y-2 text-center">
                            {/* <UploadIcon className="h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-500">
                              Upload surat pernyataan orisinalitas karya
                            </p> */}
                            <input
                              id="originality-file"
                              type="file"
                              accept=".pdf"
                              onChange={handleOriginalityFileUpload}
                              className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
                            />
                          </div>
                          <Button
                            onClick={handleOriginalitySubmission}
                            disabled={!originalityFile || originalityUploadStatus === 'loading'}
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
              <CardDescription>Jadwal kegiatan untuk lomba {teamData?.competition}</CardDescription>
            </CardHeader>
            <CardContent>
              {teamData && (
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute bottom-0 left-4 top-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-6">
                      {(() => {
                        const competitionKey =
                          teamData.competition === 'Scientific Debate'
                            ? 'debate'
                            : teamData.competition === 'Technology Innovation'
                              ? 'innovation'
                              : teamData.competition === 'Poster Competition 1 Karya' ||
                                  teamData.competition === 'Poster Competition 2 Karya'
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
  );
}
