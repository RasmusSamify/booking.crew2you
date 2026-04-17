// ═══════════════════════════════════════════════════════════
// Thin re-export shim for backward compatibility.
// Canonical types/data are now in ./fallback-data.
// ═══════════════════════════════════════════════════════════

export * from './fallback-data';

export {
  FALLBACK_BOKNINGAR as MOCK_BOKNINGAR,
  FALLBACK_PERSONAL as MOCK_PERSONAL,
  FALLBACK_KUNDER as MOCK_KUNDER,
  FALLBACK_BUTIKER as MOCK_BUTIKER,
  FALLBACK_UTLAGG as MOCK_UTLAGG,
  FALLBACK_PERSONAL_EXPENSES as MOCK_PERSONAL_EXPENSES,
  FALLBACK_INVOICES as MOCK_INVOICES,
} from './fallback-data';
