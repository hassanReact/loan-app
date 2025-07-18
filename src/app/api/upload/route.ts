import { NextResponse } from "next/server"
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary" // Import UploadApiResponse type

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "No files uploaded." }, { status: 400 })
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Upload to Cloudinary
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "loan_documents", // Optional: specify a folder in Cloudinary
              resource_type: "auto", // Automatically detect file type
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error)
                return reject(error)
              }
              if (!result) {
                return reject(new Error("Cloudinary upload did not return a result."))
              }
              resolve(result)
            },
          )
          .end(buffer)
      })

      if (result && result.secure_url) {
        uploadedUrls.push(result.secure_url)
      } else {
        console.error("Cloudinary upload did not return a secure_url:", result)
        return NextResponse.json(
          { success: false, message: "Failed to get secure URL from Cloudinary." },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({ success: true, urls: uploadedUrls }, { status: 200 })
  } catch (error) {
    console.error("File upload API error:", error)
    return NextResponse.json({ success: false, message: "Failed to upload files." }, { status: 500 })
  }
}