'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { Button } from '@/components/UI/button';
import {
  FileIcon,
  CheckCircleIcon,
  XCircleIcon,
  Filter,
  Download,
  FileText,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [teams, setTeams] = useState<any[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<any[]>([]);
  const [teamFiles, setTeamFiles] = useState<{ [key: string]: any }>({});
  const [teamMembers, setTeamMembers] = useState<{ [key: string]: any[] }>({});
  const [submissions, setSubmissions] = useState<{ [key: string]: any[] }>({});
  const [registrations, setRegistrations] = useState<{ [key: string]: any[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, verified
  const [competitionFilter, setCompetitionFilter] = useState('all');
  const [admins, setAdmins] = useState<any[]>([]);
  const [display, setDisplay] = useState(false);
  const router = useRouter();
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function fetchAdmins() {
      const { data: adminsData, error: adminsError } = await supabase.from('admins').select('*');

      if (adminsError) {
        console.error('Error fetching admins:', adminsError);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/sign-in');
        return;
      }

      setAdmins(adminsData || []);

      // Check if current user is an admin
      if (!adminsData.find((admin) => admin.email === user.email)) {
        router.push('/');
      } else {
        setDisplay(true);
      }
    }

    fetchAdmins();
  }, [supabase, router]);

  useEffect(() => {
    async function fetchData() {
      if (!display) return;
      setIsLoading(true);

      // Fetch all teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (teamsError) {
        console.error('Error fetching teams:', teamsError);
        setIsLoading(false);
        return;
      }

      setTeams(teamsData || []);
      setFilteredTeams(teamsData || []);

      // Fetch all team files
      const { data: filesData, error: filesError } = await supabase.from('team_files').select('*');

      if (!filesError && filesData) {
        const filesMap = filesData.reduce((acc: any, file: any) => {
          acc[file.team_id] = file;
          return acc;
        }, {});
        setTeamFiles(filesMap);
      }

      // Fetch all team members
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('*');

      if (!membersError && membersData) {
        const membersMap = membersData.reduce((acc: any, member: any) => {
          if (!acc[member.team_id]) {
            acc[member.team_id] = [];
          }
          acc[member.team_id].push(member);
          return acc;
        }, {});
        setTeamMembers(membersMap);
      }

      // Fetch all submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('*');

      if (!submissionsError && submissionsData) {
        const submissionsMap = submissionsData.reduce((acc: any, submission: any) => {
          if (!acc[submission.team_id]) {
            acc[submission.team_id] = [];
          }
          acc[submission.team_id].push(submission);
          return acc;
        }, {});
        setSubmissions(submissionsMap);
      }

      // Fetch all registrations
      const { data: registrationData, error: registrationError } = await supabase
        .from('registrations')
        .select('*');

      if (!registrationError && registrationData) {
        const registrationMap = registrationData.reduce((acc: any, registration: any) => {
          if (!acc[registration.team_id]) {
            acc[registration.team_id] = [];
          }
          acc[registration.team_id].push(registration);
          return acc;
        }, {});
        setRegistrations(registrationMap);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [supabase, display]);

  useEffect(() => {
    // Apply filters
    let filtered = [...teams];

    // Filter by verification status
    if (filter === 'verified') {
      filtered = filtered.filter((team) => team.verified);
    } else if (filter === 'pending') {
      filtered = filtered.filter((team) => !team.verified);
    }

    // Filter by competition type
    if (competitionFilter !== 'all') {
      filtered = filtered.filter((team) => team.competition === competitionFilter);
    }

    setFilteredTeams(filtered);
  }, [filter, competitionFilter, teams]);

  const handleVerifyTeam = async (teamId: string, verifyStatus: boolean) => {
    const { error } = await supabase
      .from('teams')
      .update({ verified: verifyStatus })
      .eq('id', teamId);

    const { error: updateError } = await supabase
      .from('registrations')
      .update({ verified: verifyStatus })
      .eq('team_id', teamId);

    if (error) {
      console.error('Error updating team verification status:', error);
      return;
    }

    if (updateError) {
      console.error('Error updating registration verification status:', updateError);
      return;
    }

    // Update local state
    setTeams(
      teams.map((team) => (team.id === teamId ? { ...team, verified: verifyStatus } : team)),
    );

    // Update filtered teams as well
    setFilteredTeams(
      filteredTeams.map((team) =>
        team.id === teamId ? { ...team, verified: verifyStatus } : team,
      ),
    );
  };

  const handleUpdateSubmissionStatus = async (submissionId: string, status: string) => {
    const { error } = await supabase.from('submissions').update({ status }).eq('id', submissionId);

    if (error) {
      console.error('Error updating submission status:', error);
      return;
    }

    // Update local state
    setSubmissions((prevSubmissions) => {
      const newSubmissions = { ...prevSubmissions };

      for (const teamId in newSubmissions) {
        newSubmissions[teamId] = newSubmissions[teamId].map((submission) =>
          submission.id === submissionId ? { ...submission, status } : submission,
        );
      }

      return newSubmissions;
    });
  };

  const exportToCSV = () => {
    // Create CSV content
    let csvContent = 'Team Name,Competition,Institution,Email,Contact,Verified,Members\n';

    filteredTeams.forEach((team) => {
      const members = teamMembers[team.id] || [];
      const memberNames = members.map((m) => m.name).join('; ');

      csvContent += `"${team.team_name}","${team.competition}","${team.institution}","${team.email}","${team.contact}","${team.verified ? 'Yes' : 'No'}","${memberNames}"\n`;
    });

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `teams_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (isLoading || !display) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-b-transparent"></div>
        <span className="ml-2">Loading data...</span>
      </div>
    );
  }

  return (
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

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage teams, verify participants, and review submissions</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-md border p-2">
            <Filter size={18} />
            <select
              className="bg-transparent outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Teams</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-md border p-2">
            <FileText size={18} />
            <select
              className="bg-transparent outline-none"
              value={competitionFilter}
              onChange={(e) => setCompetitionFilter(e.target.value)}
            >
              <option value="all">All Competitions</option>
              <option value="Paper">Paper</option>
              <option value="Poster Competition 1 Karya">Poster 1 Karya</option>
              <option value="Poster Competition 2 Karya">Poster 2 Karya</option>
              <option value="Scientific Debate">Scientific Debate</option>
              <option value="Technology Innovation">Innovation Challenge</option>
            </select>
          </div>
        </div>

        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download size={16} />
          Export to CSV
        </Button>
      </div>

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2 data-[state=active]:text-white">
          <TabsTrigger value="teams">Teams ({filteredTeams.length})</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <Card key={team.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {team.team_name}
                        <Badge>{team.competition}</Badge>
                      </CardTitle>
                      <CardDescription>{team.institution}</CardDescription>
                    </div>
                    <Badge variant={team.verified ? 'success' : 'outline'}>
                      {team.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p>{team.contact}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p>{team.email}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Team Members</p>
                        <ul className="ml-5 list-disc">
                          {teamMembers[team.id]?.map((member, idx) => (
                            <li key={member.id}>
                              {member.name} {idx === 0 ? '(Leader)' : ''}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {teamFiles[team.id] && (
                        <div>
                          <p className="mb-2 text-sm text-gray-500">Files</p>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {Object.entries(teamFiles[team.id])
                              .filter(([key]) =>
                                [
                                  'photo',
                                  'student_card',
                                  'instagram_follow',
                                  'twibbon',
                                  'payment',
                                ].includes(key),
                              )
                              .filter(([_, value]) => !!value) // Filter out falsy values before mapping
                              .map(([key, value]) => (
                                <a
                                  key={key}
                                  href={`https://drive.google.com/file/d/${value}/view`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 rounded-md border p-2 text-sm hover:bg-gray-50"
                                >
                                  <FileIcon size={16} />
                                  <span>{key.replace(/_/g, ' ')}</span>
                                  <Eye size={14} className="ml-auto" />
                                </a>
                              ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-2">
                        {!team.verified ? (
                          <Button
                            onClick={() => setVerifyModalOpen(true)}
                            className="flex items-center gap-1"
                          >
                            <CheckCircleIcon size={16} />
                            Verify
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => setRevokeModalOpen(true)}
                            className="flex items-center gap-1"
                          >
                            <XCircleIcon size={16} />
                            Revoke
                          </Button>
                        )}
                      </div>

                      {/* Verification Confirmation Modal */}
                      {verifyModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                            <h3 className="mb-4 text-lg font-bold">Confirm Verification</h3>
                            <p className="mb-6">
                              Are you sure you want to verify team &quot;{team.team_name}&quot;?
                              This will mark them as having completed all registration requirements.
                            </p>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setVerifyModalOpen(false)}>
                                Cancel
                              </Button>
                              <Button
                                onClick={() => {
                                  handleVerifyTeam(team.id, true);
                                  setVerifyModalOpen(false);
                                }}
                              >
                                Verify Team
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Revoke Verification Confirmation Modal */}
                      {revokeModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                            <h3 className="mb-4 text-lg font-bold">Confirm Revocation</h3>
                            <p className="mb-6">
                              Are you sure you want to revoke verification for team &quot;
                              {team.team_name}&quot;? This will mark them as having incomplete
                              registration requirements.
                            </p>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setRevokeModalOpen(false)}>
                                Cancel
                              </Button>
                              <Button
                                onClick={() => {
                                  handleVerifyTeam(team.id, false);
                                  setRevokeModalOpen(false);
                                }}
                              >
                                Revoke Verification
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 rounded-md border border-dashed p-8 text-center">
                <p className="text-gray-500">No teams found matching your filters.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Team Submissions</CardTitle>
              <CardDescription>Review and manage submitted works from teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(submissions).length > 0 ? (
                  filteredTeams.map((team) => {
                    const teamSubmissions = submissions[team.id] || [];
                    if (teamSubmissions.length === 0) return null;

                    // Skip if there are no actual submission files
                    const hasSubmission = teamSubmissions.some(
                      (s) => s.submission || s.submission_2 || s.originality,
                    );
                    if (!hasSubmission) return null;

                    return (
                      <div key={team.id} className="rounded-lg border">
                        <div className="border-b bg-muted/40 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{team.team_name}</h3>
                              <p className="text-sm text-gray-500">{team.competition}</p>
                            </div>
                            <Badge variant={team.verified ? 'success' : 'outline'}>
                              {team.verified ? 'Verified' : 'Pending'}
                            </Badge>
                          </div>
                        </div>

                        <div className="divide-y">
                          {teamSubmissions.map((submission) => (
                            <React.Fragment key={submission.id}>
                              {submission.submission && (
                                <div className="flex flex-wrap items-center justify-between gap-4 p-4">
                                  <div className="flex-1">
                                    <p className="font-medium">Primary Submission</p>
                                    <p className="text-sm text-gray-500">
                                      {submission.submitted_at_1 &&
                                        new Date(submission.submitted_at_1).toLocaleString()}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {/* <Badge
                                      variant={
                                        submission.status === 'accepted'
                                          ? 'success'
                                          : submission.status === 'rejected'
                                            ? 'destructive'
                                            : 'outline'
                                      }
                                    >
                                      {submission.status === 'accepted'
                                        ? 'Accepted'
                                        : submission.status === 'rejected'
                                          ? 'Rejected'
                                          : 'Pending'}
                                    </Badge> */}

                                    <a
                                      href={`https://drive.google.com/file/d/${submission.submission}/view`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex items-center gap-1"
                                      >
                                        <Eye size={14} />
                                        View
                                      </Button>
                                    </a>
                                  </div>

                                  {/* <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleUpdateSubmissionStatus(submission.id, 'accepted')
                                      }
                                      variant={
                                        submission.status === 'accepted' ? 'default' : 'outline'
                                      }
                                      className="flex items-center gap-1"
                                    >
                                      <CheckCircleIcon size={14} />
                                      Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleUpdateSubmissionStatus(submission.id, 'rejected')
                                      }
                                      variant={
                                        submission.status === 'rejected' ? 'destructive' : 'outline'
                                      }
                                      className="flex items-center gap-1"
                                    >
                                      <XCircleIcon size={14} />
                                      Reject
                                    </Button>
                                  </div> */}
                                </div>
                              )}

                              {submission.submission_2 && (
                                <div className="flex flex-wrap items-center justify-between gap-4 border-t p-4">
                                  <div className="flex-1">
                                    <p className="font-medium">Second Submission</p>
                                    <p className="text-sm text-gray-500">
                                      {submission.submitted_at_2 &&
                                        new Date(submission.submitted_at_2).toLocaleString()}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">Second Work</Badge>

                                    <a
                                      href={`https://drive.google.com/file/d/${submission.submission_2}/view`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex items-center gap-1"
                                      >
                                        <Eye size={14} />
                                        View
                                      </Button>
                                    </a>
                                  </div>
                                </div>
                              )}

                              {submission.originality && (
                                <div className="flex flex-wrap items-center justify-between gap-4 border-t p-4">
                                  <div className="flex-1">
                                    <p className="font-medium">Originality Statement</p>
                                    <p className="text-sm text-gray-500">
                                      {submission.submitted_at_3 &&
                                        new Date(submission.submitted_at_3).toLocaleString()}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-green-50">
                                      Originality
                                    </Badge>

                                    <a
                                      href={`https://drive.google.com/file/d/${submission.originality}/view`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex items-center gap-1"
                                      >
                                        <Eye size={14} />
                                        View
                                      </Button>
                                    </a>
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-md border border-dashed p-8 text-center">
                    <p className="text-gray-500">No submissions found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
