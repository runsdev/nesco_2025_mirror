'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { getData } from '@/lib/googleDrive';

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
    }

    fetchUser();
  }, [router]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validasi form
      if (
        !teamName ||
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
      const parentFolderId = '1yknSgj9QqDgZC_m7L6tCcJn1iB3o6cs1'; // ID folder dari kode asli

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
      const { error: dbError } = await supabase.from('teams').insert({
        team_name: teamName,
        instance,
        contact,
        members,
        folder_id: newFolderId,
        created_at: new Date().toISOString(),
      });

      if (dbError) {
        setError(dbError.message);
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
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-12 pt-[15%] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[80%] rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">Pendaftaran Tim</h1>

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
            <label htmlFor="teamName" className="mb-1 block text-sm font-medium text-gray-700">
              Nama Tim:
            </label>
            <input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="focus:ring-blue-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
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
              className="focus:ring-blue-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
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
              className="focus:ring-blue-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
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
                  className="focus:ring-blue-500 flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
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
              className="bg-yellow-500 hover:bg-blue-600 mt-2 rounded-md px-4 py-2 text-white transition-colors"
            >
              + Tambah Anggota
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="photo" className="mb-1 block text-sm font-medium text-gray-700">
                Foto (PDF atau Gambar):
              </label>
              <div className="flex items-center">
                <input
                  id="photo"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="focus:ring-blue-500 flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
                  required
                />
                {photo && <span className="ml-2 text-sm text-green-600">✓</span>}
              </div>
            </div>

            <div>
              <label htmlFor="studentCard" className="mb-1 block text-sm font-medium text-gray-700">
                Kartu Pelajar/Mahasiswa (PDF atau Gambar):
              </label>
              <div className="flex items-center">
                <input
                  id="studentCard"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setStudentCard(e.target.files?.[0] || null)}
                  className="focus:ring-blue-500 flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
                  required
                />
                {studentCard && <span className="ml-2 text-sm text-green-600">✓</span>}
              </div>
            </div>

            <div>
              <label htmlFor="proofIG" className="mb-1 block text-sm font-medium text-gray-700">
                Bukti Follow Instagram (PDF):
              </label>
              <div className="flex items-center">
                <input
                  id="proofIG"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setProofIG(e.target.files?.[0] || null)}
                  className="focus:ring-blue-500 flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
                  required
                />
                {proofIG && <span className="ml-2 text-sm text-green-600">✓</span>}
              </div>
            </div>

            <div>
              <label htmlFor="twibbon" className="mb-1 block text-sm font-medium text-gray-700">
                Bukti Upload Twibbon (PDF):
              </label>
              <div className="flex items-center">
                <input
                  id="twibbon"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setTwibbon(e.target.files?.[0] || null)}
                  className="focus:ring-blue-500 flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
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
                  className="focus:ring-blue-500 flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
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
              className={`bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 rounded-md px-6 py-3 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isSubmitting ? 'cursor-not-allowed opacity-70' : ''
              }`}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
