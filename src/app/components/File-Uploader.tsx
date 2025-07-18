"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, FileText, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface FileUploaderProps {
  onFilesUploaded: (urls: string[]) => void
  maxFiles?: number
  acceptedFileTypes?: string
  currentFilesCount?: number
  disabled?: boolean
}

export function FileUploader({
  onFilesUploaded,
  maxFiles = 5,
  acceptedFileTypes = "image/*,application/pdf",
  currentFilesCount = 0,
  disabled = false,
}: FileUploaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const [uploading, setUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      const totalFiles = currentFilesCount + newFiles.length
      if (totalFiles > maxFiles) {
        setError(
          `You can only upload a maximum of ${maxFiles} files. You have selected ${newFiles.length} new files, but already have ${currentFilesCount}.`,
        )
        setSelectedFiles([]) // Clear selection if over limit
        if (fileInputRef.current) {
          fileInputRef.current.value = "" // Reset file input
        }
        return
      }
      setSelectedFiles(newFiles)
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select files to upload.")
      return
    }
    setUploading(true)
    setUploadProgress(0)
    setError(null)

    const formData = new FormData()
    selectedFiles.forEach((file) => {
      formData.append("files", file)
    })

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        // No 'Content-Type' header needed for FormData, browser sets it automatically
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "File upload failed.")
      }

      const data = await response.json()
      onFilesUploaded(data.urls)
      setSelectedFiles([]) // Clear selected files after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = "" // Reset file input
      }
      setUploadProgress(100) // Set to 100% on success
    } catch (err: unknown) {
      // Changed 'any' to 'unknown'
      console.error("Upload error:", err)
      if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred during upload.")
      } else {
        setError("An unexpected error occurred during upload.")
      }
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const progressValue = uploading ? uploadProgress : selectedFiles.length > 0 ? 50 : 0 // Simple progress for selection vs upload

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">
          Upload Documents ({currentFilesCount}/{maxFiles} uploaded)
        </Label>
        <Input
          id="file-upload"
          type="file"
          multiple
          accept={acceptedFileTypes}
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={disabled || uploading || currentFilesCount >= maxFiles}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Files:</p>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>{file.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Progress value={progressValue} className="w-full" />
      <Button
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0 || disabled || currentFilesCount >= maxFiles}
        className="w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Selected Documents
          </>
        )}
      </Button>
      {currentFilesCount > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploaded Documents:</p>
          <div className="space-y-2">
            {Array.from({ length: currentFilesCount }).map((_, idx) => (
              <div key={idx} className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-400 truncate">
                  Document {idx + 1} uploaded successfully
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
