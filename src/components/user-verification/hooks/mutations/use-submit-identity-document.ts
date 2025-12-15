import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { UTApi } from 'uploadthing/server'
import { eq, desc } from 'drizzle-orm'
import { identityDocumentKeys } from '../keys'
import { extractFileKeyFromUrl } from '../../lib/extract-file-key'
import { db } from '@/db'
import { identityDocument } from '@/db/schema'
import type { DocumentType } from '../../types'

interface SubmitIdentityDocumentInput {
  documentType: DocumentType
  frontImageUrl: string
  backImageUrl?: string
}

/**
 * Server function for submitting identity document for verification
 * If user already has a document, deletes old files and replaces with new ones
 */
export const submitIdentityDocument = createServerFn({ method: 'POST' })
  .inputValidator((data: SubmitIdentityDocumentInput) => data)
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

    // If existing document, delete old files from UploadThing
    if (existingDocument) {
      const utapi = new UTApi()
      const filesToDelete: string[] = []

      // Collect old file keys if URLs are different from new ones
      if (
        existingDocument.frontImageUrl &&
        existingDocument.frontImageUrl !== data.frontImageUrl
      ) {
        const key = extractFileKeyFromUrl(existingDocument.frontImageUrl)
        if (key) filesToDelete.push(key)
      }

      if (
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
          // Continue even if deletion fails
        }
      }

      // Update existing document
      const [updatedDocument] = await db
        .update(identityDocument)
        .set({
          documentType: data.documentType,
          frontImageUrl: data.frontImageUrl,
          backImageUrl: data.backImageUrl,
          status: 'pending',
          submittedAt: new Date(),
        })
        .where(eq(identityDocument.id, existingDocument.id))
        .returning()

      return {
        success: true,
        documentId: updatedDocument.id,
      }
    }

    // Create new identity document record
    const [newDocument] = await db
      .insert(identityDocument)
      .values({
        userId,
        documentType: data.documentType,
        frontImageUrl: data.frontImageUrl,
        backImageUrl: data.backImageUrl,
        status: 'pending',
      })
      .returning()

    return {
      success: true,
      documentId: newDocument.id,
    }
  })

/**
 * Hook for submitting identity document for verification
 *
 * @example
 * const { mutate, mutateAsync, isPending } = useSubmitIdentityDocument()
 *
 * // Submit document
 * await mutateAsync({
 *   documentType: 'identity_card',
 *   frontImageUrl: 'https://...',
 *   backImageUrl: 'https://...',
 * })
 */
export function useSubmitIdentityDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SubmitIdentityDocumentInput) =>
      submitIdentityDocument({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: identityDocumentKeys.all })
    },
    onError: (error) => {
      console.error('Failed to submit identity document:', error)
    },
  })
}
