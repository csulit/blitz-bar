import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { UTApi } from 'uploadthing/server'
import { eq, and } from 'drizzle-orm'
import { identityDocumentKeys } from '../keys'
import { extractFileKeyFromUrl } from '../../lib/extract-file-key'
import { db } from '@/db'
import { identityDocument } from '@/db/schema'

interface DeleteIdentityFileInput {
  fileType: 'front' | 'back'
  documentId?: string
}

/**
 * Server function for deleting an identity document file
 * Removes the file from UploadThing and updates the database record
 */
export const deleteIdentityFile = createServerFn({ method: 'POST' })
  .inputValidator((data: DeleteIdentityFileInput) => data)
  .handler(async ({ data }) => {
    const request = getRequest()
    const { auth } = await import('@/lib/auth')

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    const userId = session.user.id

    // Find the user's identity document
    const document = data.documentId
      ? await db.query.identityDocument.findFirst({
          where: and(
            eq(identityDocument.id, data.documentId),
            eq(identityDocument.userId, userId),
          ),
        })
      : await db.query.identityDocument.findFirst({
          where: eq(identityDocument.userId, userId),
          orderBy: (doc, { desc }) => [desc(doc.createdAt)],
        })

    if (!document) {
      return { success: true, message: 'No document to delete' }
    }

    const utapi = new UTApi()
    const urlToDelete =
      data.fileType === 'front' ? document.frontImageUrl : document.backImageUrl

    if (urlToDelete) {
      const fileKey = extractFileKeyFromUrl(urlToDelete)
      if (fileKey) {
        try {
          await utapi.deleteFiles(fileKey)
        } catch (error) {
          console.error('Failed to delete file from UploadThing:', error)
          // Continue even if file deletion fails (file might already be deleted)
        }
      }
    }

    // Update the database record to clear the URL
    if (data.fileType === 'front') {
      // If deleting front image, delete the entire document
      await db
        .delete(identityDocument)
        .where(eq(identityDocument.id, document.id))
    } else {
      // If deleting back image, just clear that field
      await db
        .update(identityDocument)
        .set({ backImageUrl: null })
        .where(eq(identityDocument.id, document.id))
    }

    return { success: true }
  })

/**
 * Hook for deleting an identity document file
 *
 * @example
 * const { mutateAsync: deleteFile, isPending } = useDeleteIdentityFile()
 *
 * // Delete front image (removes entire document)
 * await deleteFile({ fileType: 'front' })
 *
 * // Delete back image only
 * await deleteFile({ fileType: 'back' })
 */
export function useDeleteIdentityFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: DeleteIdentityFileInput) =>
      deleteIdentityFile({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: identityDocumentKeys.all })
    },
    onError: (error) => {
      console.error('Failed to delete identity file:', error)
    },
  })
}
