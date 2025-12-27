import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { UTApi } from 'uploadthing/server'
import { desc, eq } from 'drizzle-orm'
import { identityDocumentKeys } from '../keys'
import { extractFileKeyFromUrl } from '../../lib/extract-file-key'
import type { DocumentType } from '../../types'
import { db } from '@/db'
import { identityDocument } from '@/db/schema'

interface SaveIdentityDocumentInput {
  documentType: DocumentType
  frontImageUrl?: string
  backImageUrl?: string
}

/**
 * Server function for saving/updating identity document draft
 * Called automatically when files are uploaded to persist progress
 * Deletes old files from UploadThing when replaced with new ones
 */
export const saveIdentityDocument = createServerFn({ method: 'POST' })
  .inputValidator((data: SaveIdentityDocumentInput) => data)
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

    // Check if user already has an identity document
    const existingDocument = await db.query.identityDocument.findFirst({
      where: eq(identityDocument.userId, userId),
      orderBy: [desc(identityDocument.createdAt)],
    })

    if (existingDocument) {
      const utapi = new UTApi()
      const filesToDelete: Array<string> = []

      // Delete old front image if being replaced
      if (
        data.frontImageUrl &&
        existingDocument.frontImageUrl &&
        existingDocument.frontImageUrl !== data.frontImageUrl
      ) {
        const key = extractFileKeyFromUrl(existingDocument.frontImageUrl)
        if (key) filesToDelete.push(key)
      }

      // Delete old back image if being replaced
      if (
        data.backImageUrl &&
        existingDocument.backImageUrl &&
        existingDocument.backImageUrl !== data.backImageUrl
      ) {
        const key = extractFileKeyFromUrl(existingDocument.backImageUrl)
        if (key) filesToDelete.push(key)
      }

      // Delete old files from UploadThing
      if (filesToDelete.length > 0) {
        try {
          await utapi.deleteFiles(filesToDelete)
        } catch (error) {
          console.error('Failed to delete old files from UploadThing:', error)
        }
      }

      // Update existing document - only update provided fields
      const updateData: Partial<{
        documentType: string
        frontImageUrl: string
        backImageUrl: string | null
      }> = {
        documentType: data.documentType,
      }

      if (data.frontImageUrl !== undefined) {
        updateData.frontImageUrl = data.frontImageUrl
      }
      if (data.backImageUrl !== undefined) {
        updateData.backImageUrl = data.backImageUrl
      }

      const [updatedDocument] = await db
        .update(identityDocument)
        .set(updateData)
        .where(eq(identityDocument.id, existingDocument.id))
        .returning()

      return {
        success: true,
        documentId: updatedDocument.id,
        isNew: false,
      }
    }

    // Create new identity document record
    const [newDocument] = await db
      .insert(identityDocument)
      .values({
        userId,
        documentType: data.documentType,
        frontImageUrl: data.frontImageUrl ?? '',
        backImageUrl: data.backImageUrl,
        status: 'pending',
      })
      .returning()

    return {
      success: true,
      documentId: newDocument.id,
      isNew: true,
    }
  })

/**
 * Hook for auto-saving identity document when files are uploaded
 * This saves progress to the database so it persists across page reloads
 *
 * @example
 * const { mutate: saveDocument } = useSaveIdentityDocument()
 *
 * // Save when front file uploads
 * saveDocument({
 *   documentType: 'identity_card',
 *   frontImageUrl: 'https://...',
 * })
 */
export function useSaveIdentityDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SaveIdentityDocumentInput) =>
      saveIdentityDocument({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: identityDocumentKeys.all })
    },
    onError: (error) => {
      console.error('Failed to save identity document:', error)
    },
  })
}
