"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useApi } from "@/contexts/api-context"
import type { Flashcard } from "@/components/dashboard"
import { Upload, FileText, Loader2, CheckCircle, X } from "lucide-react"

interface FileUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (flashcards: Flashcard[]) => void
}

type UploadState = "idle" | "processing" | "complete" | "error"

export function FileUploadModal({ open, onOpenChange, onComplete }: FileUploadModalProps) {
  const { uploadFile, isUploading } = useApi()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [generatedCount, setGeneratedCount] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
      setUploadState("idle")
      setErrorMessage("")
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      setSelectedFile(files[0])
      setUploadState("idle")
      setErrorMessage("")
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || isUploading) return

    try {
      setUploadState("processing")
      setErrorMessage("")

      const flashcards = await uploadFile(selectedFile)

      setGeneratedCount(flashcards.length)
      setUploadState("complete")

      // Show success state briefly before completing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      onComplete(flashcards)
      handleClose()
    } catch (error) {
      console.error("Error processing file:", error)
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred")
      setUploadState("error")
    }
  }

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null)
      setUploadState("idle")
      setGeneratedCount(0)
      setIsDragOver(false)
      setErrorMessage("")
      onOpenChange(false)
    }
  }

  const handleRemoveFile = () => {
    if (uploadState === "idle") {
      setSelectedFile(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a document to automatically generate flashcards. Supports PDF, TXT, and DOCX files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Selection Area */}
          {!selectedFile ? (
            <Card
              className={`border-2 border-dashed transition-colors cursor-pointer ${
                isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">Drop your file here or click to browse</p>
                  <p className="text-sm text-muted-foreground">Supports PDF, TXT, DOCX files (max 10MB)</p>
                </div>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.txt,.docx,.doc"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
              </CardContent>
            </Card>
          ) : (
            /* Selected File Display */
            <Card>
              <CardContent className="flex items-center space-x-4 py-4">
                <FileText className="h-10 w-10 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {uploadState === "idle" && (
                  <Button size="sm" variant="outline" onClick={handleRemoveFile}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Processing State */}
          {isUploading && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="py-8">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                  <div className="text-center">
                    <p className="font-medium text-blue-900 text-lg">Processing your file...</p>
                    <p className="text-sm text-blue-700 mt-2">
                      Our AI is analyzing the content and generating flashcards
                    </p>
                    <div className="flex justify-center space-x-1 mt-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success State */}
          {uploadState === "complete" && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="py-6">
                <div className="flex items-center justify-center space-x-3">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                  <div className="text-center">
                    <p className="font-medium text-green-900 text-lg">
                      Successfully generated {generatedCount} flashcards!
                    </p>
                    <p className="text-sm text-green-700 mt-1">Flashcards will be added to your collection</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {uploadState === "error" && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="py-6">
                <div className="flex items-center justify-center space-x-3">
                  <X className="h-10 w-10 text-red-600" />
                  <div className="text-center">
                    <p className="font-medium text-red-900 text-lg">Upload Failed</p>
                    <p className="text-sm text-red-700 mt-1">{errorMessage || "An error occurred during processing"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            {uploadState === "complete" ? "Close" : "Cancel"}
          </Button>
          {selectedFile && uploadState === "idle" && (
            <Button onClick={handleUpload} disabled={isUploading}>
              <Upload className="mr-2 h-4 w-4" />
              Generate Flashcards
            </Button>
          )}
          {uploadState === "error" && (
            <Button onClick={() => setUploadState("idle")} variant="outline">
              Try Again
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
