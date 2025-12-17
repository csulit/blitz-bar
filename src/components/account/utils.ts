export function formatEducationLevel(level: string) {
  const levels: Record<string, string> = {
    elementary: 'Elementary',
    junior_high: 'Junior High School',
    senior_high: 'Senior High School',
    vocational: 'Vocational/Technical',
    college: 'College/University',
    postgraduate: 'Post-Graduate',
  }
  return levels[level] || level
}
