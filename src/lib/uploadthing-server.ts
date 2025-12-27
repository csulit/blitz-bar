import { UploadThingError, createUploadthing } from 'uploadthing/server'
import type { FileRouter } from 'uploadthing/server'
import { auth } from '@/lib/auth'

const f = createUploadthing()

export const uploadRouter = {
  // Identity document uploader for verification
  identityDocument: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
    pdf: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // Verify user is authenticated
      const session = await auth.api.getSession({
        headers: req.headers,
      })

      if (!session?.user) {
        throw new UploadThingError('Unauthorized')
      }

      return { userId: session.user.id }
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('File URL:', file.ufsUrl)

      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl,
        name: file.name,
        size: file.size,
      }
    }),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
