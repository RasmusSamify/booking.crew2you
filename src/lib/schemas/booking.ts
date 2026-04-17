import { z } from 'zod';

const assignedPersonSchema = z.object({
  personnelId: z.string(),
  personnelName: z.string(),
  role: z.enum(['primary', 'secondary']),
});

export const bookingSchema = z.object({
  butik: z.string().min(1, 'Ange butik'),
  kontakt: z.string(),
  tel: z.string(),
  ort: z.string().min(1, 'Ange ort'),
  region: z.string().min(1, 'Ange region'),
  dagar: z.string().min(1, 'Ange datum/dagar'),
  timmar: z.number().min(0.5, 'Ange antal timmar'),
  kund: z.string().min(1, 'Ange kund'),
  kundKontakt: z.string(),
  tjanst: z.enum(['demo', 'plock', 'sampling', 'event']),
  assignedPersonnel: z.array(assignedPersonSchema),
  produkt: z.string(),
  material: z.string(),
  info: z.string(),
  ovrigInfo: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
