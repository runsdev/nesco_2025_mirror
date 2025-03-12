'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { uploadToDrive, createFolder, deleteFolder } from '@/lib/driveApi';
import ParticlesContainer from '@/components/UI/ParticlesContainer';
import Cookies from 'js-cookie';
// import DriveUploader from '@/components/Backend/drive-uploader';

export default function RegisterPage() {
  const [teamName, setTeamName] = useState('');
  const [instance, setInstance] = useState('');
  const [contact, setContact] = useState('');
  const [members, setMembers] = useState<string[]>(['']);
  const [photo, setPhoto] = useState<File | null>(null);
  const [studentCard, setStudentCard] = useState<File | null>(null);
  const [proofIG, setProofIG] = useState<File | null>(null);
  const [twibbon, setTwibbon] = useState<File | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [competition, setCompetition] = useState<string>('');
  const [user, setUser] = useState<User | null>();
  const [leader, setLeader] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [confirmation, setConfirmation] = useState<string>('');
  const [openRegistration, setOpenRegistration] = useState<boolean>(false);
  const [announcementOpen, setAnnouncementOpen] = useState<boolean>(true);
  const [alternateMode, setAlternateMode] = useState<boolean>(false);
  const [driveLink, setDriveLink] = useState<string>('');

  const handleAddMember = () => {
    setMembers([...members, '']);
  };

  const handleRemoveMember = (index: number) => {
    if (members.length > 1) {
      const newMembers = [...members];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    }
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to login page
        router.push('/auth/sign-in');
      }

      setUser(user);
    }

    fetchUser();
  }, [router, supabase.auth]);

  // Check if registration is still open
  useEffect(() => {
    const currentDate = new Date();
    const registrationStarts = new Date('2025-03-09 23:59:59');

    if (currentDate > registrationStarts) {
      setOpenRegistration(true);
    } else {
      setOpenRegistration(false);
    }
  }, [router]);

  useEffect(() => {
    async function fetchTeam() {
      const { data: teams, error } = await supabase
        .from('teams')
        .select()
        .eq('email', user?.email)
        .single();

      // if (error) {
      //   setError(error.message);
      // }

      if (teams) {
        router.push('/dashboard');
      }
    }

    fetchTeam();
  }, [user?.email, supabase, router]);

  // Add this function to validate file size
  const validateFileSize = (file: File | null): boolean => {
    if (!file) return false;
    const maxSize = 4.5 * 1024 * 1024; // 4,5MB in bytes
    return file.size <= maxSize;
  };

  // Save form data to cookies
  const saveFormDataToCookies = () => {
    const formData = {
      teamName,
      instance,
      contact,
      members,
      competition,
      leader,
    };
    Cookies.set('formData', JSON.stringify(formData), { expires: 7 });
  };

  // Load form data from cookies
  const loadFormDataFromCookies = () => {
    const formData = Cookies.get('formData');
    if (formData) {
      const parsedData = JSON.parse(formData);
      setTeamName(parsedData.teamName || '');
      setInstance(parsedData.instance || '');
      setContact(parsedData.contact || '');
      setMembers(parsedData.members || ['']);
      setCompetition(parsedData.competition || '');
      setLeader(parsedData.leader || '');
    }
  };

  // Call loadFormDataFromCookies on component mount
  useEffect(() => {
    loadFormDataFromCookies();
  }, []);

  // Save form data to cookies whenever it changes
  useEffect(() => {
    saveFormDataToCookies();
  }, [teamName, instance, contact, members, competition, leader]);

  // Modify the handleSubmit function to include file size validation
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validasi form
      if (!alternateMode) {
        if (
          !teamName ||
          !leader ||
          !instance ||
          !contact ||
          !photo ||
          !studentCard ||
          !proofIG ||
          !twibbon ||
          !paymentProof
        ) {
          setError('Semua field harus diisi');
          setIsSubmitting(false);
          return;
        }
      } else {
        if (!teamName || !leader || !instance || !contact || !driveLink) {
          setError('Semua field harus diisi');
          setIsSubmitting(false);
          return;
        }
      }

      var results: string[] = [];
      var newFolderId: string = '';
      if (!alternateMode) {
        // Validate file sizes
        const files = [
          { name: 'Foto 3x4', file: photo },
          { name: 'Kartu Pelajar/Mahasiswa', file: studentCard },
          { name: 'Bukti Follow Instagram', file: proofIG },
          { name: 'Bukti Upload Twibbon', file: twibbon },
          { name: 'Bukti Pembayaran', file: paymentProof },
        ];

        for (const { name, file } of files) {
          if (!validateFileSize(file)) {
            setError(`File ${name} melebihi ukuran maksimum 4,5MB`);
            setIsSubmitting(false);
            return;
          }
        }

        // Buat folder baru dengan format namatim_timestamp
        const timestamp = new Date().getTime();
        const folderName = `${teamName.replace(/\s+/g, '_')}_${timestamp}`;

        newFolderId = await createFolder(folderName);

        if (!newFolderId) {
          setError('Gagal membuat folder');
          setIsSubmitting(false);
          return;
        }

        // Upload semua file dengan prefix
        // Function to retry upload with specified number of attempts
        const retryUpload = async (
          file: File,
          folderId: string,
          prefix: string,
          userEmail: string,
          maxAttempts = 3,
        ): Promise<string | null> => {
          let attempts = 0;
          while (attempts < maxAttempts) {
            attempts++;
            const result = await uploadToDrive(file, folderId, prefix, userEmail);
            if (result !== null) {
              return result;
            }
            console.log(`Upload attempt ${attempts} for ${prefix} failed. Retrying...`);
            // Wait a short time before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
          setError(`Failed to upload ${prefix} after ${maxAttempts} attempts`);
          return null;
        };

        const uploads = [
          await retryUpload(photo!, newFolderId, 'photo', user!.email!),
          await retryUpload(studentCard!, newFolderId, 'studentCard', user!.email!),
          await retryUpload(proofIG!, newFolderId, 'proofIG', user!.email!),
          await retryUpload(twibbon!, newFolderId, 'twibbon', user!.email!),
          await retryUpload(paymentProof!, newFolderId, 'paymentProof', user!.email!),
        ];

        results = (await Promise.all(uploads)).filter(
          (result): result is string => result !== null,
        );
        console.log('Upload results:', results);

        if (results.some((r) => r === null)) {
          setError('Beberapa file gagal diupload');
          await deleteFolder(newFolderId);
          setIsSubmitting(false);
          return;
        }
      }

      // Simpan data tim ke database (Supabase)
      const { data: teamsData, error: dbError } = await supabase
        .from('teams')
        .insert({
          team_name: teamName,
          institution: instance,
          email: user?.email,
          contact,
          leader,
          competition,
          created_at: new Date().toISOString(),
        })
        .select();

      if (!alternateMode) {
        const { error: dbFilesError } = await supabase.from('team_files').insert({
          team_id: teamsData?.[0].id,
          photo: results[0],
          student_card: results[1],
          instagram_follow: results[2],
          twibbon: results[3],
          payment: results[4],
          folder_id: newFolderId,
        });

        if (dbFilesError) {
          setError('Terjadi masalah saat mengirim file: ' + dbFilesError.message);
          await supabase.from('logs').insert({
            flag: 'error',
            message: dbFilesError?.message,
            details: dbFilesError?.details,
            hint: dbFilesError?.hint,
            code: dbFilesError?.code,
            raw: dbFilesError,
          });
          setIsSubmitting(false);
          return;
        }
      } else {
        const { error: dbFilesError } = await supabase.from('team_links').insert({
          team_id: teamsData?.[0].id,
          drive_link: driveLink,
        });
      }

      await supabase.from('team_members').insert({
        team_id: teamsData?.[0].id,
        name: leader,
      });

      // Only insert members if they exist
      if (members.length > 0 && members.some((m) => m.trim() !== '')) {
        await Promise.all(
          members
            .filter((member) => member.trim() !== '') // Filter out empty member names
            .map(async (member) => {
              return supabase.from('team_members').insert({
                team_id: teamsData?.[0].id,
                name: member,
              });
            }),
        );
      }

      if (dbError) {
        setError('Terjadi masalah saat membuat tim ke database: ' + dbError.message);
        await supabase.from('logs').insert({
          flag: 'error',
          message: dbError?.message,
          details: dbError?.details,
          hint: dbError?.hint,
          code: dbError?.code,
          raw: dbError,
        });
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      // Reset form setelah sukses
      setTeamName('');
      setInstance('');
      setContact('');
      setMembers(['']);
      setPhoto(null);
      setStudentCard(null);
      setProofIG(null);
      setTwibbon(null);
      setPaymentProof(null);
      setCompetition('');
      setLeader('');
      Cookies.remove('formData');
      router.push('/dashboard');
    } catch (err: any) {
      await supabase.from('logs').insert({
        flag: 'error',
        message: err,
      });
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  if (!openRegistration) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-gradient-to-b from-[#003C43] to-[#61CCC2] md:min-h-screen">
        <ParticlesContainer className="absolute top-0 z-0 min-h-[100svh] w-full md:min-h-screen" />
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold text-white">Pendaftaran Belum Dibuka</h1>
          <p className="mt-4 text-white">
            Pendaftaran akan dibuka pada tanggal <strong>10 Maret 2025</strong>. Silakan kembali
            lagi nanti.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-b-transparent"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    // <div className="min-h-screen bg-gray-50 px-4 pb-12 pt-[10%] sm:px-6 lg:px-8">
    <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-b from-[#003C43] to-[#61CCC2] py-[10%]">
      <div className="z-[10] mx-auto max-w-[90%] rounded-lg bg-white p-8 shadow-md md:max-w-[80%]">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Pendaftaran Tim Perlombaan
        </h1>

        {error && (
          <div className="mb-6 rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-green-400 bg-green-100 p-4 text-green-700">
            Pendaftaran berhasil! Data tim Anda telah disimpan.
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // setIsSubmitting(true);
            setShowModal(true);
            // handleSubmit();
          }}
          className="space-y-6"
        >
          <div>
            <label htmlFor="competition" className="mb-1 block text-sm font-medium text-gray-700">
              Jenis Lomba:
            </label>
            <select
              id="competition"
              value={competition}
              onChange={(e) => setCompetition(e.target.value)}
              className="focus:ring-blue-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
              required
            >
              <option value="" disabled>
                Pilih Jenis Lomba
              </option>
              <option value="Paper Competition">Paper Competition</option>
              <option value="Poster Competition 1 Karya">Poster Competition (1 karya)</option>
              <option value="Poster Competition 2 Karya">Poster Competition (2 karya)</option>
              <option value="Scientific Debate">Scientific Debate</option>
              <option value="Innovation Challenge">Innovation Challenge</option>
            </select>
          </div>

          <div>
            <label htmlFor="teamName" className="mb-1 block text-sm font-medium text-gray-700">
              Nama Tim:
            </label>
            <input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => {
                // Allow only alphanumeric, spaces and basic punctuation
                const sanitizedValue = e.target.value.replace(/[^\w\s\-_.]/gi, '');
                // Limit to 50 characters
                const truncatedValue = sanitizedValue.slice(0, 50);
                setTeamName(truncatedValue);
              }}
              maxLength={50}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
              required
              placeholder="Masukkan nama tim (maks. 50 karakter)"
            />
            <p className="mt-1 text-xs text-gray-500">
              {teamName.length}/50 karakter (hanya huruf, angka, spasi, dan tanda - _ .)
            </p>
          </div>

          <div>
            <label htmlFor="leader" className="mb-1 block text-sm font-medium text-gray-700">
              Ketua Tim:
            </label>
            <input
              id="leader"
              type="text"
              value={leader}
              onChange={(e) => {
                // Allow alphanumeric, spaces and basic punctuation
                const sanitizedValue = e.target.value.replace(/[^\w\s\-_.,]/gi, '');
                // Limit to 50 characters
                const truncatedValue = sanitizedValue.slice(0, 50);
                setLeader(truncatedValue);
              }}
              maxLength={50}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
              required
              placeholder="Masukkan nama ketua tim"
            />
            <p className="mt-1 text-xs text-gray-500">
              {leader.length}/50 karakter (hanya huruf, angka, spasi, dan tanda - _ . ,)
            </p>
          </div>

          <div>
            <label htmlFor="instance" className="mb-1 block text-sm font-medium text-gray-700">
              Instansi:
            </label>
            <input
              id="instance"
              type="text"
              value={instance}
              onChange={(e) => {
                // Allow alphanumeric, spaces and basic punctuation
                const sanitizedValue = e.target.value.replace(/[^\w\s\-_.,]/gi, '');
                // Limit to 100 characters
                const truncatedValue = sanitizedValue.slice(0, 100);
                setInstance(truncatedValue);
              }}
              maxLength={100}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
              required
              placeholder="Masukkan nama instansi/sekolah/universitas"
            />
            <p className="mt-1 text-xs text-gray-500">
              {instance.length}/100 karakter (hanya huruf, angka, spasi, dan tanda - _ . ,)
            </p>
          </div>

          <div>
            <label htmlFor="contact" className="mb-1 block text-sm font-medium text-gray-700">
              Kontak/WhatsApp:
            </label>
            <input
              id="contact"
              type="text"
              value={contact}
              onChange={(e) => {
                // Allow only numbers, plus sign, and hyphens for phone numbers
                const sanitizedValue = e.target.value.replace(/[^\d+\-\s]/g, '');
                // Limit to 20 characters for phone numbers
                const truncatedValue = sanitizedValue.slice(0, 20);
                setContact(truncatedValue);
              }}
              maxLength={20}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
              required
              placeholder="Contoh: +62812345678"
            />
            <p className="mt-1 text-xs text-gray-500">
              {contact.length}/20 karakter (hanya angka, +, dan -)
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Anggota Tim:</label>
            {members.map((member, i) => (
              <div key={i} className="mb-2 flex">
                <input
                  value={member}
                  onChange={(e) => {
                    // Allow alphanumeric, spaces and basic punctuation
                    const sanitizedValue = e.target.value.replace(/[^\w\s\-_.,]/gi, '');
                    // Limit to 50 characters
                    const truncatedValue = sanitizedValue.slice(0, 50);
                    handleMemberChange(i, truncatedValue);
                  }}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder={`Nama Anggota ${i + 1}`}
                  maxLength={50}
                />
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(i)}
                    className="ml-2 rounded-md bg-red-500 px-3 py-2 text-white transition-colors hover:bg-red-600"
                  >
                    <span className="sr-only">Hapus</span>×
                  </button>
                )}
                <p className="ml-2 mt-2 text-xs text-gray-500">{member.length}/50</p>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddMember}
              className={`mt-2 rounded-md px-4 py-2 transition-colors ${members.length >= 2 ? 'cursor-not-allowed bg-muted text-muted-foreground' : 'bg-blue text-white hover:bg-yellow'}`}
              disabled={members.length >= 2}
            >
              + Tambah Anggota
            </button>
          </div>

          <div className="flex items-center">
            <input
              id="alternateMode"
              type="checkbox"
              checked={alternateMode}
              onChange={(e) => setAlternateMode(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="alternateMode" className="text-sm font-medium text-gray-700">
              Gunakan Mode Alternatif (Google Drive Link)
            </label>
          </div>

          {!alternateMode && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="photo" className="mb-1 block text-sm font-medium text-gray-700">
                  Foto 3x4 (PDF, merged maks 4,5MB):
                </label>
                <div className="flex items-center">
                  <input
                    id="photo"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                    className="max-w-[100%] flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                    required
                  />
                  {photo && <span className="ml-2 text-sm text-green-600">✓</span>}
                </div>
                {photo?.size && !validateFileSize(photo) && (
                  <span className="ml-2 text-sm text-red-500">Ukuran melebihi 4,5MB</span>
                )}
              </div>

              <div>
                <label
                  htmlFor="studentCard"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Kartu Pelajar/Mahasiswa (PDF, merged maks 4,5MB):
                </label>
                <div className="flex items-center">
                  <input
                    id="studentCard"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setStudentCard(e.target.files?.[0] || null)}
                    className="max-w-[100%] flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                    required
                  />
                  {studentCard && <span className="ml-2 text-sm text-green-600">✓</span>}
                </div>
                {studentCard?.size && !validateFileSize(studentCard) && (
                  <span className="ml-2 text-sm text-red-500">Ukuran melebihi 4,5MB</span>
                )}
              </div>

              <div>
                <label htmlFor="proofIG" className="mb-1 block text-sm font-medium text-gray-700">
                  Bukti Follow Instagram (PDF, merged maks 4,5MB):
                </label>
                <div className="flex items-center">
                  <input
                    id="proofIG"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setProofIG(e.target.files?.[0] || null)}
                    className="max-w-[100%] flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                    required
                  />
                  {proofIG && <span className="ml-2 text-sm text-green-600">✓</span>}
                </div>
                {proofIG?.size && !validateFileSize(proofIG) && (
                  <span className="ml-2 text-sm text-red-500">Ukuran melebihi 4,5MB</span>
                )}
              </div>

              <div>
                <label htmlFor="twibbon" className="mb-1 block text-sm font-medium text-gray-700">
                  Bukti Upload Twibbon (PDF, merged maks 4,5MB):
                </label>
                <div className="flex items-center">
                  <input
                    id="twibbon"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setTwibbon(e.target.files?.[0] || null)}
                    className="max-w-[100%] flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                    required
                  />
                  {twibbon && <span className="ml-2 text-sm text-green-600">✓</span>}
                </div>
                {twibbon?.size && !validateFileSize(twibbon) && (
                  <span className="ml-2 text-sm text-red-500">Ukuran melebihi 4,5MB</span>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="paymentProof"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Bukti Pembayaran (PDF atau Gambar, maks 4,5MB):
                </label>
                <div className="flex items-center">
                  <input
                    id="paymentProof"
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                    className="max-w-[100%] flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                    required
                  />
                  {paymentProof && <span className="ml-2 text-sm text-green-600">✓</span>}
                </div>

                {paymentProof?.size && !validateFileSize(paymentProof) && (
                  <span className="ml-2 text-sm text-red-500">Ukuran melebihi 4,5MB</span>
                )}
              </div>
            </div>
          )}

          {alternateMode && (
            <div>
              <label htmlFor="driveLink" className="mb-1 block text-sm font-medium text-gray-700">
                Google Drive Link:
              </label>
              <input
                id="driveLink"
                type="url"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                required
                placeholder="Masukkan link Google Drive"
              />
              <p className="mt-1 text-xs text-gray-500">
                Pastikan link Google Drive dapat diakses oleh siapa saja yang memiliki link atau
                dapat diakses oleh nescougm2025@gmail.com.
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-md bg-blue px-6 py-3 text-white transition-colors hover:bg-yellow focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 ${
                isSubmitting ? 'cursor-not-allowed opacity-70' : ''
              }`}
            >
              {isSubmitting ? 'Mengirim...' : 'Daftar'}
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>Catatan:</strong>
            </p>
            <ul className="ml-5 list-disc">
              <li>Pastikan semua informasi yang dimasukkan sudah benar</li>
              <li>Setiap file yang diunggah tidak boleh melebihi 4,5MB</li>
              <li>Semua file harus dalam format yang ditentukan (PDF/Image)</li>
              <li>
                Pastikan kondisi jaringan internet Anda <b>stabil</b> saat mengunggah file.
              </li>
            </ul>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Validation Modal */}
          {showModal && !isSubmitting && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h3 className="mb-4 text-xl font-bold text-gray-800">Konfirmasi Pendaftaran</h3>
                <p className="mb-4 text-gray-600">
                  Untuk konfirmasi, silakan ketik ulang nama tim Anda:
                  <span className="ml-1 font-bold text-blue">{teamName}</span>
                </p>
                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                    placeholder="Ketik nama tim di sini"
                    onChange={(e) => {
                      setError(e.target.value !== teamName ? 'Nama tim tidak sesuai' : null);
                      setConfirmation(e.target.value);
                    }}
                  />
                  {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsSubmitting(false);
                      setShowModal(false);
                    }}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={error !== null || confirmation !== teamName}
                    className={`rounded-md px-4 py-2 text-white ${error !== null || confirmation !== teamName ? 'cursor-not-allowed bg-gray-400' : 'bg-blue hover:bg-yellow'}`}
                  >
                    {error !== null || confirmation !== teamName
                      ? 'Nama Tim Tidak Sesuai'
                      : 'Konfirmasi'}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Loading Modal */}
          {isSubmitting && showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h3 className="mb-4 text-xl font-bold text-gray-800">Sedang Mengunggah Data</h3>
                <div className="flex items-center justify-center space-x-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue border-b-transparent"></div>
                  <p className="text-gray-600">Mohon tunggu...</p>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Proses ini mungkin memerlukan waktu beberapa saat tergantung ukuran file dan
                  kondisi jaringan Anda. Jangan tutup atau memuat ulang halaman ini.
                </p>
              </div>
            </div>
          )}

          {/* Announcement Modal */}
          {announcementOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-amber-800">Perhatian!</h3>
                    <button
                      onClick={() => setAnnouncementOpen(false)}
                      className="ml-auto inline-flex text-amber-800 hover:text-amber-600"
                      aria-label="Close"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      Jika anda mengalami kendala dalam pengiriman file, silahkan mencoba{' '}
                      <b>mode alternatif</b> dengan mempersiapkan tautan Google Drive yang berisi
                      file-file yang diperlukan dan pastikan dapat diakses oleh semua orang atau{' '}
                      <b>nescougm2025@gmail.com</b>!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
