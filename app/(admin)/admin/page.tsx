'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Search,
  ChevronDown,
  AlertCircle,
  Info,
  CheckIcon,
  Loader2,
  Calendar,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/UI/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog';
import { Input } from '@/components/UI/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/UI/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/UI/tooltip';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/UI/pagination';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 10;

export default function AdminDashboard() {
  // State variables
  const [teams, setTeams] = useState<any[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<any[]>([]);
  const [displayedTeams, setDisplayedTeams] = useState<any[]>([]);
  const [teamFiles, setTeamFiles] = useState<{ [key: string]: any }>({});
  const [teamLink, setTeamLink] = useState<{ [key: string]: any }>({});
  const [teamMembers, setTeamMembers] = useState<{ [key: string]: any[] }>({});
  const [submissions, setSubmissions] = useState<{ [key: string]: any[] }>({});
  const [submissionVerifications, setSubmissionVerifications] = useState<{
    [key: string]: boolean;
  }>({});
  const [registrations, setRegistrations] = useState<{ [key: string]: any[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, verified
  const [competitionFilter, setCompetitionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [verifySubmissionDialogOpen, setVerifySubmissionDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [submissionSortField, setSubmissionSortField] = useState('submitted_at_1');
  const [submissionSortDirection, setSubmissionSortDirection] = useState('desc');
  const [submissionFilter, setSubmissionFilter] = useState('all'); // all, verified, pending
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [display, setDisplay] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // Authorization check
  useEffect(() => {
    async function checkAuth() {
      setIsLoading(true);

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

      setIsLoading(false);
    }

    checkAuth();
  }, [supabase, router]);

  // Load data
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

      // Fetch all team files
      const { data: filesData, error: filesError } = await supabase.from('team_files').select('*');

      const filesMap = filesError
        ? {}
        : filesData?.reduce((acc: any, file: any) => {
            acc[file.team_id] = file;
            return acc;
          }, {});

      // Fetch team links
      const { data: linksData, error: linksError } = await supabase.from('team_links').select('*');

      const linksMap = linksError
        ? {}
        : linksData?.reduce((acc: any, link: any) => {
            acc[link.team_id] = link.drive_link;
            return acc;
          }, {});

      // Fetch team members
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('*');

      const membersMap = membersError
        ? {}
        : membersData?.reduce((acc: any, member: any) => {
            if (!acc[member.team_id]) {
              acc[member.team_id] = [];
            }
            acc[member.team_id].push(member);
            return acc;
          }, {});

      // Fetch submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('*');

      const submissionsMap = submissionsError
        ? {}
        : submissionsData?.reduce((acc: any, submission: any) => {
            if (!acc[submission.team_id]) {
              acc[submission.team_id] = [];
            }
            acc[submission.team_id].push(submission);
            return acc;
          }, {});

      // Fetch submission verifications
      const { data: verificationData, error: verificationError } = await supabase
        .from('submission_verifies')
        .select('*');

      const verificationMap = verificationError
        ? {}
        : verificationData?.reduce((acc: any, verification: any) => {
            if (verification.submission_id) {
              acc[verification.submission_id] = true;
            }
            return acc;
          }, {});

      // Fetch registrations
      const { data: registrationData, error: registrationError } = await supabase
        .from('registrations')
        .select('*');

      const registrationMap = registrationError
        ? {}
        : registrationData?.reduce((acc: any, registration: any) => {
            if (!acc[registration.team_id]) {
              acc[registration.team_id] = [];
            }
            acc[registration.team_id].push(registration);
            return acc;
          }, {});

      // Set state
      setTeams(teamsData || []);
      setFilteredTeams(teamsData || []);
      setTeamFiles(filesMap || {});
      setTeamLink(linksMap || {});
      setTeamMembers(membersMap || {});
      setSubmissions(submissionsMap || {});
      setSubmissionVerifications(verificationMap || {});
      setRegistrations(registrationMap || {});
      setIsLoading(false);
    }

    fetchData();
  }, [supabase, display]);

  // Apply filters, sorting, and search
  useEffect(() => {
    if (!teams.length) return;

    let filtered = [...teams];

    // Apply filters
    if (filter === 'verified') {
      filtered = filtered.filter((team) => team.verified);
    } else if (filter === 'pending') {
      filtered = filtered.filter((team) => !team.verified);
    }

    // Apply competition filter
    if (competitionFilter !== 'all') {
      filtered = filtered.filter((team) => team.competition === competitionFilter);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (team) =>
          team.team_name.toLowerCase().includes(query) ||
          team.institution.toLowerCase().includes(query) ||
          team.email?.toLowerCase().includes(query) ||
          teamMembers[team.id]?.some((member) => member.name.toLowerCase().includes(query)),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortField === 'created_at') {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }

      if (sortField === 'team_name') {
        return sortDirection === 'asc'
          ? a.team_name.localeCompare(b.team_name)
          : b.team_name.localeCompare(a.team_name);
      }

      return 0;
    });

    setFilteredTeams(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1); // Reset to first page when filters change
  }, [filter, competitionFilter, searchQuery, sortField, sortDirection, teams, teamMembers]);

  // Update displayed teams based on pagination
  useEffect(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setDisplayedTeams(filteredTeams.slice(start, end));
  }, [filteredTeams, currentPage]);

  // Handler functions
  const handleVerifyTeam = async (teamId: string, verifyStatus: boolean) => {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('teams')
        .update({ verified: verifyStatus })
        .eq('id', teamId);

      if (error) throw error;

      const { error: updateError } = await supabase
        .from('registrations')
        .update({ verified: verifyStatus })
        .eq('team_id', teamId);

      if (updateError) throw updateError;

      // Update local state
      setTeams(
        teams.map((team) => (team.id === teamId ? { ...team, verified: verifyStatus } : team)),
      );

      // Close dialog
      setVerifyDialogOpen(false);
      setRevokeDialogOpen(false);
    } catch (error) {
      console.error('Error updating team verification status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmission = async (submissionId: string) => {
    setIsLoading(true);

    try {
      // Check if verification already exists
      const { data: existingVerification } = await supabase
        .from('submission_verifies')
        .select('*')
        .eq('submission_id', submissionId)
        .single();

      if (!existingVerification) {
        const { error } = await supabase.from('submission_verifies').insert({
          submission_id: submissionId,
          team_id: selectedTeam?.id,
          created_at: new Date().toISOString(),
        });

        if (error) throw error;
      }

      // Update local state
      setSubmissionVerifications({
        ...submissionVerifications,
        [submissionId]: true,
      });

      setVerifySubmissionDialogOpen(false);
    } catch (error) {
      console.error('Error verifying submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSubmissionVerification = async (submissionId: string) => {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('submission_verifies')
        .delete()
        .eq('submission_id', submissionId);

      if (error) throw error;

      // Update local state
      const updatedVerifications = { ...submissionVerifications };
      delete updatedVerifications[submissionId];
      setSubmissionVerifications(updatedVerifications);
    } catch (error) {
      console.error('Error revoking submission verification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    let csvContent =
      'Team Name,Competition,Institution,Email,Contact,Verified,Members,Creation Date\n';

    filteredTeams.forEach((team) => {
      const members = teamMembers[team.id] || [];
      const memberNames = members.map((m) => m.name).join('; ');
      const createdAt = team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A';

      csvContent += `"${team.team_name}","${team.competition}","${team.institution}","${team.email || ''}","${team.contact || ''}","${team.verified ? 'Yes' : 'No'}","${memberNames}","${createdAt}"\n`;
    });

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

  const viewSupabaseBucketFile = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('submission')
        .createSignedUrl(path, 60, { download: true });

      if (error) throw error;
      window.open(data?.signedUrl, '_blank');
    } catch (error) {
      console.error('Error fetching signed URL:', error);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending when changing fields
    }
  };

  const handleSubmissionSort = (field: string) => {
    if (submissionSortField === field) {
      setSubmissionSortDirection(submissionSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSubmissionSortField(field);
      setSubmissionSortDirection('desc');
    }
  };

  // Memoized computed values
  const competitionStats = useMemo(() => {
    const stats: { [key: string]: { total: number; verified: number } } = {};

    teams.forEach((team) => {
      if (!stats[team.competition]) {
        stats[team.competition] = { total: 0, verified: 0 };
      }

      stats[team.competition].total += 1;
      if (team.verified) {
        stats[team.competition].verified += 1;
      }
    });

    return stats;
  }, [teams]);

  const totalVerifiedTeams = useMemo(() => teams.filter((team) => team.verified).length, [teams]);

  const totalPendingTeams = useMemo(() => teams.filter((team) => !team.verified).length, [teams]);

  const filteredSubmissions = useMemo(() => {
    if (!activeTeamId) return {};

    const teamSubmissionsData = submissions[activeTeamId] || [];
    let filtered = [...teamSubmissionsData];

    // Filter submissions based on verification status
    if (submissionFilter === 'verified') {
      filtered = filtered.filter((submission) => submissionVerifications[submission.id]);
    } else if (submissionFilter === 'pending') {
      filtered = filtered.filter((submission) => !submissionVerifications[submission.id]);
    }

    // Sort submissions
    filtered.sort((a, b) => {
      const getDateValue = (submission: any, field: string) => {
        const dateString = submission[field];
        return dateString ? new Date(dateString).getTime() : 0;
      };

      const aValue = getDateValue(a, submissionSortField);
      const bValue = getDateValue(b, submissionSortField);

      return submissionSortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return { [activeTeamId]: filtered };
  }, [
    activeTeamId,
    submissions,
    submissionVerifications,
    submissionFilter,
    submissionSortField,
    submissionSortDirection,
  ]);

  // Loading state
  if (isLoading || !display) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg font-medium">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] w-full bg-gradient-to-b from-[#61CCC2] to-[#FFE08D] md:min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Button
            onClick={() => router.push('/')}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <span>&#8592;</span> Kembali ke Beranda
          </Button>
        </div>

        {/* Dashboard header with stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teams.length}</div>
              <p className="text-xs text-muted-foreground">From all competitions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Verified Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVerifiedTeams}</div>
              <p className="text-xs text-muted-foreground">
                {((totalVerifiedTeams / teams.length) * 100).toFixed(1)}% of total teams
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPendingTeams}</div>
              <p className="text-xs text-muted-foreground">
                {((totalPendingTeams / teams.length) * 100).toFixed(1)}% of total teams
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Last Update
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-md font-medium">{new Date().toLocaleDateString()}</div>
              <p className="text-xs text-muted-foreground">{new Date().toLocaleTimeString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and filter section */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2 sm:max-w-xs">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search teams, members, or institutions..."
                  className="w-full rounded-md border py-2 pl-9 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="h-9 w-[180px] gap-1 bg-white">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="pending">Pending Only</SelectItem>
                </SelectContent>
              </Select>

              <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
                <SelectTrigger className="h-9 w-[180px] gap-1 bg-white">
                  <FileText className="h-4 w-4" />
                  <SelectValue placeholder="Filter Competition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Competitions</SelectItem>
                  <SelectItem value="Paper Competition">Paper Competition</SelectItem>
                  <SelectItem value="Poster Competition 1 Karya">Poster 1 Karya</SelectItem>
                  <SelectItem value="Poster Competition 2 Karya">Poster 2 Karya</SelectItem>
                  <SelectItem value="Scientific Debate">Scientific Debate</SelectItem>
                  <SelectItem value="Innovation Challenge">Innovation Challenge</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={exportToCSV} variant="outline" className="h-9 gap-1 bg-white">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export to CSV</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-muted-foreground">{filteredTeams.length} teams found</div>

            <div className="flex items-center gap-4">
              <div className="hidden text-sm lg:block">Sort by:</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    {sortField === 'created_at' ? 'Registration Date' : 'Team Name'}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleSort('created_at')}>
                    <div className="flex w-full items-center justify-between">
                      Registration Date
                      {sortField === 'created_at' && <CheckIcon className="ml-2 h-4 w-4" />}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('team_name')}>
                    <div className="flex w-full items-center justify-between">
                      Team Name
                      {sortField === 'team_name' && <CheckIcon className="ml-2 h-4 w-4" />}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                {sortDirection === 'asc' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 8 4-4 4 4" />
                    <path d="M7 4v16" />
                    <path d="M11 12h4" />
                    <path d="M11 16h7" />
                    <path d="M11 20h10" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 16 4 4 4-4" />
                    <path d="M7 20V4" />
                    <path d="M11 4h10" />
                    <path d="M11 8h7" />
                    <path d="M11 12h4" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main content tabs */}
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2 bg-white/80">
            <TabsTrigger value="teams">Teams Management</TabsTrigger>
            <TabsTrigger value="submissions">Submissions Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            {displayedTeams.length > 0 ? (
              <>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                  {displayedTeams.map((team) => (
                    <Card key={team.id} className="overflow-hidden">
                      <CardHeader className="border-b bg-muted/20 pb-3">
                        <div className="flex flex-row items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              {team.team_name}
                              <Badge variant="outline" className="font-normal">
                                {team.competition}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              <span>{team.institution}</span>
                              {team.created_at && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger className="flex items-center">
                                      <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                      <p>
                                        Registered: {new Date(team.created_at).toLocaleString()}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={team.verified ? 'success' : 'outline'}
                            className={
                              team.verified
                                ? 'bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900'
                            }
                          >
                            {team.verified ? 'Verified' : 'Pending'}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Contact</p>
                              <p className="mt-1">{team.contact || '-'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Email</p>
                              <p className="mt-1 break-words">{team.email || '-'}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Team Members
                            </p>
                            <ul className="mt-1 list-inside list-disc">
                              {teamMembers[team.id]?.length > 0 ? (
                                teamMembers[team.id].map((member, idx) => (
                                  <li key={member.id} className="text-sm">
                                    <span className="ml-1">
                                      {member.name} {idx === 0 ? '(Leader)' : ''}
                                    </span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-sm text-muted-foreground">No members listed</li>
                              )}
                            </ul>
                          </div>

                          {teamFiles[team.id] && (
                            <div>
                              <p className="mb-2 text-sm font-medium text-muted-foreground">
                                Registration Files
                              </p>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {['photo', 'student_card', 'instagram_follow', 'twibbon', 'payment']
                                  .filter((key) => teamFiles[team.id][key])
                                  .map((key) => (
                                    <a
                                      key={key}
                                      href={`https://drive.google.com/file/d/${teamFiles[team.id][key]}/view`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 rounded-md border bg-white p-2 text-sm transition-colors hover:bg-slate-50"
                                    >
                                      <FileIcon size={16} className="text-blue-500" />
                                      <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                                      <Eye size={14} className="ml-auto text-slate-400" />
                                    </a>
                                  ))}
                              </div>
                            </div>
                          )}

                          {teamLink[team.id] && (
                            <div>
                              <p className="mb-2 text-sm font-medium text-muted-foreground">
                                Team Link
                              </p>
                              <a
                                href={teamLink[team.id]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-md border bg-white p-2 text-sm transition-colors hover:bg-slate-50"
                              >
                                <svg
                                  className="text-blue-600 h-4 w-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M19.937 8.68c-.011-.032-.02-.063-.033-.094a1.008 1.008 0 0 0-.196-.293l-6-6a.997.997 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a.991.991 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a.99.99 0 0 0-.05-.258zM16.586 8H14V5.414L16.586 8zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10H6z"></path>
                                </svg>
                                <span>Drive Document</span>
                                <Eye size={14} className="ml-auto text-slate-400" />
                              </a>
                            </div>
                          )}

                          <div className="flex justify-end gap-2">
                            {!team.verified ? (
                              <Button
                                onClick={() => {
                                  setSelectedTeam(team);
                                  setVerifyDialogOpen(true);
                                }}
                                className="bg-green-600 text-white hover:bg-green-700"
                              >
                                <CheckCircleIcon size={16} className="mr-1" />
                                Verify Team
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedTeam(team);
                                  setRevokeDialogOpen(true);
                                }}
                                className="border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <XCircleIcon size={16} className="mr-1" />
                                Revoke Verification
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((page) => {
                            // Show first page, last page, current page and pages +/- 1 from current
                            return (
                              page === 1 ||
                              page === totalPages ||
                              page === currentPage ||
                              page === currentPage - 1 ||
                              page === currentPage + 1
                            );
                          })
                          .map((page, i, filtered) => (
                            <React.Fragment key={page}>
                              {i > 0 && filtered[i - 1] !== page - 1 && (
                                <PaginationItem>
                                  <span className="px-1">...</span>
                                </PaginationItem>
                              )}
                              <PaginationItem>
                                <PaginationLink
                                  onClick={() => setCurrentPage(page)}
                                  isActive={page === currentPage}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </React.Fragment>
                          ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={
                              currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <AlertCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-medium">No teams found</h3>
                <p className="text-muted-foreground">
                  No teams match your current filters. Try changing your search query or filters.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="submissions">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Select a Team</CardTitle>
                    <CardDescription>Select a team to view their submissions</CardDescription>
                  </CardHeader>
                  <CardContent className="max-h-[70vh] overflow-y-auto px-3">
                    <div className="mb-4">
                      <Input
                        type="search"
                        placeholder="Search teams..."
                        className="w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      {filteredTeams.map((team) => {
                        // Count submissions
                        const teamSubmissionsList = submissions[team.id] || [];
                        const hasSubmissions = teamSubmissionsList.some(
                          (s) => s.submission || s.submission_2 || s.originality,
                        );

                        if (!hasSubmissions) return null;

                        const verifiedSubmissions = teamSubmissionsList.filter(
                          (s) => submissionVerifications[s.id],
                        ).length;

                        return (
                          <Button
                            key={team.id}
                            variant={activeTeamId === team.id ? 'default' : 'ghost'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              activeTeamId === team.id ? 'bg-primary text-primary-foreground' : '',
                            )}
                            onClick={() => setActiveTeamId(team.id)}
                          >
                            <div className="flex w-full items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-medium">{team.team_name}</span>
                                <span className="text-xs text-slate-500">{team.competition}</span>
                              </div>
                              {hasSubmissions && (
                                <Badge variant="outline" className="ml-2 bg-white">
                                  {verifiedSubmissions}/{teamSubmissionsList.length}
                                </Badge>
                              )}
                            </div>
                          </Button>
                        );
                      })}

                      {filteredTeams.filter((team) => {
                        const teamSubmissionsList = submissions[team.id] || [];
                        return teamSubmissionsList.some(
                          (s) => s.submission || s.submission_2 || s.originality,
                        );
                      }).length === 0 && (
                        <div className="py-6 text-center text-muted-foreground">
                          No teams with submissions found
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                {activeTeamId ? (
                  <Card>
                    <CardHeader className="border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>
                            {teams.find((t) => t.id === activeTeamId)?.team_name} Submissions
                          </CardTitle>
                          <CardDescription>
                            {teams.find((t) => t.id === activeTeamId)?.competition || '-'}
                          </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                          <Select value={submissionFilter} onValueChange={setSubmissionFilter}>
                            <SelectTrigger className="w-[130px]">
                              <SelectValue placeholder="All Submissions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Submissions</SelectItem>
                              <SelectItem value="verified">Verified Only</SelectItem>
                              <SelectItem value="pending">Pending Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="w-[200px]">Type</TableHead>
                            <TableHead>
                              <button
                                className="flex items-center text-left font-medium"
                                onClick={() => handleSubmissionSort('submitted_at_1')}
                              >
                                Date
                                {submissionSortField === 'submitted_at_1' && (
                                  <span className="ml-1">
                                    {submissionSortDirection === 'asc' ? '↑' : '↓'}
                                  </span>
                                )}
                              </button>
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredSubmissions[activeTeamId] &&
                          filteredSubmissions[activeTeamId].length > 0 ? (
                            <>
                              {filteredSubmissions[activeTeamId].map((submission) => (
                                <React.Fragment key={submission.id}>
                                  {submission.submission && (
                                    <TableRow>
                                      <TableCell className="font-medium">
                                        Primary Submission
                                      </TableCell>
                                      <TableCell>
                                        {submission.submitted_at_1 ? (
                                          new Date(submission.submitted_at_1).toLocaleString()
                                        ) : (
                                          <span className="text-muted-foreground">N/A</span>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {submissionVerifications[submission.id] ? (
                                          <Badge
                                            variant="success"
                                            className="bg-green-100 text-green-800"
                                          >
                                            Verified
                                          </Badge>
                                        ) : (
                                          <Badge
                                            variant="outline"
                                            className="bg-amber-100 text-amber-800"
                                          >
                                            Pending
                                          </Badge>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              viewSupabaseBucketFile(submission.submission)
                                            }
                                          >
                                            <Eye size={14} className="mr-1" />
                                            View
                                          </Button>

                                          {submissionVerifications[submission.id] ? (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                              onClick={() =>
                                                handleRevokeSubmissionVerification(submission.id)
                                              }
                                            >
                                              <XCircleIcon size={14} className="mr-1" />
                                              Revoke
                                            </Button>
                                          ) : (
                                            <Button
                                              size="sm"
                                              className="bg-green-600 text-white hover:bg-green-700"
                                              onClick={() => {
                                                setSelectedSubmission(submission);
                                                setSelectedTeam(
                                                  teams.find((t) => t.id === activeTeamId),
                                                );
                                                setVerifySubmissionDialogOpen(true);
                                              }}
                                            >
                                              <CheckCircleIcon size={14} className="mr-1" />
                                              Verify
                                            </Button>
                                          )}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}

                                  {submission.submission_2 && (
                                    <TableRow>
                                      <TableCell className="font-medium">
                                        Secondary Submission
                                      </TableCell>
                                      <TableCell>
                                        {submission.submitted_at_2 ? (
                                          new Date(submission.submitted_at_2).toLocaleString()
                                        ) : (
                                          <span className="text-muted-foreground">N/A</span>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {submissionVerifications[`${submission.id}_2`] ? (
                                          <Badge
                                            variant="success"
                                            className="bg-green-100 text-green-800"
                                          >
                                            Verified
                                          </Badge>
                                        ) : (
                                          <Badge
                                            variant="outline"
                                            className="bg-amber-100 text-amber-800"
                                          >
                                            Pending
                                          </Badge>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              viewSupabaseBucketFile(submission.submission_2)
                                            }
                                          >
                                            <Eye size={14} className="mr-1" />
                                            View
                                          </Button>

                                          {submissionVerifications[`${submission.id}_2`] ? (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                              onClick={() =>
                                                handleRevokeSubmissionVerification(
                                                  `${submission.id}_2`,
                                                )
                                              }
                                            >
                                              <XCircleIcon size={14} className="mr-1" />
                                              Revoke
                                            </Button>
                                          ) : (
                                            <Button
                                              size="sm"
                                              className="bg-green-600 text-white hover:bg-green-700"
                                              onClick={() => {
                                                setSelectedSubmission({
                                                  ...submission,
                                                  id: `${submission.id}_2`,
                                                });
                                                setSelectedTeam(
                                                  teams.find((t) => t.id === activeTeamId),
                                                );
                                                setVerifySubmissionDialogOpen(true);
                                              }}
                                            >
                                              <CheckCircleIcon size={14} className="mr-1" />
                                              Verify
                                            </Button>
                                          )}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}

                                  {submission.originality && (
                                    <TableRow>
                                      <TableCell className="font-medium">
                                        Originality Statement
                                      </TableCell>
                                      <TableCell>
                                        {submission.submitted_at_3 ? (
                                          new Date(submission.submitted_at_3).toLocaleString()
                                        ) : (
                                          <span className="text-muted-foreground">N/A</span>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {submissionVerifications[`${submission.id}_3`] ? (
                                          <Badge
                                            variant="success"
                                            className="bg-green-100 text-green-800"
                                          >
                                            Verified
                                          </Badge>
                                        ) : (
                                          <Badge
                                            variant="outline"
                                            className="bg-amber-100 text-amber-800"
                                          >
                                            Pending
                                          </Badge>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              viewSupabaseBucketFile(submission.originality)
                                            }
                                          >
                                            <Eye size={14} className="mr-1" />
                                            View
                                          </Button>

                                          {submissionVerifications[`${submission.id}_3`] ? (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                              onClick={() =>
                                                handleRevokeSubmissionVerification(
                                                  `${submission.id}_3`,
                                                )
                                              }
                                            >
                                              <XCircleIcon size={14} className="mr-1" />
                                              Revoke
                                            </Button>
                                          ) : (
                                            <Button
                                              size="sm"
                                              className="bg-green-600 text-white hover:bg-green-700"
                                              onClick={() => {
                                                setSelectedSubmission({
                                                  ...submission,
                                                  id: `${submission.id}_3`,
                                                });
                                                setSelectedTeam(
                                                  teams.find((t) => t.id === activeTeamId),
                                                );
                                                setVerifySubmissionDialogOpen(true);
                                              }}
                                            >
                                              <CheckCircleIcon size={14} className="mr-1" />
                                              Verify
                                            </Button>
                                          )}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </React.Fragment>
                              ))}
                            </>
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="h-24 text-center">
                                {submissionFilter !== 'all' ? (
                                  <div className="text-muted-foreground">
                                    No {submissionFilter} submissions found for this team
                                  </div>
                                ) : (
                                  <div className="text-muted-foreground">
                                    No submissions found for this team
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="flex min-h-[50vh] items-center justify-center">
                    <CardContent className="py-16 text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mb-2 text-lg font-medium">No Team Selected</h3>
                      <p className="max-w-sm text-muted-foreground">
                        Please select a team from the left panel to view their submissions
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Verify Team Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to verify this team? This will mark them as having completed all
              registration requirements.
            </DialogDescription>
          </DialogHeader>

          {selectedTeam && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <p className="font-medium">{selectedTeam.team_name}</p>
                <p className="text-sm text-muted-foreground">{selectedTeam.competition}</p>
                <p className="text-sm text-muted-foreground">{selectedTeam.institution}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedTeam && handleVerifyTeam(selectedTeam.id, true)}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Verify Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Verification Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Verification</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke verification for this team? This will mark them as
              having incomplete registration requirements.
            </DialogDescription>
          </DialogHeader>

          {selectedTeam && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <p className="font-medium">{selectedTeam.team_name}</p>
                <p className="text-sm text-muted-foreground">{selectedTeam.competition}</p>
                <p className="text-sm text-muted-foreground">{selectedTeam.institution}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedTeam && handleVerifyTeam(selectedTeam.id, false)}
              variant="destructive"
            >
              Revoke Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Submission Dialog */}
      <Dialog open={verifySubmissionDialogOpen} onOpenChange={setVerifySubmissionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to verify this submission? This confirms that you&apos;ve
              reviewed the document.
            </DialogDescription>
          </DialogHeader>

          {selectedTeam && selectedSubmission && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <p className="font-medium">{selectedTeam.team_name}</p>
                <p className="text-sm text-muted-foreground">{selectedTeam.competition}</p>
                <p className="text-sm">
                  Submission Type:
                  <span className="font-medium">
                    {selectedSubmission.id.includes('_2')
                      ? ' Secondary Submission'
                      : selectedSubmission.id.includes('_3')
                        ? ' Originality Statement'
                        : ' Primary Submission'}
                  </span>
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifySubmissionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedSubmission && handleVerifySubmission(selectedSubmission.id)}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Verify Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
