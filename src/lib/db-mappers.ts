// ═══════════════════════════════════════════════════════════
// Mappers — DB row (snake_case English) → domain type (Swedish
// camelCase). Used by data hooks to keep component code
// agnostic of the underlying schema.
// ═══════════════════════════════════════════════════════════

import type { Database } from '@/types/database';
import type {
  Booking,
  Personal,
  Kund,
  Butik,
  Expense,
  Invoice,
  Automation,
  AutomationRun,
  InboxEmail,
  ParseStatus,
  Confidence,
  ParsedField,
  QualityReview,
} from '@/lib/fallback-data';

type Row<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type BookingRow = Row<'bookings'>;
export type BookingPersonnelRow = Row<'booking_personnel'>;
export type PersonnelRow = Row<'personnel'>;
export type CustomerRow = Row<'customers'>;
export type CustomerContactRow = Row<'customer_contacts'>;
export type StoreRow = Row<'stores'>;
export type StoreContactRow = Row<'store_contacts'>;
export type ExpenseRow = Row<'expenses'>;
export type InvoiceRow = Row<'invoices'>;
export type InvoiceBookingRow = Row<'invoice_bookings'>;
export type AutomationRow = Row<'automations'>;
export type AutomationRunRow = Row<'automation_runs'>;
export type InboxEmailRow = Row<'inbox_emails'>;
export type QualityReviewRow = Row<'quality_reviews'>;

// ── BOOKING ──────────────────────────────────────────────

export function mapBooking(
  row: BookingRow & {
    booking_personnel?:
      | (BookingPersonnelRow & { personnel?: Pick<PersonnelRow, 'id' | 'full_name'> | null })[]
      | null;
  }
): Booking {
  const bp = row.booking_personnel ?? [];
  return {
    id: row.id,
    butik: row.store_name,
    kontakt: row.store_contact_name ?? '',
    tel: row.store_contact_phone ?? '',
    ort: row.store_city ?? '',
    region: row.region ?? '',
    dagar: row.days_text ?? '',
    timmar: Number(row.hours ?? 0),
    kund: row.customer_name,
    kundKontakt: row.customer_contact ?? '',
    tjanst: row.service_type as Booking['tjanst'],
    assignedPersonnel: bp.map((link) => ({
      personnelId: link.personnel_id,
      personnelName: link.personnel?.full_name ?? '',
      role: (link.role === 'secondary' ? 'secondary' : 'primary') as 'primary' | 'secondary',
    })),
    produkt: row.product ?? '',
    material: row.material ?? '',
    utskick: row.shipped_items ?? undefined,
    info: row.info ?? '',
    ovrigInfo: row.other_info ?? undefined,
    stage: row.stage as Booking['stage'],
    anlagd: (row.created_at ?? '').slice(0, 10),
    aterrapport: row.report_text ?? undefined,
  };
}

// ── PERSONAL ─────────────────────────────────────────────

export function mapPersonnel(row: PersonnelRow): Personal {
  return {
    id: row.id,
    namn: row.full_name,
    initialer: row.initials,
    hemort: row.home_city ?? '',
    lat: Number(row.lat ?? 0),
    lng: Number(row.lng ?? 0),
    maxRadiusKm: Number(row.max_radius_km ?? 0),
    tel: row.phone ?? '',
    email: row.email ?? '',
    kompetenser: (row.competencies ?? []) as Personal['kompetenser'],
    specialiteter: row.specialties ?? [],
    sprak: row.languages ?? [],
    certifieringar: row.certifications ?? [],
    tillganglighet: row.availability ?? '',
    erfarenhetAr: Number(row.experience_years ?? 0),
    betyg: Number(row.rating ?? 0),
    antalUppdrag: Number(row.total_assignments ?? 0),
    anteckningar: row.notes ?? '',
    active: Boolean(row.active),
  };
}

// ── KUND ─────────────────────────────────────────────────

export function mapCustomer(row: CustomerRow, contacts: CustomerContactRow[] = []): Kund {
  return {
    id: row.id,
    namn: row.name,
    domain: row.domain ?? undefined,
    kontakter: contacts.map((c) => ({
      namn: c.name,
      tel: c.phone ?? '',
      email: c.email ?? undefined,
      isPrimary: Boolean(c.is_primary),
    })),
  };
}

// ── BUTIK ────────────────────────────────────────────────

export function mapStore(row: StoreRow, contacts: StoreContactRow[] = []): Butik {
  return {
    id: row.id,
    namn: row.name,
    ort: row.city ?? '',
    region: row.region ?? '',
    lat: Number(row.lat ?? 0),
    lng: Number(row.lng ?? 0),
    kontakter: contacts.map((c) => ({
      namn: c.name,
      tel: c.phone ?? '',
      isPrimary: Boolean(c.is_primary),
    })),
  };
}

// ── EXPENSE ──────────────────────────────────────────────

// Map DB type → domain typ (Swedish, first-letter-capital for admin table)
function mapExpenseTypeToDomain(dbType: string): string {
  switch (dbType) {
    case 'milersattning':
      return 'Milersättning';
    case 'material':
      return 'Material';
    case 'parkering':
      return 'Parkering';
    case 'mat_fika':
      return 'Mat/fika';
    case 'ovrigt':
      return 'Övrigt';
    default:
      return dbType;
  }
}

export function mapExpense(
  row: ExpenseRow & { personnel?: Pick<PersonnelRow, 'full_name'> | null }
): Expense {
  return {
    id: row.id,
    bokningId: row.booking_id ?? '',
    person: row.personnel?.full_name ?? '',
    typ: mapExpenseTypeToDomain(row.type),
    belopp: Number(row.amount ?? 0),
    beskrivning: row.description ?? '',
    datum: row.expense_date,
    reportedKm: row.reported_km ?? undefined,
    kmRate: row.km_rate ?? undefined,
    isRoundtrip: row.is_roundtrip ?? undefined,
    mileageComment: row.mileage_comment ?? undefined,
  };
}

// ── INVOICE ──────────────────────────────────────────────

export function mapInvoice(
  row: InvoiceRow & {
    customer?: Pick<CustomerRow, 'name'> | null;
    invoice_bookings?: Pick<InvoiceBookingRow, 'booking_id'>[] | null;
  }
): Invoice {
  const status = (row.status === 'paid' || row.status === 'overdue' ? row.status : 'open') as
    | 'open'
    | 'paid'
    | 'overdue';
  return {
    id: row.id,
    customerId: row.customer_id,
    customerName: row.customer?.name ?? '',
    invoiceNumber: row.invoice_number,
    date: row.invoice_date,
    bookingIds: (row.invoice_bookings ?? []).map((ib) => ib.booking_id),
    totalHours: Number(row.total_hours ?? 0),
    laborCost: Number(row.labor_cost ?? 0),
    expenses: Number(row.expenses_total ?? 0),
    total: Number(row.total ?? 0),
    status,
    paidDate: row.paid_date ?? undefined,
    dueDate: row.due_date ?? undefined,
  };
}

// ── AUTOMATION ───────────────────────────────────────────

export function mapAutomation(row: AutomationRow): Automation {
  const actions = Array.isArray(row.actions)
    ? (row.actions as { type: string; label: string }[])
    : [];
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    trigger: row.trigger_text ?? '',
    actions,
    enabled: Boolean(row.enabled),
    runs: Number(row.runs ?? 0),
    lastRun: row.last_run ?? '',
    icon: row.icon_name ?? '',
  };
}

export function mapAutomationRun(row: AutomationRunRow): AutomationRun {
  return {
    id: row.id,
    automationId: row.automation_id ?? '',
    automationName: row.automation_name ?? '',
    icon: row.icon_name ?? '',
    timestamp: row.timestamp_text ?? '',
    detail: row.detail ?? '',
    status: (row.status === 'failed' ? 'failed' : 'success') as 'success' | 'failed',
    error: row.error ?? undefined,
  };
}

// ── INBOX EMAIL ──────────────────────────────────────────

export function mapInboxEmail(row: InboxEmailRow): InboxEmail {
  const parseStatus = (['complete', 'partial', 'incomplete'].includes(row.parse_status)
    ? row.parse_status
    : 'incomplete') as ParseStatus;
  const status = (['new', 'booked', 'awaiting_reply', 'ignored'].includes(row.status)
    ? row.status
    : 'new') as InboxEmail['status'];

  const rawFields = Array.isArray(row.parsed_fields) ? row.parsed_fields : [];
  const parsedFields: ParsedField[] = rawFields.map((f) => {
    const obj = (f ?? {}) as { label?: string; value?: string; confidence?: string };
    const conf: Confidence = obj.confidence === 'high' || obj.confidence === 'medium' || obj.confidence === 'low'
      ? obj.confidence
      : 'low';
    return {
      label: obj.label ?? '',
      value: obj.value ?? '',
      confidence: conf,
    };
  });

  return {
    id: row.id,
    from: {
      name: row.from_name ?? '',
      email: row.from_email,
      company: row.from_company ?? undefined,
    },
    subject: row.subject ?? '',
    body: row.body ?? '',
    receivedAt: row.received_at,
    parseStatus,
    parsedFields,
    missingFields: row.missing_fields ?? [],
    autoReplyDraft: row.auto_reply_draft ?? undefined,
    status,
  };
}

// ── QUALITY REVIEW ───────────────────────────────────────

export function mapQualityReview(
  row: QualityReviewRow & {
    personnel?: Pick<PersonnelRow, 'full_name'> | null;
    booking?: Pick<BookingRow, 'customer_name' | 'store_name'> | null;
  }
): QualityReview {
  const scores = (row.scores ?? {}) as Record<string, number>;
  const comments = (row.comments ?? {}) as Record<string, string>;
  return {
    id: row.id,
    bookingId: row.booking_id,
    personnelId: row.personnel_id ?? '',
    personnelName: row.personnel?.full_name ?? '',
    customerName: row.booking?.customer_name ?? '',
    storeName: row.booking?.store_name ?? '',
    date: (row.created_at ?? '').slice(0, 10),
    reviewNumber: Number(row.review_number ?? 0),
    scores,
    comments,
    overallComment: row.overall_comment ?? '',
    averageScore: Number(row.average_score ?? 0),
  };
}
