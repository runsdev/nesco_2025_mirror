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

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [teamData, setTeamData] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamFiles, setTeamFiles] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
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
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(fileName, submissionFile);

      if (uploadError) throw uploadError;

      // Save submission record
      const { error: submissionError } = await supabase.from('submissions').insert({
        team_id: teamData.id,
        file_path: uploadData.path,
        file_name: fileName,
        submitted_at: new Date().toISOString(),
        status: 'pending',
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
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Dashboard Peserta</h1>
        <p className="text-gray-600">Selamat datang, {user?.email}</p>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Kompetisi {teamData?.competition}</span>
              <Badge variant={teamData?.verified ? 'success' : 'secondary'}>
                {teamData?.verified ? 'Terverifikasi' : 'Menunggu Verifikasi'}
              </Badge>
            </CardTitle>
            <CardDescription>Status pendaftaran dan informasi tim</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="data" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="submission">Submission</TabsTrigger>
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

        {teamData?.verified && (
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
                        {teamData?.competition === 'Poster'
                          ? 'Upload file gambar poster (JPG, PNG)'
                          : 'Upload file PDF karya lomba'}
                      </p>
                      <input
                        id="submission-file"
                        type="file"
                        accept={teamData?.competition === 'Poster' ? 'image/*' : '.pdf'}
                        onChange={handleFileUpload}
                        className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
                      />
                    </div>
                  </div>

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
      </Tabs>
    </div>
  );
}
