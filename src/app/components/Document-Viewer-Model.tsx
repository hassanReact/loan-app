"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image" // Import Next.js Image component

interface DocumentViewerModalProps {
  isOpen: boolean
  onClose: () => void
  documentUrl: string | null
}

export function DocumentViewerModal({ isOpen, onClose, documentUrl }: DocumentViewerModalProps) {
  if (!documentUrl) return null

  const isPdf = documentUrl.toLowerCase().endsWith(".pdf")
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(documentUrl)

  const getFileName = (url: string) => {
    try {
      const urlObj = new URL(url)
      const pathSegments = urlObj.pathname.split("/")
      return pathSegments[pathSegments.length - 1]
    } catch {
      // Removed _e as it's not used
      return "Document" // Fallback for invalid URLs
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-lg font-semibold">Viewing: {getFileName(documentUrl)}</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {isPdf ? "PDF Document" : isImage ? "Image File" : "Unknown File Type"}
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="flex-1 overflow-hidden p-4">
          {isPdf ? (
            <iframe src={documentUrl} className="w-full h-full border-0 rounded-md" title="Document Viewer" />
          ) : isImage ? (
            <div className="relative flex items-center justify-center w-full h-full">
              {" "}
              {/* Added relative positioning for Image fill */}
              <Image
                src={documentUrl || "/placeholder.svg"}
                alt={`Document: ${getFileName(documentUrl)}`} // More descriptive alt text
                fill // Use fill to make it responsive within the parent
                style={{ objectFit: "contain" }} // Use style prop for objectFit with fill
                className="rounded-md"
                unoptimized // Use unoptimized for external, dynamic URLs
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600 dark:text-gray-400">
              <p>Cannot display this file type directly. Please download it to view.</p>
              <Button asChild className="ml-4">
                <a href={documentUrl} target="_blank" rel="noopener noreferrer" download>
                  Download Document
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
