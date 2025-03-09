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
import { uploadToDrive, createFolder, deleteFolder } from '@/utils/google/action';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [teamData, setTeamData] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamFiles, setTeamFiles] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [secondSubmissionFile, setSecondSubmissionFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [originalityFile, setOriginalityFile] = useState<File | null>(null);
  const [originals, setOriginals] = useState<any[]>([]);
  const [isVerified, setIsVerified] = useState(false);

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
        }
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

      // Upload to storage
      // Prepare folder structure in Google Drive
      const competitionFolderId = await createFolder(
        teamData.competition,
        process.env.NEXT_PUBLIC_GOOGLE_SUBMISSION_FOLDER_ID!,
      );
      const teamFolderId = await createFolder(teamData.team_name, competitionFolderId);

      // Upload file to Google Drive in the team's folder
      const uploadResult = await uploadToDrive(
        submissionFile,
        fileName,
        teamFolderId,
        submissionFile.type,
      );

      const { error: submissionError } = await supabase.from('submissions').insert({
        team_id: teamData.id,
        submission: uploadResult,
        submitted_at: new Date().toISOString(),
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

    setUploadStatus('loading');

    try {
      // Create unique filename
      const fileExt = secondSubmissionFile.name.split('.').pop();
      const fileName = `${teamData.competition}_${teamData.team_name}_${Date.now()}.${fileExt}`;

      // Upload to storage
      // Prepare folder structure in Google Drive
      const competitionFolderId = await createFolder(
        teamData.competition,
        process.env.NEXT_PUBLIC_GOOGLE_SUBMISSION_FOLDER_ID!,
      );
      const teamFolderId = await createFolder(teamData.team_name, competitionFolderId);

      // Upload file to Google Drive in the team's folder
      const uploadResult = await uploadToDrive(
        secondSubmissionFile,
        fileName,
        teamFolderId,
        secondSubmissionFile.type,
      );

      const { error: submissionError } = await supabase.from('submissions').insert({
        team_id: teamData.id,
        submission: uploadResult,
        submitted_at: new Date().toISOString(),
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
      setSecondSubmissionFile(null);

      // Reset file input
      const fileInput = document.getElementById('second-submission-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Submission error:', error);
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
              <Badge variant={teamData?.verified ? 'success' : 'secondary'}>
                {teamData?.verified ? 'Terverifikasi' : 'Menunggu Verifikasi'}
              </Badge>
            </CardTitle>
            <CardDescription>Status Pendaftaran dan Informasi Tim</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="data" className="w-full">
        <TabsList
          className={`mb-4 grid w-full ${teamData?.verified && teamData?.competition !== 'Scientific Debate' ? 'grid-cols-3' : 'grid-cols-2'}`}
        >
          <TabsTrigger value="data" className="data-[state=active]:text-white">
            Data
          </TabsTrigger>
          {/* <TabsTrigger value="timeline">Timeline</TabsTrigger> */}
          {teamData?.verified && teamData?.competition !== 'Scientific Debate' && (
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

        {teamData?.verified && teamData?.competition !== 'Scientific Debate' && (
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
                            ? 'image/*'
                            : '.pdf'
                        }
                        onChange={handleFileUpload}
                        className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
                      />
                    </div>
                  </div>
                  {teamData.competition === 'Poster Competition 2 Karya' && (
                    <>
                      <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-6">
                        <div className="flex flex-col items-center justify-center space-y-2 text-center">
                          <UploadIcon className="h-8 w-8 text-gray-400" />
                          <p className="text-sm text-gray-500">Upload file gambar poster kedua</p>
                          <input
                            id="second-submission-file"
                            type="file"
                            accept="image/*"
                            onChange={handleSecondFileUpload}
                            className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
                          />
                        </div>
                      </div>

                      {secondSubmissionFile && (
                        <div className="bg-blue-50 rounded-md p-3 text-sm">
                          File kedua dipilih: {secondSubmissionFile.name}
                        </div>
                      )}

                      <Button
                        onClick={handleSecondSubmission}
                        disabled={!secondSubmissionFile || uploadStatus === 'loading'}
                        className="mt-2 w-full"
                      >
                        {uploadStatus === 'loading' ? 'Uploading...' : 'Submit Karya Kedua'}
                      </Button>
                    </>
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
                      </div>

                      {originalityFile && (
                        <div className="bg-blue-50 rounded-md p-3 text-sm">
                          File pernyataan orisinalitas dipilih: {originalityFile.name}
                        </div>
                      )}

                      <Button
                        onClick={async () => {
                          if (!originalityFile || !teamData) return;

                          setUploadStatus('loading');

                          try {
                            // Create unique filename
                            const fileExt = originalityFile.name.split('.').pop();
                            const fileName = `${teamData.competition}_${teamData.team_name}_Originality_${Date.now()}.${fileExt}`;

                            // Upload to storage
                            const competitionFolderId = await createFolder(
                              teamData.competition,
                              process.env.NEXT_PUBLIC_GOOGLE_SUBMISSION_FOLDER_ID!,
                            );
                            const teamFolderId = await createFolder(
                              teamData.team_name,
                              competitionFolderId,
                            );

                            // Upload file to Google Drive in the team's folder
                            const uploadResult = await uploadToDrive(
                              originalityFile,
                              fileName,
                              teamFolderId,
                              originalityFile.type,
                            );

                            const { error } = await supabase.from('originals').insert({
                              team_id: teamData.id,
                              file_id: uploadResult,
                              submitted_at: new Date().toISOString(),
                            });

                            if (error) throw error;

                            // Refresh originals
                            const { data: originalsData } = await supabase
                              .from('originals')
                              .select('*')
                              .eq('team_id', teamData.id);

                            if (originalsData) {
                              setOriginals(originalsData);
                            }

                            setIsVerified(true);
                            setUploadStatus('success');
                            setOriginalityFile(null);

                            // Reset file input
                            const fileInput = document.getElementById(
                              'originality-file',
                            ) as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          } catch (error) {
                            console.error('Originality upload error:', error);
                            setUploadStatus('error');
                          }
                        }}
                        disabled={!originalityFile || uploadStatus === 'loading'}
                        className="mt-2 w-full"
                      >
                        {uploadStatus === 'loading'
                          ? 'Uploading...'
                          : 'Submit Pernyataan Orisinalitas'}
                      </Button>

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

                  {submissionFile && (
                    <div className="bg-blue-50 rounded-md p-3 text-sm">
                      File dipilih: {submissionFile.name}
                    </div>
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

                  <Button
                    onClick={handleSubmission}
                    disabled={!submissionFile || uploadStatus === 'loading'}
                    className="w-full"
                  >
                    {uploadStatus === 'loading' ? 'Uploading...' : 'Submit Karya'}
                  </Button>

                  <div className="mt-6">
                    <h3 className="mb-3 font-medium">Riwayat Submission</h3>

                    {submissions.length > 0 ? (
                      <div className="divide-y rounded-md border">
                        {submissions.map((submission) => (
                          <div
                            key={submission.id}
                            className="flex items-center justify-between p-4"
                          >
                            <div>
                              <p className="font-medium">{submission.file_name}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(submission.submitted_at).toLocaleString()}
                              </p>
                            </div>
                            <Badge
                              variant={
                                submission.status === 'accepted'
                                  ? 'success'
                                  : submission.status === 'rejected'
                                    ? 'destructive'
                                    : 'outline'
                              }
                              className="flex items-center gap-1"
                            >
                              {submission.status === 'accepted' ? (
                                <>
                                  <CheckCircleIcon size={14} />
                                  <span>Diterima</span>
                                </>
                              ) : submission.status === 'rejected' ? (
                                <>
                                  <XCircleIcon size={14} />
                                  <span>Ditolak</span>
                                </>
                              ) : (
                                'Menunggu Review'
                              )}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Belum ada submission yang diupload.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

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
