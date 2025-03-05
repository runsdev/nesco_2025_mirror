'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

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

  const handleAddMember = () => {
    setMembers([...members, '']);
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
  });

  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <div>
      <h1>Register</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <label>Team Name:</label>
          <input value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
        </div>
        <div>
          <label>Instance:</label>
          <input value={instance} onChange={(e) => setInstance(e.target.value)} required />
        </div>
        <div>
          <label>Contact/WhatsApp:</label>
          <input value={contact} onChange={(e) => setContact(e.target.value)} required />
        </div>
        <div>
          <label>Members:</label>
          {members.map((member, i) => (
            <input
              key={i}
              value={member}
              onChange={(e) => handleMemberChange(i, e.target.value)}
              required
            />
          ))}
          <button type="button" onClick={handleAddMember}>
            Add Member
          </button>
        </div>
        <div>
          <label>Photo (PDF acceptable):</label>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            required
          />
        </div>
        <div>
          <label>Student Card (PDF acceptable):</label>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setStudentCard(e.target.files?.[0] || null)}
            required
          />
        </div>
        <div>
          <label>Proof Instagram Following (PDF):</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setProofIG(e.target.files?.[0] || null)}
            required
          />
        </div>
        <div>
          <label>Twibbon Uploaded (PDF):</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setTwibbon(e.target.files?.[0] || null)}
            required
          />
        </div>
        <div>
          <label>Payment Proof (PDF or Image):</label>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
