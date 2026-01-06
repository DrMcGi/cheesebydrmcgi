function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  const allowlist = process.env.OWNER_EMAILS;
  if (!allowlist) return false;

  const allowed = allowlist
    .split(',')
    .map(normalizeEmail)
    .filter(Boolean);

  return allowed.includes(normalizeEmail(email));
}
