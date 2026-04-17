// ═══════════════════════════════════════════════════════════
// Centraliserad fallback-data — används när Supabase är
// otillgänglig eller returnerar tomt resultat.
//
// Denna fil exporterar också alla domäntyper och helpers
// som tidigare bodde i mock-data*.ts. De gamla mock-data*.ts
// är nu tunna re-export-skal för bakåtkompatibilitet.
// ═══════════════════════════════════════════════════════════

import type { BookingStage, ServiceType } from '@/hooks/use-bookings';

// ── BUTIKER ──────────────────────────────────────────────

export interface ButikContact {
  namn: string;
  tel: string;
  isPrimary: boolean;
}

export interface Butik {
  id: string;
  namn: string;
  ort: string;
  region: string;
  lat: number;
  lng: number;
  kontakter: ButikContact[];
}

export const FALLBACK_BUTIKER: Butik[] = [
  { id: 'bu1', namn: 'Hemköp Wasahallen', ort: 'Stockholm', region: 'Stockholm', lat: 59.340, lng: 18.058, kontakter: [{ namn: 'Ulf', tel: '078-88 899', isPrimary: true }] },
  { id: 'bu2', namn: 'Ica Maxi Bromma', ort: 'Bromma', region: 'Stockholm', lat: 59.354, lng: 17.940, kontakter: [{ namn: 'Martin', tel: '08-123456', isPrimary: true }] },
  { id: 'bu3', namn: 'Stora Coop Arninge', ort: 'Täby', region: 'Stockholm', lat: 59.444, lng: 18.108, kontakter: [{ namn: 'Tony', tel: '08-123654', isPrimary: true }] },
  { id: 'bu4', namn: 'Ica Maxi Nacka', ort: 'Nacka', region: 'Stockholm', lat: 59.311, lng: 18.164, kontakter: [{ namn: 'Ida', tel: '073-1111', isPrimary: true }] },
  { id: 'bu5', namn: 'Ica Maxi Vasa', ort: 'Södertälje', region: 'Stockholm', lat: 59.195, lng: 17.626, kontakter: [{ namn: 'Tobias', tel: '08-123456', isPrimary: true }] },
  { id: 'bu6', namn: 'Ica SM Nykvarn', ort: 'Nykvarn', region: 'Stockholm', lat: 59.179, lng: 17.434, kontakter: [{ namn: 'Micke', tel: '', isPrimary: true }] },
  { id: 'bu7', namn: 'Ica Maxi Skövde', ort: 'Skövde', region: 'Utanför Stockholm', lat: 58.391, lng: 13.845, kontakter: [{ namn: 'Arne', tel: '087-7777', isPrimary: true }] },
  { id: 'bu8', namn: 'Stora Coop Orminge', ort: 'Nacka', region: 'Löpande uppdrag', lat: 59.327, lng: 18.228, kontakter: [{ namn: 'Sandra', tel: '076-391 61 39', isPrimary: true }] },
  { id: 'bu9', namn: 'Ica Kvantum Farsta', ort: 'Farsta', region: 'Löpande uppdrag', lat: 59.244, lng: 18.091, kontakter: [{ namn: 'Isak', tel: '', isPrimary: true }] },
  { id: 'bu10', namn: 'Coop Konsum Gävle', ort: 'Gävle', region: 'Utanför Stockholm', lat: 60.675, lng: 17.141, kontakter: [{ namn: 'Pernilla', tel: '026-88 99', isPrimary: true }] },
];

// ── KUNDER ───────────────────────────────────────────────

export interface KundContact {
  namn: string;
  tel: string;
  email?: string;
  isPrimary: boolean;
}

export interface Kund {
  id: string;
  namn: string;
  domain?: string;
  kontakter: KundContact[];
}

export const FALLBACK_KUNDER: Kund[] = [
  { id: 'k1', namn: 'Falbygdens Ost', domain: 'falbygdensost.se', kontakter: [{ namn: 'Jenny Reftegård', tel: '072-371 00 31', isPrimary: true }, { namn: 'Urban', tel: '073-383 31 30', isPrimary: false }] },
  { id: 'k2', namn: 'Hanssons', domain: 'hanssons.eu', kontakter: [{ namn: 'Emma Hansson', tel: '011-122 22', isPrimary: true }] },
  { id: 'k3', namn: 'Bake my day', domain: 'bakemyday.se', kontakter: [{ namn: 'Maria', tel: '08-123456', isPrimary: true }] },
  { id: 'k4', namn: 'Wernerssons', domain: 'wernersonsost.se', kontakter: [{ namn: 'Malin', tel: '071-233 44', isPrimary: true }, { namn: 'Helena Wieweg', tel: '071-233 44', isPrimary: false }] },
  { id: 'k5', namn: 'Dafgård', domain: 'dafgard.se', kontakter: [{ namn: 'Fredrik Eriksson', tel: '073-111 11', isPrimary: true }] },
  { id: 'k6', namn: 'Engelmanns', domain: 'engelmanns.se', kontakter: [{ namn: 'Tobbe', tel: '070-888 99 00', isPrimary: true }] },
  { id: 'k7', namn: 'Härryda', kontakter: [{ namn: 'Miguell Frignell', tel: '08-5555', isPrimary: true }] },
];

// ── PERSONAL ─────────────────────────────────────────────

export interface Personal {
  id: string;
  namn: string;
  initialer: string;
  hemort: string;
  lat: number;
  lng: number;
  maxRadiusKm: number;
  tel: string;
  email: string;
  kompetenser: ServiceType[];
  specialiteter: string[];
  sprak: string[];
  certifieringar: string[];
  tillganglighet: string;
  erfarenhetAr: number;
  betyg: number;
  antalUppdrag: number;
  anteckningar: string;
  active: boolean;
}

export const FALLBACK_PERSONAL: Personal[] = [
  { id: 'p1', namn: 'Lars Djupsjö', initialer: 'LD', hemort: 'Hägersten', lat: 59.296, lng: 18.004, maxRadiusKm: 50, tel: '070-111 22 33', email: 'lars@crew2you.se', kompetenser: ['demo', 'sampling'], specialiteter: ['fisk', 'skaldjur', 'mejeri'], sprak: ['svenska', 'engelska'], certifieringar: ['livsmedelshygien'], tillganglighet: 'Heltid', erfarenhetAr: 4, betyg: 4.8, antalUppdrag: 87, anteckningar: 'Mycket uppskattad av butikerna. Säljer bra.', active: true },
  { id: 'p2', namn: 'Stina Bergkvist', initialer: 'SB', hemort: 'Nacka', lat: 59.311, lng: 18.164, maxRadiusKm: 40, tel: '070-222 33 44', email: 'stina@crew2you.se', kompetenser: ['demo', 'plock'], specialiteter: ['ost', 'mejeri', 'chark'], sprak: ['svenska'], certifieringar: ['livsmedelshygien'], tillganglighet: 'Heltid', erfarenhetAr: 3, betyg: 4.6, antalUppdrag: 64, anteckningar: 'Pålitlig. Bra på plock och orderhanterin.', active: true },
  { id: 'p3', namn: 'Cicci G', initialer: 'CG', hemort: 'Solna', lat: 59.365, lng: 18.000, maxRadiusKm: 35, tel: '070-333 44 55', email: 'cicci@crew2you.se', kompetenser: ['demo', 'event'], specialiteter: ['fryst', 'färdigmat'], sprak: ['svenska', 'engelska'], certifieringar: ['livsmedelshygien'], tillganglighet: 'Deltid', erfarenhetAr: 2, betyg: 4.5, antalUppdrag: 31, anteckningar: 'Energisk, bra på events.', active: true },
  { id: 'p4', namn: 'Lars Smith', initialer: 'LS', hemort: 'Bromma', lat: 59.354, lng: 17.940, maxRadiusKm: 45, tel: '070-444 55 66', email: 'lars.s@crew2you.se', kompetenser: ['demo', 'sampling'], specialiteter: ['bageri', 'bröd'], sprak: ['svenska', 'engelska', 'tyska'], certifieringar: ['livsmedelshygien'], tillganglighet: 'Heltid', erfarenhetAr: 5, betyg: 4.7, antalUppdrag: 102, anteckningar: 'Senior demovärd. Mycket professionell.', active: false },
  { id: 'p5', namn: 'Sven-Olof Granberg', initialer: 'SG', hemort: 'Täby', lat: 59.444, lng: 18.071, maxRadiusKm: 60, tel: '070-555 66 77', email: 'sven@crew2you.se', kompetenser: ['demo', 'sampling', 'event'], specialiteter: ['ost', 'delikatess'], sprak: ['svenska', 'franska'], certifieringar: ['livsmedelshygien', 'alkoholtillstånd'], tillganglighet: 'Heltid', erfarenhetAr: 8, betyg: 4.9, antalUppdrag: 156, anteckningar: 'Toppvärd. Lång erfarenhet av ostprovning.', active: true },
  { id: 'p6', namn: 'Elaine', initialer: 'EL', hemort: 'Farsta', lat: 59.244, lng: 18.091, maxRadiusKm: 30, tel: '070-666 77 88', email: 'elaine@crew2you.se', kompetenser: ['plock'], specialiteter: ['ost', 'mejeri'], sprak: ['svenska', 'engelska'], certifieringar: ['livsmedelshygien'], tillganglighet: 'Deltid', erfarenhetAr: 1, betyg: 4.3, antalUppdrag: 18, anteckningar: 'Ny men läraktig. Fokus på plockrundor.', active: false },
  { id: 'p7', namn: 'Anna Lindström', initialer: 'AL', hemort: 'Södermalm', lat: 59.315, lng: 18.070, maxRadiusKm: 40, tel: '070-777 88 99', email: 'anna@crew2you.se', kompetenser: ['demo', 'sampling', 'event'], specialiteter: ['dryck', 'kaffe', 'te'], sprak: ['svenska', 'engelska', 'spanska'], certifieringar: ['livsmedelshygien', 'barista'], tillganglighet: 'Heltid', erfarenhetAr: 3, betyg: 4.7, antalUppdrag: 45, anteckningar: 'Utmärkt på dryckesprovningar.', active: true },
  { id: 'p8', namn: 'Johan Berg', initialer: 'JB', hemort: 'Kungsholmen', lat: 59.332, lng: 18.036, maxRadiusKm: 50, tel: '070-888 99 00', email: 'johan@crew2you.se', kompetenser: ['demo', 'event'], specialiteter: ['kött', 'grillning', 'chark'], sprak: ['svenska'], certifieringar: ['livsmedelshygien'], tillganglighet: 'Heltid', erfarenhetAr: 6, betyg: 4.8, antalUppdrag: 93, anteckningar: 'Specialist på grilldemonstration och köttprodukter.', active: true },
];

// ── BOKNINGAR ────────────────────────────────────────────

export interface AssignedPerson {
  personnelId: string;
  personnelName: string;
  role: 'primary' | 'secondary';
}

export interface Booking {
  id: string;
  butik: string;
  kontakt: string;
  tel: string;
  ort: string;
  region: string;
  dagar: string;
  timmar: number;
  kund: string;
  kundKontakt: string;
  tjanst: ServiceType;
  assignedPersonnel: AssignedPerson[];
  produkt: string;
  material: string;
  utskick?: string;
  info: string;
  ovrigInfo?: string;
  stage: BookingStage;
  anlagd: string;
  aterrapport?: string;
}

// Helper to get display name for a booking's personnel
export function getPersonnelDisplay(booking: Booking): string {
  if (booking.assignedPersonnel.length === 0) return '';
  if (booking.assignedPersonnel.length === 1) return booking.assignedPersonnel[0].personnelName;
  return booking.assignedPersonnel.map(p => {
    const parts = p.personnelName.split(' ');
    return parts[0] + (parts[1] ? ' ' + parts[1][0] + '.' : '');
  }).join(' + ');
}

export function getPrimaryPersonnel(booking: Booking): AssignedPerson | null {
  return booking.assignedPersonnel.find(p => p.role === 'primary') || booking.assignedPersonnel[0] || null;
}

export function hasPersonnel(booking: Booking): boolean {
  return booking.assignedPersonnel.length > 0;
}

export function isPersonAssigned(booking: Booking, personnelName: string): boolean {
  return booking.assignedPersonnel.some(p => p.personnelName === personnelName);
}

export const FALLBACK_BOKNINGAR: Booking[] = [
  { id: 'b1', butik: 'Hemköp Wasahallen', kontakt: 'Ulf', tel: '078-88 899', ort: 'Stockholm', region: 'Stockholm', dagar: 'tis 10-18', timmar: 7, kund: 'Hanssons', kundKontakt: 'Emma Hansson 011-122', tjanst: 'demo', assignedPersonnel: [{ personnelId: 'p1', personnelName: 'Lars Djupsjö', role: 'primary' }, { personnelId: 'p7', personnelName: 'Anna Lindström', role: 'secondary' }], produkt: 'Hummersoppa', material: 'Demofat + skedar + stekplatta + kastrull + slev', utskick: 'Demofat + skedar GL 15415 1/1 MK', info: 'Info ok! 7/1 mk', stage: 'aterrapporterad', anlagd: '2026-01-01', aterrapport: 'Butiken var jättenöjd, han sålde bra och var väldigt aktiv under demon.' },
  { id: 'b2', butik: 'Ica Maxi Bromma', kontakt: 'Martin', tel: '08-123456', ort: 'Bromma', region: 'Stockholm', dagar: 'fre 11-19', timmar: 7, kund: 'Bake my day', kundKontakt: 'Maria 08-123456', tjanst: 'demo', assignedPersonnel: [{ personnelId: 'p4', personnelName: 'Lars Smith', role: 'primary' }, { personnelId: 'p3', personnelName: 'Cicci G', role: 'secondary' }], produkt: 'Nybakat bröd', material: 'Brödrost + smörkniv', info: '', stage: 'bekraftad', anlagd: '2026-01-29' },
  { id: 'b3', butik: 'Stora Coop Arninge', kontakt: 'Tony', tel: '08-123654', ort: 'Täby', region: 'Stockholm', dagar: 'lör 11-16', timmar: 8, kund: 'Wernerssons', kundKontakt: 'Malin 123456', tjanst: 'demo', assignedPersonnel: [{ personnelId: 'p5', personnelName: 'Sven-Olof Granberg', role: 'primary' }], produkt: 'Brie de maux', material: 'Tandpetare + svart duk', info: 'Annorlunda tid', ovrigInfo: 'Nyöppning i butiken. 1 timme extra.', stage: 'personal', anlagd: '2026-01-04' },
  { id: 'b4', butik: 'Ica Maxi Nacka', kontakt: 'Ida', tel: '073-1111', ort: 'Nacka', region: 'Stockholm', dagar: 'tor+fre 11-19', timmar: 7, kund: 'Dafgård', kundKontakt: 'Fredrik Eriksson 073-11111', tjanst: 'demo', assignedPersonnel: [{ personnelId: 'p3', personnelName: 'Cicci G', role: 'primary' }], produkt: 'Lasagne', material: 'Ugn + slev, demofat + pommesgafflar', utskick: 'Ugn + demofat + pommesgafflar', info: 'Info ok! Utan produkter 8/1 mk', ovrigInfo: 'Meddelar vart de ställer ugnen så GL hittar på måndag', stage: 'bekraftad', anlagd: '2026-01-08' },
  { id: 'b5', butik: 'Ica Maxi Vasa', kontakt: 'Tobias', tel: '08-123456', ort: 'Södertälje', region: 'Stockholm', dagar: 'tor+fre 10-18', timmar: 14, kund: 'Wernerssons', kundKontakt: 'Helena Wieweg 071-233 44', tjanst: 'demo', assignedPersonnel: [], produkt: 'Tage', material: 'Tandpetare', info: '', ovrigInfo: 'Lämnar demoprover.', stage: 'bokad', anlagd: '2026-02-03' },
  { id: 'b6', butik: 'Ica SM Nykvarn', kontakt: 'Micke', tel: '', ort: 'Nykvarn', region: 'Stockholm', dagar: 'fre 11-19', timmar: 7, kund: 'Engelmanns', kundKontakt: 'Tobbe', tjanst: 'demo', assignedPersonnel: [{ personnelId: 'p2', personnelName: 'Stina Bergkvist', role: 'primary' }], produkt: 'Kaltbach Creamy', material: 'Tandpetare', info: 'ok', stage: 'genomford', anlagd: '2026-04-02' },
  { id: 'b7', butik: 'Ica Maxi Skövde', kontakt: 'Arne', tel: '087-7777', ort: 'Skövde', region: 'Utanför Stockholm', dagar: 'fre 11-19', timmar: 7, kund: 'Härryda', kundKontakt: 'Miguell Frignell 08-5555', tjanst: 'demo', assignedPersonnel: [], produkt: '', material: '', info: 'Behöver veta senast torsdag om denna går att lösa', stage: 'inkommen', anlagd: '2026-01-03' },
  { id: 'b8', butik: 'Stora Coop Orminge', kontakt: 'Sandra', tel: '076-391 61 39', ort: 'Nacka', region: 'Löpande uppdrag', dagar: 'mån+tor', timmar: 4, kund: 'Falbygdens', kundKontakt: 'Jenny Reftegård 072-371 00 31', tjanst: 'plock', assignedPersonnel: [{ personnelId: 'p2', personnelName: 'Stina Bergkvist', role: 'primary' }], produkt: 'Ost — sortiment', material: '', info: 'Order måndag innan kl. 9 + plock. Tor plock baklager / piff', stage: 'aterrapporterad', anlagd: '2025-12-15' },
  { id: 'b9', butik: 'Ica Kvantum Farsta', kontakt: 'Isak', tel: '', ort: 'Farsta', region: 'Löpande uppdrag', dagar: 'mån+tor', timmar: 4, kund: 'Falbygdens ost', kundKontakt: 'Urban 073-383 31 30', tjanst: 'plock', assignedPersonnel: [{ personnelId: 'p6', personnelName: 'Elaine', role: 'primary' }], produkt: 'Ost — sortiment', material: '', info: 'Order måndag innan kl. 9 + plock. Tor plock baklager / piff', ovrigInfo: 'Vi sätter ner priserna och lämnar i "bra pris"-kylen.', stage: 'fakturerad', anlagd: '2025-12-15' },
  { id: 'b10', butik: 'Coop Konsum Gävle', kontakt: 'Pernilla', tel: '026-88 99', ort: 'Gävle', region: 'Utanför Stockholm', dagar: 'fre 11-18', timmar: 7, kund: 'Falbygdens Ost', kundKontakt: 'Jenny Reftegård', tjanst: 'demo', assignedPersonnel: [], produkt: 'Västerbottensost', material: '', info: '', stage: 'inkommen', anlagd: '2026-04-12' },
  { id: 'b11', butik: 'Hemköp Wasahallen', kontakt: 'Ulf', tel: '078-88 899', ort: 'Stockholm', region: 'Stockholm', dagar: 'mån 10-17', timmar: 7, kund: 'Falbygdens Ost', kundKontakt: 'Jenny Reftegård 072-371 00 31', tjanst: 'demo', assignedPersonnel: [{ personnelId: 'p7', personnelName: 'Anna Lindström', role: 'primary' }], produkt: 'Prästost', material: 'Tandpetare + duk', info: '', stage: 'personal', anlagd: '2026-03-20' },
  { id: 'b12', butik: 'Ica Maxi Nacka', kontakt: 'Ida', tel: '073-1111', ort: 'Nacka', region: 'Stockholm', dagar: 'ons 11-18', timmar: 7, kund: 'Hanssons', kundKontakt: 'Emma Hansson 011-122', tjanst: 'sampling', assignedPersonnel: [{ personnelId: 'p8', personnelName: 'Johan Berg', role: 'primary' }], produkt: 'Grillkorv', material: 'Grill + tänger + engångsassietter', info: 'Säsongsstart grillsäsong', stage: 'bokad', anlagd: '2026-04-01' },
  { id: 'b13', butik: 'Ica Maxi Bromma', kontakt: 'Martin', tel: '08-123456', ort: 'Bromma', region: 'Stockholm', dagar: 'lör 10-16', timmar: 6, kund: 'Dafgård', kundKontakt: 'Fredrik Eriksson 073-11111', tjanst: 'demo', assignedPersonnel: [], produkt: 'Pannbiff', material: 'Stekplatta + pommesgafflar', info: '', stage: 'inkommen', anlagd: '2026-04-14' },
  { id: 'b14', butik: 'Stora Coop Arninge', kontakt: 'Tony', tel: '08-123654', ort: 'Täby', region: 'Stockholm', dagar: 'fre 11-18', timmar: 7, kund: 'Engelmanns', kundKontakt: 'Tobbe 070-888 99 00', tjanst: 'demo', assignedPersonnel: [{ personnelId: 'p5', personnelName: 'Sven-Olof Granberg', role: 'primary' }], produkt: 'Emmentaler', material: 'Tandpetare + svart duk', info: '', stage: 'genomford', anlagd: '2026-03-28' },
  { id: 'b15', butik: 'Ica Maxi Vasa', kontakt: 'Tobias', tel: '08-123456', ort: 'Södertälje', region: 'Stockholm', dagar: 'mån 09-16', timmar: 7, kund: 'Bake my day', kundKontakt: 'Maria 08-123456', tjanst: 'event', assignedPersonnel: [{ personnelId: 'p1', personnelName: 'Lars Djupsjö', role: 'primary' }, { personnelId: 'p8', personnelName: 'Johan Berg', role: 'secondary' }], produkt: 'Nybakat sortiment', material: 'Brödkorg + smörkniv + servetter', info: 'Nyhetslansering', stage: 'bekraftad', anlagd: '2026-04-10' },
];

// ── UTLÄGG ───────────────────────────────────────────────

export interface Expense {
  id: string;
  bokningId: string;
  person: string;
  typ: string;
  belopp: number;
  beskrivning: string;
  datum: string;
  // Milersättningsspecifika fält (används bara när typ === 'Milersättning')
  reportedKm?: number;
  kmRate?: number;
  isRoundtrip?: boolean;
  mileageComment?: string;
}

// ── PERSONAL-UTLÄGG (personalappen) ─────────────────────

export interface PersonalExpense {
  id: string;
  personnelId: string;
  bookingId: string;
  type: 'material' | 'milersattning' | 'parkering' | 'mat_fika' | 'ovrigt';
  amount: number;
  description: string;
  date: string;
  receiptUrl: string | null;
  // Milersättningsspecifika fält (används bara när type === 'milersattning')
  reportedKm?: number;
  kmRate?: number;
  isRoundtrip?: boolean;
  mileageComment?: string;
}

export const FALLBACK_PERSONAL_EXPENSES: PersonalExpense[] = [
  // pe1: Stina Nacka -> Nykvarn. Expected t/r ~118 km, reported 230 km → misstänkt
  { id: 'pe1', personnelId: 'p2', bookingId: 'b6', type: 'milersattning', amount: 575, description: 'Resa till Nykvarn tur-retur, 23 mil', date: '2026-04-02', receiptUrl: null, reportedKm: 230, kmRate: 2.5, isRoundtrip: true },
  { id: 'pe2', personnelId: 'p2', bookingId: 'b6', type: 'parkering', amount: 21, description: 'P-avgift vid Ica SM Nykvarn', date: '2026-04-02', receiptUrl: 'receipt_pe2.jpg' },
  // pe3: Stina Nacka -> Orminge (10 km t/r) reported 40 km → misstänkt
  { id: 'pe3', personnelId: 'p2', bookingId: 'b8', type: 'milersattning', amount: 120, description: 'Plockrunda Orminge v.15', date: '2026-04-10', receiptUrl: null, reportedKm: 40, kmRate: 3.0, isRoundtrip: true },
  { id: 'pe4', personnelId: 'p2', bookingId: 'b6', type: 'mat_fika', amount: 89, description: 'Lunch under demo i Nykvarn', date: '2026-04-02', receiptUrl: 'receipt_pe4.jpg' },
  { id: 'pe5', personnelId: 'p2', bookingId: 'b8', type: 'material', amount: 45, description: 'Plasthandskar och etiketter', date: '2026-04-10', receiptUrl: null },
  // pe6 — OK: Stina Nacka -> Ica Maxi Nacka (b4 — men Stina ej bokad där, använd b8 Orminge igen med realistisk km)
  // Stina -> Orminge t/r ~10 km, reported 12 km → OK (absolute dev < 5 km)
  { id: 'pe6', personnelId: 'p2', bookingId: 'b8', type: 'milersattning', amount: 36, description: 'Plockrunda Orminge v.14', date: '2026-04-03', receiptUrl: null, reportedKm: 12, kmRate: 3.0, isRoundtrip: true },
  // pe7 — WARNING: Stina Nacka -> Stora Coop Arninge (ej Stina-bokning, men behöver booking med Stina, använd b6 Nykvarn)
  // Faktisk warning: Stina -> Nykvarn expected 118 km, reported 155 km → 31% avvikelse = warning
  { id: 'pe7', personnelId: 'p2', bookingId: 'b6', type: 'milersattning', amount: 465, description: 'Resa till Nykvarn v.14', date: '2026-03-28', receiptUrl: null, reportedKm: 155, kmRate: 3.0, isRoundtrip: true, mileageComment: 'Hämtade material i Solna på vägen' },
  // pe8 — SUSPICIOUS: Lars Djupsjö (Hägersten) -> Hemköp Wasahallen (b1). Expected t/r ~16 km, reported 215 km
  { id: 'pe8', personnelId: 'p1', bookingId: 'b1', type: 'milersattning', amount: 645, description: 'Resa till Wasahallen', date: '2026-01-07', receiptUrl: null, reportedKm: 215, kmRate: 3.0, isRoundtrip: true },
  // pe9 — OK: Sven-Olof (Täby) -> Ica Maxi Skövde (b7 finns men Sven-Olof ej bokad; använd b3 Arninge där Sven-Olof är primary).
  // Sven-Olof Täby -> Arninge t/r ~6 km; reported 7 km → OK (absolute dev < 5)
  { id: 'pe9', personnelId: 'p5', bookingId: 'b3', type: 'milersattning', amount: 21, description: 'Resa till Arninge', date: '2026-01-04', receiptUrl: null, reportedKm: 7, kmRate: 3.0, isRoundtrip: true },
];

// ── UTLÄGG (admin) ──────────────────────────────────────

export const FALLBACK_UTLAGG: Expense[] = [
  // u1: Lars Djupsjö Hägersten -> Wasahallen, expected t/r ~16 km, reported 40 km → misstänkt (150%)
  { id: 'u1', bokningId: 'b1', person: 'Lars Djupsjö', typ: 'Milersättning', belopp: 200, beskrivning: '4 mil + parkering', datum: '2026-01-07', reportedKm: 40, kmRate: 5.0, isRoundtrip: true },
  { id: 'u2', bokningId: 'b1', person: 'Lars Djupsjö', typ: 'Material', belopp: 532, beskrivning: '300 fat + sked + utskick', datum: '2026-01-07' },
  // u3: Stina Nacka -> Nykvarn t/r ~118 km, reported 230 km → misstänkt
  { id: 'u3', bokningId: 'b6', person: 'Stina Bergkvist', typ: 'Milersättning', belopp: 575, beskrivning: '23 mil resa till Nykvarn', datum: '2026-04-02', reportedKm: 230, kmRate: 2.5, isRoundtrip: true },
  { id: 'u4', bokningId: 'b6', person: 'Stina Bergkvist', typ: 'Parkering', belopp: 21, beskrivning: 'P-avgift Ica SM', datum: '2026-04-02' },
  // u5: Stina Nacka -> Orminge t/r ~10 km, reported 40 km → misstänkt
  { id: 'u5', bokningId: 'b8', person: 'Stina Bergkvist', typ: 'Milersättning', belopp: 120, beskrivning: 'Plockrunda v.15', datum: '2026-04-10', reportedKm: 40, kmRate: 3.0, isRoundtrip: true },
  { id: 'u6', bokningId: 'b12', person: 'Johan Berg', typ: 'Material', belopp: 345, beskrivning: 'Engångsgrillar + kol', datum: '2026-04-05' },
  // u7: Sven-Olof Täby -> Arninge (b14) t/r ~6 km, reported 30 km → misstänkt (kanske rundtur)
  { id: 'u7', bokningId: 'b14', person: 'Sven-Olof Granberg', typ: 'Milersättning', belopp: 150, beskrivning: 'Täby tur-retur', datum: '2026-03-28', reportedKm: 30, kmRate: 5.0, isRoundtrip: true },
];

// ── FAKTUROR (kundportal) ───────────────────────────────

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  invoiceNumber: string;
  date: string;
  bookingIds: string[];
  totalHours: number;
  laborCost: number;
  expenses: number;
  total: number;
  status: 'open' | 'paid' | 'overdue';
  paidDate?: string;
  dueDate?: string;
}

export const FALLBACK_INVOICES: Invoice[] = [
  {
    id: 'inv1', customerId: 'k1', customerName: 'Falbygdens Ost',
    invoiceNumber: '2026-003', date: '2026-04-14',
    bookingIds: ['b1', 'b8'],
    totalHours: 11, laborCost: 5445, expenses: 850, total: 6295,
    status: 'paid', paidDate: '2026-04-28',
  },
  {
    id: 'inv2', customerId: 'k1', customerName: 'Falbygdens Ost',
    invoiceNumber: '2026-002', date: '2026-03-18',
    bookingIds: ['b9'],
    totalHours: 4, laborCost: 1980, expenses: 0, total: 1980,
    status: 'paid', paidDate: '2026-04-01',
  },
  {
    id: 'inv3', customerId: 'k1', customerName: 'Falbygdens Ost',
    invoiceNumber: '2026-004', date: '2026-04-18',
    bookingIds: ['b10', 'b11'],
    totalHours: 14, laborCost: 6930, expenses: 440, total: 7370,
    status: 'open', dueDate: '2026-05-18',
  },
];

// ── KVALITETSUPPFÖLJNINGAR ──────────────────────────────

export interface QualityQuestion {
  id: string;
  label: string;
  description: string;
}

export const QUALITY_QUESTIONS: QualityQuestion[] = [
  { id: 'q1', label: 'Punktlighet', description: 'Kom demovärden i tid?' },
  { id: 'q2', label: 'Bemötande', description: 'Hur upplevde ni demovärldens bemötande?' },
  { id: 'q3', label: 'Produktkunskap', description: 'Hade demovärden bra koll på produkten?' },
  { id: 'q4', label: 'Försäljningsresultat', description: 'Hur var resultatet i relation till era förväntningar?' },
  { id: 'q5', label: 'Materialhantering', description: 'Var materialet väl omhändertaget?' },
  { id: 'q6', label: 'Återrapportering', description: 'Fick ni en bra rapport efteråt?' },
  { id: 'q7', label: 'Helhetsintryck', description: 'Hur nöjda är ni totalt med uppdraget?' },
];

export interface QualityReview {
  id: string;
  bookingId: string;
  personnelId: string;
  personnelName: string;
  customerName: string;
  storeName: string;
  date: string;
  reviewNumber: number;
  scores: Record<string, number>;
  comments: Record<string, string>;
  overallComment: string;
  averageScore: number;
}

function avg(scores: Record<string, number>): number {
  const vals = Object.values(scores);
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

const r1Scores: Record<string, number> = { q1: 5, q2: 5, q3: 4, q4: 5, q5: 4, q6: 5, q7: 5 };
const r2Scores: Record<string, number> = { q1: 4, q2: 5, q3: 4, q4: 4, q5: 5, q6: 4, q7: 5 };
const r3Scores: Record<string, number> = { q1: 5, q2: 4, q3: 5, q4: 4, q5: 4, q6: 4, q7: 5 };
const r4Scores: Record<string, number> = { q1: 5, q2: 5, q3: 4, q4: 4, q5: 4, q6: 5, q7: 4 };
const r5Scores: Record<string, number> = { q1: 4, q2: 4, q3: 5, q4: 5, q5: 5, q6: 4, q7: 5 };
const r6Scores: Record<string, number> = { q1: 5, q2: 5, q3: 5, q4: 5, q5: 5, q6: 4, q7: 5 };
const r7Scores: Record<string, number> = { q1: 4, q2: 5, q3: 4, q4: 4, q5: 4, q6: 5, q7: 4 };
const r8Scores: Record<string, number> = { q1: 4, q2: 4, q3: 4, q4: 3, q5: 4, q6: 4, q7: 5 };

export const FALLBACK_REVIEWS: QualityReview[] = [
  {
    id: 'qr1',
    bookingId: 'b8',
    personnelId: 'p2',
    personnelName: 'Stina Bergkvist',
    customerName: 'Falbygdens',
    storeName: 'Stora Coop Orminge',
    date: '2026-01-20',
    reviewNumber: 1,
    scores: r1Scores,
    comments: { q2: 'Mycket professionellt bemötande, butikspersonalen var imponerade.' },
    overallComment: 'Stina gjorde ett utmärkt jobb med plockrundan. Allt var välordnat och butiken var mycket nöjd.',
    averageScore: avg(r1Scores),
  },
  {
    id: 'qr2',
    bookingId: 'b6',
    personnelId: 'p2',
    personnelName: 'Stina Bergkvist',
    customerName: 'Engelmanns',
    storeName: 'Ica SM Nykvarn',
    date: '2026-04-05',
    reviewNumber: 2,
    scores: r2Scores,
    comments: { q4: 'Bra resultat men kunde ha varit ännu mer proaktiv med merförsäljning.' },
    overallComment: 'Bra genomförande överlag. Kunden nöjd med produktpresentationen.',
    averageScore: avg(r2Scores),
  },
  {
    id: 'qr3',
    bookingId: 'b8',
    personnelId: 'p2',
    personnelName: 'Stina Bergkvist',
    customerName: 'Falbygdens',
    storeName: 'Stora Coop Orminge',
    date: '2026-03-10',
    reviewNumber: 3,
    scores: r3Scores,
    comments: {},
    overallComment: 'Fortsatt pålitlig insats. Stina levererar konsekvent bra resultat.',
    averageScore: avg(r3Scores),
  },
  {
    id: 'qr4',
    bookingId: 'b1',
    personnelId: 'p1',
    personnelName: 'Lars Djupsjö',
    customerName: 'Hanssons',
    storeName: 'Hemköp Wasahallen',
    date: '2026-01-15',
    reviewNumber: 4,
    scores: r4Scores,
    comments: { q1: 'Kom i god tid och hade förberett allt innan start.' },
    overallComment: 'Lars levererade en stark demo. Butiken rapporterade god försäljning under dagen.',
    averageScore: avg(r4Scores),
  },
  {
    id: 'qr5',
    bookingId: 'b1',
    personnelId: 'p1',
    personnelName: 'Lars Djupsjö',
    customerName: 'Hanssons',
    storeName: 'Hemköp Wasahallen',
    date: '2026-02-28',
    reviewNumber: 5,
    scores: r5Scores,
    comments: { q3: 'Imponerande produktkunskap, kunde svara på alla kundfrågor.' },
    overallComment: 'Mycket bra insats. Lars är en pålitlig resurs för denna typ av uppdrag.',
    averageScore: avg(r5Scores),
  },
  {
    id: 'qr6',
    bookingId: 'b14',
    personnelId: 'p5',
    personnelName: 'Sven-Olof Granberg',
    customerName: 'Engelmanns',
    storeName: 'Stora Coop Arninge',
    date: '2026-04-01',
    reviewNumber: 6,
    scores: r6Scores,
    comments: { q7: 'Absolut toppklass. Sven-Olof är en av de bästa vi har.' },
    overallComment: 'Fantastisk demo av Emmentaler. Kunden extremt nöjd. Försäljningen översteg förväntan markant.',
    averageScore: avg(r6Scores),
  },
  {
    id: 'qr7',
    bookingId: 'b4',
    personnelId: 'p3',
    personnelName: 'Cicci G',
    customerName: 'Dafgård',
    storeName: 'Ica Maxi Nacka',
    date: '2026-01-25',
    reviewNumber: 7,
    scores: r7Scores,
    comments: {},
    overallComment: 'Cicci gjorde ett bra jobb med lasagnedemon. Energisk och trevlig.',
    averageScore: avg(r7Scores),
  },
  {
    id: 'qr8',
    bookingId: 'b9',
    personnelId: 'p6',
    personnelName: 'Elaine',
    customerName: 'Falbygdens ost',
    storeName: 'Ica Kvantum Farsta',
    date: '2026-02-15',
    reviewNumber: 8,
    scores: r8Scores,
    comments: { q4: 'Försäljningen var något under förväntningarna, men fin insats i övrigt.' },
    overallComment: 'Elaine skötte plockrundan bra. Lite mer erfarenhet behövs men bra grund.',
    averageScore: avg(r8Scores),
  },
];

// ── INKORG ──────────────────────────────────────────────

export type ParseStatus = 'complete' | 'partial' | 'incomplete';
export type Confidence = 'high' | 'medium' | 'low';

export interface ParsedField {
  label: string;
  value: string;
  confidence: Confidence;
}

export interface InboxEmail {
  id: string;
  from: { name: string; email: string; company?: string };
  subject: string;
  body: string;
  receivedAt: string;
  parseStatus: ParseStatus;
  parsedFields: ParsedField[];
  missingFields: string[];
  autoReplyDraft?: string;
  status: 'new' | 'booked' | 'awaiting_reply' | 'ignored';
}

export const FALLBACK_INBOX: InboxEmail[] = [
  {
    id: 'ie1',
    from: { name: 'Jenny Reftegård', email: 'jenny@falbygdens.se', company: 'Falbygdens Ost' },
    subject: 'Bokning demo Västerbottensost – Coop Gävle fre 25/4',
    body: `Hej!

Vi skulle vilja boka en demo av Västerbottensost på Coop Konsum Gävle fredagen den 25 april, kl 11–18 (7 timmar).

Kontaktperson i butiken är Pernilla, tel 026-88 99.

Material som behövs: tandpetare, svart duk och demofat. Vi skickar produkterna direkt till butiken via GL.

Tack på förhand!

Med vänlig hälsning,
Jenny Reftegård
Falbygdens Ost
072-371 00 31`,
    receivedAt: 'Idag 10:34',
    parseStatus: 'complete',
    parsedFields: [
      { label: 'Kund', value: 'Falbygdens Ost', confidence: 'high' },
      { label: 'Kundkontakt', value: 'Jenny Reftegård 072-371 00 31', confidence: 'high' },
      { label: 'Butik', value: 'Coop Konsum Gävle', confidence: 'high' },
      { label: 'Butikskontakt', value: 'Pernilla 026-88 99', confidence: 'high' },
      { label: 'Datum', value: 'fre 25/4 11–18', confidence: 'high' },
      { label: 'Timmar', value: '7', confidence: 'high' },
      { label: 'Produkt', value: 'Västerbottensost', confidence: 'high' },
      { label: 'Material', value: 'Tandpetare + svart duk + demofat', confidence: 'high' },
      { label: 'Tjänst', value: 'demo', confidence: 'high' },
    ],
    missingFields: [],
    status: 'new',
  },
  {
    id: 'ie2',
    from: { name: 'Erik Hansson', email: 'erik@hanssons.eu', company: 'Hanssons' },
    subject: 'Hummersoppa demo nästa vecka?',
    body: `Hej Crew2you!

Vi funderar på att köra en demo av vår hummersoppa nästa vecka, någon dag tisdag–torsdag. Helst någon butik i Stockholmsområdet.

Kan ni fixa det? Behöver nog stekplatta och demofat som vanligt.

Hälsningar,
Erik Hansson
Hanssons`,
    receivedAt: 'Idag 09:12',
    parseStatus: 'partial',
    parsedFields: [
      { label: 'Kund', value: 'Hanssons', confidence: 'high' },
      { label: 'Kundkontakt', value: 'Erik Hansson', confidence: 'high' },
      { label: 'Produkt', value: 'Hummersoppa', confidence: 'high' },
      { label: 'Datum', value: 'Nästa vecka tis–tor', confidence: 'medium' },
      { label: 'Region', value: 'Stockholm', confidence: 'medium' },
      { label: 'Material', value: 'Stekplatta + demofat', confidence: 'medium' },
      { label: 'Tjänst', value: 'demo', confidence: 'high' },
    ],
    missingFields: ['Exakt tid', 'Antal timmar', 'Butik', 'Butikskontakt'],
    autoReplyDraft: `Hej Erik!

Tack för din förfrågan om hummersoppa-demo. För att vi ska kunna boka in uppdraget behöver vi följande kompletterande uppgifter:

• Vilken butik ska demon hållas i?
• Vilken dag och exakt tid (start–slut)?
• Antal timmar?

Återkommer så snart vi har informationen!

Med vänlig hälsning,
Crew2you`,
    status: 'new',
  },
  {
    id: 'ie3',
    from: { name: 'Info', email: 'info@unknown-company.se' },
    subject: 'Demo?',
    body: `Hej,

Vi är intresserade av att köra en demo. Hur gör vi?

Mvh`,
    receivedAt: 'Igår 15:40',
    parseStatus: 'incomplete',
    parsedFields: [
      { label: 'Tjänst', value: 'demo', confidence: 'low' },
    ],
    missingFields: ['Kund/företag', 'Kontaktperson', 'Telefonnummer', 'Butik', 'Datum', 'Tid', 'Antal timmar', 'Produkt', 'Material'],
    autoReplyDraft: `Hej!

Tack för ert intresse för våra demotjänster. För att vi ska kunna gå vidare behöver vi lite mer information:

• Vilket företag representerar ni?
• Kontaktperson och telefonnummer
• Vilken produkt vill ni demonstrera?
• Vilken/vilka butiker är aktuella?
• Önskat datum och tid

Ni är välkomna att ringa oss på telefon om ni hellre vill diskutera uppdraget muntligt.

Med vänlig hälsning,
Crew2you`,
    status: 'new',
  },
];

// ── AUTOMATIONER ────────────────────────────────────────

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: { type: string; label: string }[];
  enabled: boolean;
  runs: number;
  lastRun: string;
  icon: string;
}

export const FALLBACK_AUTOMATIONS: Automation[] = [
  { id: 'a1', name: 'Bokningsbekräftelse till butik & kund', description: 'När ett uppdrag flyttas till "Bekräftad" skickas automatiskt mail till butikens kontaktperson samt uppdragsgivaren.', trigger: 'Status \u2192 Bekräftad', actions: [{ type: 'mail', label: 'Mail till butik' }, { type: 'mail', label: 'Mail till kund' }], enabled: true, runs: 32, lastRun: 'Idag 10:34', icon: 'Mail' },
  { id: 'a2', name: 'SMS + kalenderinvite till personal', description: 'När personal tilldelas ett uppdrag får hen SMS med adress + tid och en kalenderinvite.', trigger: 'Personal tillsatt', actions: [{ type: 'sms', label: 'SMS' }, { type: 'calendar', label: 'Kalender' }], enabled: true, runs: 28, lastRun: 'Igår 14:22', icon: 'MessageSquare' },
  { id: 'a3', name: 'Påminnelse-SMS 24h innan', description: 'Dagen innan uppdraget får demovärden SMS med påminnelse och material-checklista.', trigger: '24h före uppdrag', actions: [{ type: 'sms', label: 'SMS' }], enabled: true, runs: 24, lastRun: 'Idag 08:00', icon: 'MessageSquare' },
  { id: 'a4', name: 'Återrapport till uppdragsgivare', description: 'När demovärd skickar in återrapport vidarebefordras den automatiskt till kunden.', trigger: 'Status \u2192 Återrapporterad', actions: [{ type: 'mail', label: 'Mail till kund' }], enabled: true, runs: 19, lastRun: '14 apr 16:45', icon: 'Mail' },
  { id: 'a5', name: 'Fakturaunderlag till Fortnox', description: 'Vid återrapporterad status skapas automatiskt fakturaunderlag i Fortnox.', trigger: 'Status \u2192 Återrapporterad', actions: [{ type: 'fortnox', label: 'Fortnox-export' }], enabled: true, runs: 12, lastRun: '14 apr 16:45', icon: 'FileText' },
  { id: 'a6', name: 'Slack-notis vid nytt utlägg', description: 'När personal registrerar utlägg skickas notis till #ekonomi i Slack.', trigger: 'Nytt utlägg registrerat', actions: [{ type: 'slack', label: 'Slack #ekonomi' }], enabled: true, runs: 8, lastRun: '13 apr 11:20', icon: 'Hash' },
  { id: 'a7', name: 'Veckorapport till uppdragsgivare', description: 'Varje fredag 16:00 skickas en sammanställning av veckans uppdrag till varje kund.', trigger: 'Fredag 16:00', actions: [{ type: 'mail', label: 'Veckomail' }], enabled: false, runs: 0, lastRun: 'Aldrig', icon: 'BarChart3' },
  { id: 'a8', name: 'AI-matchning av personal', description: 'När en bokning saknar personal föreslår AI topp 3 kandidater baserat på geografi, kompetens och betyg.', trigger: 'Bokning utan personal', actions: [{ type: 'ai', label: 'AI-förslag' }], enabled: true, runs: 16, lastRun: 'Idag 09:15', icon: 'Zap' },
  { id: 'a9', name: 'AI-parsning av bokningsmail', description: 'Inkommande mail till bokning@crew2you.se parsas automatiskt av AI och skapar bokningsförslag.', trigger: 'Nytt mail \u2192 bokning@', actions: [{ type: 'ai', label: 'AI-parsning' }, { type: 'mail', label: 'Auto-svar' }], enabled: true, runs: 4, lastRun: 'Idag 10:34', icon: 'Zap' },
];

export interface AutomationRun {
  id: string;
  automationId: string;
  automationName: string;
  icon: string;
  timestamp: string;
  detail: string;
  status: 'success' | 'failed';
  error?: string;
}

export const FALLBACK_AUTOMATION_RUNS: AutomationRun[] = [
  { id: 'ar1', automationId: 'a1', automationName: 'Bokningsbekräftelse', icon: 'Mail', timestamp: 'Idag 10:34', detail: 'Mail till Jenny Reftegård \u00b7 Falbygdens Ost', status: 'success' },
  { id: 'ar2', automationId: 'a9', automationName: 'AI-parsning bokningsmail', icon: 'Zap', timestamp: 'Idag 10:34', detail: 'Parsat mail från jenny@falbygdens.se', status: 'success' },
  { id: 'ar3', automationId: 'a8', automationName: 'AI-matchning', icon: 'Zap', timestamp: 'Idag 09:15', detail: 'Föreslog Stina B, Lars D, Anna L för Coop Gävle', status: 'success' },
  { id: 'ar4', automationId: 'a3', automationName: 'Påminnelse-SMS', icon: 'MessageSquare', timestamp: 'Idag 08:00', detail: 'SMS till Stina Bergkvist \u00b7 Ica SM Nykvarn', status: 'success' },
  { id: 'ar5', automationId: 'a3', automationName: 'Påminnelse-SMS', icon: 'MessageSquare', timestamp: 'Idag 08:00', detail: 'SMS till Lars Djupsjö \u00b7 Hemköp Wasahallen', status: 'success' },
  { id: 'ar6', automationId: 'a4', automationName: 'Återrapport till kund', icon: 'Mail', timestamp: 'Igår 16:45', detail: 'Mail till Emma Hansson \u00b7 Hanssons', status: 'success' },
  { id: 'ar7', automationId: 'a5', automationName: 'Fortnox-export', icon: 'FileText', timestamp: 'Igår 16:45', detail: 'Fakturaunderlag #2026-004 skapat', status: 'success' },
  { id: 'ar8', automationId: 'a2', automationName: 'SMS + kalender', icon: 'MessageSquare', timestamp: 'Igår 14:22', detail: 'SMS + invite till Sven-Olof Granberg', status: 'success' },
  { id: 'ar9', automationId: 'a6', automationName: 'Slack-notis utlägg', icon: 'Hash', timestamp: 'Igår 11:20', detail: 'Stina Bergkvist \u00b7 Milersättning 575 kr', status: 'success' },
  { id: 'ar10', automationId: 'a1', automationName: 'Bokningsbekräftelse', icon: 'Mail', timestamp: '14 apr 15:30', detail: 'Mail till Martin \u00b7 Ica Maxi Bromma', status: 'failed', error: 'SMTP timeout \u2014 nytt försök om 5 min' },
  { id: 'ar11', automationId: 'a1', automationName: 'Bokningsbekräftelse', icon: 'Mail', timestamp: '14 apr 14:00', detail: 'Mail till Malin \u00b7 Wernerssons', status: 'success' },
  { id: 'ar12', automationId: 'a8', automationName: 'AI-matchning', icon: 'Zap', timestamp: '14 apr 10:00', detail: 'Föreslog Cicci G, Johan B för Ica Maxi Bromma', status: 'success' },
  { id: 'ar13', automationId: 'a3', automationName: 'Påminnelse-SMS', icon: 'MessageSquare', timestamp: '13 apr 08:00', detail: 'SMS till Cicci G \u00b7 Ica Maxi Nacka', status: 'success' },
  { id: 'ar14', automationId: 'a4', automationName: 'Återrapport till kund', icon: 'Mail', timestamp: '12 apr 17:00', detail: 'Mail till Jenny Reftegård \u00b7 Falbygdens', status: 'success' },
  { id: 'ar15', automationId: 'a2', automationName: 'SMS + kalender', icon: 'MessageSquare', timestamp: '12 apr 09:30', detail: 'SMS + invite till Lars Smith', status: 'success' },
];
