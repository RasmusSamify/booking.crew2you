import { useState } from 'react';
import { Camera } from 'lucide-react';
import type { Booking } from '@/lib/mock-data';
import { useAdvanceBookingStage, useUpdateBooking } from '@/hooks/use-bookings';
import { uploadFile } from '@/lib/storage';
import { toast } from '@/components/ui/Toast';

interface ReportFormProps {
  booking: Booking;
  onReported: () => void;
}

export default function ReportForm({ booking, onReported }: ReportFormProps) {
  const [comment, setComment] = useState('');
  const [hours, setHours] = useState(String(booking.timmar));
  const [volume, setVolume] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const advanceStage = useAdvanceBookingStage();
  const updateBooking = useUpdateBooking();
  const [uploading, setUploading] = useState(false);

  async function handleSubmit() {
    setUploading(true);
    // Upload photo if provided
    if (file) {
      try {
        const primary = booking.assignedPersonnel[0];
        const personnelId = primary?.personnelId || 'unknown';
        await uploadFile('reports', file, booking.id, personnelId);
      } catch (e) {
        console.warn('Foto-upload misslyckades:', e);
        toast('Kunde inte ladda upp foto — rapporten sparas ändå');
      }
    }

    // Save report text + advance stage
    try {
      await updateBooking.mutateAsync({
        id: booking.id,
        aterrapport: comment,
      });
    } catch (e) {
      console.warn('Kunde inte spara rapporttext:', e);
    }

    advanceStage.mutate(
      { bookingId: booking.id, targetStage: 'aterrapporterad' },
      {
        onSuccess: () => {
          toast('Aterrapport skickad');
          setUploading(false);
          onReported();
        },
        onError: () => setUploading(false),
      }
    );
  }

  const busy = uploading || advanceStage.isPending || updateBooking.isPending;

  return (
    <div className="pt-3 pb-1">
      {/* Booking header */}
      <div className="mb-3">
        <p className="text-[14px] font-bold text-ink">{booking.butik} &middot; {booking.dagar}</p>
        <p className="text-xs text-ink-muted">{booking.kund} &middot; {booking.produkt} &middot; {booking.tjanst}</p>
      </div>
      <div className="border-t border-dashed border-border mb-4" />

      {/* Comment */}
      <label className="block text-[13px] font-semibold text-ink mb-1.5">Hur gick uppdraget?</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        className="w-full rounded-r border border-border bg-surface px-3 py-3 text-[16px] text-ink mb-4 resize-none min-h-[100px]"
      />

      {/* Hours + Volume */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1.5">Faktiska timmar</label>
          <input
            type="number"
            inputMode="decimal"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full rounded-r border border-border bg-surface px-3 py-3 text-[16px] text-ink"
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1.5">Sald volym</label>
          <input
            type="text"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            placeholder="t.ex. 48 st"
            className="w-full rounded-r border border-border bg-surface px-3 py-3 text-[16px] text-ink"
          />
        </div>
      </div>

      {/* Photo upload */}
      <label className="flex items-center justify-center gap-2 w-full py-3 rounded-r border border-dashed border-border bg-surface-alt text-ink-muted text-[13px] font-semibold cursor-pointer active:scale-[0.98] active:opacity-90 mb-2">
        <Camera size={16} />
        Foto fran uppdraget
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>
      {file && (
        <p className="text-xs text-ink-muted mb-2">{file.name}</p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={busy}
        className="w-full py-3 rounded-r bg-gold text-white font-semibold text-[14px] mt-3 active:scale-[0.98] active:opacity-90 disabled:opacity-60"
      >
        {busy ? 'Skickar...' : 'Skicka aterrapport'}
      </button>
    </div>
  );
}
