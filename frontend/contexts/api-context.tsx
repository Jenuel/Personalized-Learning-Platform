"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useNotifications } from "@/components/notification-provider"
import type { Flashcard, ReviewCard } from "@/components/dashboard"

interface FileUploadResponse {
  flashcards: Array<{
    question: string
    cardId: number
    answer: string
  }>
  status: string
}

interface ReviewUpdateRequest {
  card_id: number
  is_correct: boolean
  interval: number
  ease_factor: number
}

interface ReviewUpdateResponse {
  status: string
  message: string
  updated_count: number
}

interface CreateFlashcardRequest {
  question: string
  answer: string
}

interface UpdateFlashcardRequest {
  id: string
  question: string
  answer: string
}

interface ApiContextType {
  // Loading states
  isUploading: boolean
  isUpdatingReview: boolean
  isFetchingCards: boolean
  isCreatingCard: boolean
  isUpdatingCard: boolean
  isDeletingCard: boolean

  // Flashcard CRUD operations
  createFlashcard: (question: string, answer: string) => Promise<Flashcard>
  updateFlashcard: (id: string, question: string, answer: string) => Promise<Flashcard>
  deleteFlashcard: (id: string) => Promise<void>
  fetchFlashcards: () => Promise<Flashcard[]>

  // File and review operations
  uploadFile: (file: File) => Promise<Flashcard[]>
  fetchReviewCards: (type: "due" | "all") => Promise<ReviewCard[]>
  updateReviewResults: (updates: ReviewUpdateRequest[]) => Promise<void>

  // Local answer checking
  checkAnswer: (userAnswer: string, correctAnswer: string) => boolean
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { error, success } = useNotifications()

  // Loading states
  const [isUploading, setIsUploading] = useState(false)
  const [isUpdatingReview, setIsUpdatingReview] = useState(false)
  const [isFetchingCards, setIsFetchingCards] = useState(false)
  const [isCreatingCard, setIsCreatingCard] = useState(false)
  const [isUpdatingCard, setIsUpdatingCard] = useState(false)
  const [isDeletingCard, setIsDeletingCard] = useState(false)

  // Local answer checking function
  const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
    if (!userAnswer || !correctAnswer) return false

    const normalizeText = (text: string) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, "") // Remove punctuation
        .replace(/\s+/g, " ") // Normalize whitespace
    }

    const normalizedUserAnswer = normalizeText(userAnswer)
    const normalizedCorrectAnswer = normalizeText(correctAnswer)

    // Exact match
    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      return true
    }

    // Check if user answer contains the correct answer or vice versa
    if (
      normalizedUserAnswer.includes(normalizedCorrectAnswer) ||
      normalizedCorrectAnswer.includes(normalizedUserAnswer)
    ) {
      return true
    }

    // Check for word-by-word match (at least 70% of words match)
    const userWords = normalizedUserAnswer.split(" ").filter((word) => word.length > 2)
    const correctWords = normalizedCorrectAnswer.split(" ").filter((word) => word.length > 2)

    if (userWords.length === 0 || correctWords.length === 0) {
      return false
    }

    const matchingWords = userWords.filter((word) =>
      correctWords.some((correctWord) => correctWord.includes(word) || word.includes(correctWord)),
    )

    const matchPercentage = matchingWords.length / Math.max(userWords.length, correctWords.length)
    return matchPercentage >= 0.7
  }

  // Flashcard CRUD operations
  const createFlashcard = async (question: string, answer: string): Promise<Flashcard> => {
    setIsCreatingCard(true)

    try {
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, answer }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const flashcard: Flashcard = await response.json()
      success("Success", "Flashcard created successfully")
      return flashcard
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create flashcard"
      error("Error", errorMessage)
      throw err
    } finally {
      setIsCreatingCard(false)
    }
  }

  const updateFlashcard = async (id: string, question: string, answer: string): Promise<Flashcard> => {
    setIsUpdatingCard(true)

    try {
      const response = await fetch(`/api/flashcards/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, answer }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const flashcard: Flashcard = await response.json()
      success("Success", "Flashcard updated successfully")
      return flashcard
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update flashcard"
      error("Error", errorMessage)
      throw err
    } finally {
      setIsUpdatingCard(false)
    }
  }

  const deleteFlashcard = async (id: string): Promise<void> => {
    setIsDeletingCard(true)

    try {
      const response = await fetch(`/api/flashcards/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      success("Success", "Flashcard deleted successfully")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete flashcard"
      error("Error", errorMessage)
      throw err
    } finally {
      setIsDeletingCard(false)
    }
  }

  const fetchFlashcards = async (): Promise<Flashcard[]> => {
    setIsFetchingCards(true)

    try {
      const response = await fetch("/api/flashcards")

      if (!response.ok) {
        throw new Error("Failed to fetch flashcards")
      }

      const flashcards: Flashcard[] = await response.json()
      return flashcards
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load flashcards"
      error("Error", errorMessage)
      throw err
    } finally {
      setIsFetchingCards(false)
    }
  }

  const uploadFile = async (file: File): Promise<Flashcard[]> => {
    setIsUploading(true)

    try {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "text/plain",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ]

      if (!allowedTypes.includes(file.type)) {
        throw new Error("Invalid file type. Please upload PDF, TXT, or DOCX files.")
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB in bytes
      if (file.size > maxSize) {
        throw new Error("File too large. Maximum size is 10MB.")
      }

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("file", file)

      // Make API call
      const response = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data: FileUploadResponse = await response.json()

      if (data.status !== "success" || !data.flashcards) {
        throw new Error("Invalid response format or failed status")
      }

      // Transform API response to match our Flashcard interface
      const transformedFlashcards: Flashcard[] = data.flashcards.map((card) => ({
        id: card.cardId.toString(),
        question: card.question,
        answer: card.answer,
      }))

      return transformedFlashcards
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      error("Upload Failed", errorMessage)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  const fetchReviewCards = async (type: "due" | "all"): Promise<ReviewCard[]> => {
    setIsFetchingCards(true)

    try {
      const response = await fetch(`/api/review/cards?type=${type}`)

      if (!response.ok) {
        throw new Error("Failed to fetch flashcards")
      }

      const cards: ReviewCard[] = await response.json()
      return cards
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load flashcards for review"
      error("Error", errorMessage)
      throw err
    } finally {
      setIsFetchingCards(false)
    }
  }

  const updateReviewResults = async (updates: ReviewUpdateRequest[]): Promise<void> => {
    setIsUpdatingReview(true)

    try {
      const response = await fetch("/api/review/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      })

      if (!response.ok) {
        throw new Error("Failed to update flashcards")
      }

      const result: ReviewUpdateResponse = await response.json()

      if (result.status !== "success") {
        throw new Error(result.message || "Failed to update review results")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save review results"
      error("Error", errorMessage)
      throw err
    } finally {
      setIsUpdatingReview(false)
    }
  }

  const contextValue: ApiContextType = {
    // Loading states
    isUploading,
    isUpdatingReview,
    isFetchingCards,
    isCreatingCard,
    isUpdatingCard,
    isDeletingCard,

    // Flashcard CRUD operations
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    fetchFlashcards,

    // File and review operations
    uploadFile,
    fetchReviewCards,
    updateReviewResults,

    // Local answer checking
    checkAnswer,
  }

  return <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
}

export function useApi() {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider")
  }
  return context
}
