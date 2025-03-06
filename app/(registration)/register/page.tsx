'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

// Tambahkan fungsi untuk upload ke Google Drive
export const uploadToDrive = async (
  file: File,
  folderId: string,
  prefix: string,
): Promise<string | null> => {
  try {
    const formData = new FormData();
    // Ubah nama file dengan menambahkan prefix
    const newFileName = `${prefix}_${file.name}`;
    const newFile = new File([file], newFileName, { type: file.type });

    formData.append('file', newFile);
    formData.append('folderId', folderId);

    // Ganti URL dengan endpoint API Anda untuk upload ke Drive
    const response = await fetch('/api/upload-to-drive', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.fileId;
  } catch (error: any) {
    console.error('Error uploading file:', error.message);
    return null;
  }
};

// Tambahkan fungsi untuk membuat folder baru di Drive
export const createFolder = async (
  parentFolderId: string,
  folderName: string,
): Promise<string | null> => {
  try {
    const response = await fetch('/api/create-folder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parentFolderId,
        folderName,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create folder');
    }

    const data = await response.json();
    return data.folderId;
  } catch (error: any) {
    console.error('Error creating folder:', error.message);
    return null;
  }
};

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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validasi form
      if (
        !teamName ||
        !leader ||
        !instance ||
        !contact ||
        members.some((m) => !m) ||
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

      // Buat folder baru dengan format namatim_timestamp
      const timestamp = new Date().getTime();
      const folderName = `${teamName.replace(/\s+/g, '_')}_${timestamp}`;
      const parentFolderId = '1yknSgj9QqDgZC_m7L6tCcJn1iB3o6cs1';

      const newFolderId = await createFolder(parentFolderId, folderName);

      if (!newFolderId) {
        setError('Gagal membuat folder');
        setIsSubmitting(false);
        return;
      }

      // Upload semua file dengan prefix
      const uploads = [
        uploadToDrive(photo, newFolderId, 'photo'),
        uploadToDrive(studentCard, newFolderId, 'studentCard'),
        uploadToDrive(proofIG, newFolderId, 'proofIG'),
        uploadToDrive(twibbon, newFolderId, 'twibbon'),
        uploadToDrive(paymentProof, newFolderId, 'paymentProof'),
      ];

      const results = await Promise.all(uploads);

      if (results.some((r) => r === null)) {
        setError('Beberapa file gagal diupload');
        setIsSubmitting(false);
        return;
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
          verified: false,
          created_at: new Date().toISOString(),
        })
        .select();

      const { error: dbFilesError } = await supabase.from('team_files').insert({
        team_id: teamsData?.[0].id,
        photo: results[0],
        student_card: results[1],
        instagram_follow: results[2],
        twibbon: results[3],
        payment: results[4],
        folder_id: newFolderId,
      });

      await supabase.from('team_members').insert({
        team_id: teamsData?.[0].id,
        name: leader,
      });

      members.forEach(async (member) => {
        await supabase.from('team_members').insert({
          team_id: teamsData?.[0].id,
          name: member,
        });
      });

      const { error: dbRegistrationError } = await supabase.from('registrations').insert({
        team_id: teamsData?.[0].id,
        competition,
        payment_proof: results[4],
        verification_status: 'pending',
      });

      if (dbError) {
        setError(dbError.message);
        setIsSubmitting(false);
        return;
      }

      if (dbFilesError) {
        setError(dbFilesError.message);
        setIsSubmitting(false);
        return;
      }

      if (dbRegistrationError) {
        setError(dbRegistrationError.message);
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
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-12 pt-[10%] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[80%] rounded-lg bg-white p-8 shadow-md">
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
            handleSubmit();
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
              <option value="Paper">Paper</option>
              <option value="Poster">Poster</option>
              <option value="Scientific Debate">Scientific Debate</option>
              <option value="Innovation Challenge">Innovation</option>
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
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
              required
            />
          </div>

          <div>
            <label htmlFor="leader" className="mb-1 block text-sm font-medium text-gray-700">
              Ketua Tim:
            </label>
            <input
              id="leader"
              type="text"
              value={leader}
              onChange={(e) => setLeader(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
              required
            />
          </div>

          <div>
            <label htmlFor="instance" className="mb-1 block text-sm font-medium text-gray-700">
              Instansi:
            </label>
            <input
              id="instance"
              type="text"
              value={instance}
              onChange={(e) => setInstance(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
              required
            />
          </div>

          <div>
            <label htmlFor="contact" className="mb-1 block text-sm font-medium text-gray-700">
              Kontak/WhatsApp:
            </label>
            <input
              id="contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Anggota Tim:</label>
            {members.map((member, i) => (
              <div key={i} className="mb-2 flex">
                <input
                  value={member}
                  onChange={(e) => handleMemberChange(i, e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder={`Nama Anggota ${i + 1}`}
                  required
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
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddMember}
              className={`mt-2 rounded-md bg-yellow px-4 py-2 text-white transition-colors hover:bg-blue ${members.length >= 2 ? 'cursor-not-allowed opacity-70' : ''}`}
              disabled={members.length >= 2}
            >
              + Tambah Anggota
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="photo" className="mb-1 block text-sm font-medium text-gray-700">
                Foto 3x4 (PDF, merged):
              </label>
              <div className="flex items-center">
                <input
                  id="photo"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                  required
                />
                {photo && <span className="ml-2 text-sm text-green-600">✓</span>}
              </div>
            </div>

            <div>
              <label htmlFor="studentCard" className="mb-1 block text-sm font-medium text-gray-700">
                Kartu Pelajar/Mahasiswa (PDF, merged):
              </label>
              <div className="flex items-center">
                <input
                  id="studentCard"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setStudentCard(e.target.files?.[0] || null)}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                  required
                />
                {studentCard && <span className="ml-2 text-sm text-green-600">✓</span>}
              </div>
            </div>

            <div>
              <label htmlFor="proofIG" className="mb-1 block text-sm font-medium text-gray-700">
                Bukti Follow Instagram (PDF, merged):
              </label>
              <div className="flex items-center">
                <input
                  id="proofIG"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setProofIG(e.target.files?.[0] || null)}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                  required
                />
                {proofIG && <span className="ml-2 text-sm text-green-600">✓</span>}
              </div>
            </div>

            <div>
              <label htmlFor="twibbon" className="mb-1 block text-sm font-medium text-gray-700">
                Bukti Upload Twibbon (PDF, merged):
              </label>
              <div className="flex items-center">
                <input
                  id="twibbon"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setTwibbon(e.target.files?.[0] || null)}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                  required
                />
                {twibbon && <span className="ml-2 text-sm text-green-600">✓</span>}
              </div>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="paymentProof"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Bukti Pembayaran (PDF atau Gambar):
              </label>
              <div className="flex items-center">
                <input
                  id="paymentProof"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                  required
                />
                {paymentProof && <span className="ml-2 text-sm text-green-600">✓</span>}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`focus:ring-blue-500 rounded-md bg-blue px-6 py-3 text-white transition-colors hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isSubmitting ? 'cursor-not-allowed opacity-70' : ''
              }`}
            >
              {isSubmitting ? 'Mengirim...' : 'Daftar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
