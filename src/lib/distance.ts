export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function estimatedDrivingKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  return Math.round(haversineKm(lat1, lng1, lat2, lng2) * 1.35);
}

export function estimatedRoundtripKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  return estimatedDrivingKm(lat1, lng1, lat2, lng2) * 2;
}

export type MileageVerdict = 'ok' | 'warning' | 'suspicious';

export interface MileageVerification {
  verdict: MileageVerdict;
  expectedKm: number;
  deviationPercent: number;
  message: string;
}

export function verifyMileage(
  reportedKm: number,
  personnelLat: number,
  personnelLng: number,
  storeLat: number,
  storeLng: number,
  isRoundtrip: boolean = true
): MileageVerification {
  const oneWay = estimatedDrivingKm(personnelLat, personnelLng, storeLat, storeLng);
  const expectedKm = isRoundtrip ? oneWay * 2 : oneWay;
  const absDeviation = Math.abs(reportedKm - expectedKm);
  const deviationPercent = expectedKm > 0 ? Math.round((absDeviation / expectedKm) * 100) : 0;

  // Absolut avvikelse under 5 km: alltid OK
  if (absDeviation < 5) {
    return {
      verdict: 'ok',
      expectedKm,
      deviationPercent,
      message: `Stämmer — ${reportedKm} km rapporterat, ~${expectedKm} km beräknat`,
    };
  }

  if (deviationPercent <= 20) {
    return {
      verdict: 'ok',
      expectedKm,
      deviationPercent,
      message: `Stämmer — ${reportedKm} km rapporterat, ~${expectedKm} km beräknat (${deviationPercent}% avvikelse)`,
    };
  }
  if (deviationPercent <= 50) {
    return {
      verdict: 'warning',
      expectedKm,
      deviationPercent,
      message: `Avviker — ${reportedKm} km rapporterat vs ~${expectedKm} km beräknat (${deviationPercent}% avvikelse). Kan bero på omväg eller flera stopp.`,
    };
  }
  return {
    verdict: 'suspicious',
    expectedKm,
    deviationPercent,
    message: `Misstänkt — ${reportedKm} km rapporterat vs ~${expectedKm} km beräknat (${deviationPercent}% avvikelse).`,
  };
}
