/**
 * Extract the file key from an UploadThing URL
 * UploadThing URLs follow the pattern: https://utfs.io/f/{fileKey} or https://*.ufs.sh/f/{fileKey}
 */
export function extractFileKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    // Handle both utfs.io and ufs.sh URLs
    const pathParts = urlObj.pathname.split('/')
    // The file key is the last part after /f/
    const fIndex = pathParts.indexOf('f')
    if (fIndex !== -1 && pathParts[fIndex + 1]) {
      return pathParts[fIndex + 1]
    }
    return null
  } catch {
    return null
  }
}
