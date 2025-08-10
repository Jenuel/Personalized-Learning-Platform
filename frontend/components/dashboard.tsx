"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useApi } from "@/contexts/api-context"
import { FlashcardGrid } from "@/components/flashcard-grid"
import { LogOut, Plus, Upload, BookOpen, Brain, Loader2 } from "lucide-react"
import { useNotifications } from "@/components/notification-provider"
import { AddFlashcardModal } from "@/components/add-flashcard-modal"
import { FileUploadModal } from "@/components/file-upload-modal"
import { ReviewPreferenceModal } from "@/components/review-preference-modal"
import { ReviewSession } from "@/components/review-session"

export interface Flashcard {
  id: string
  question: string
  answer: string
}

export interface ReviewCard {
  cardId: number
  question: string
  answer: string
  interval: number
  next_review: string
  ease_factor: number
}

export function Dashboard() {
  const { user, logout } = useAuth()
  const { error } = useNotifications()
  const {
    fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    fetchReviewCards,
    updateReviewResults,
    isFetchingCards,
    isCreatingCard,
    isUpdatingCard,
    isDeletingCard,
  } = useApi()

  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [showReviewPreference, setShowReviewPreference] = useState(false)
  const [reviewMode, setReviewMode] = useState(false)
  const [reviewCards, setReviewCards] = useState<ReviewCard[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    loadFlashcards()
  }, [])

  const loadFlashcards = async () => {
    try {
      const cards = await fetchFlashcards()
      setFlashcards(cards)
    } catch (err) {
      // Error is already handled in the API context
      console.error("Error loading flashcards:", err)
    } finally {
      setIsInitialLoading(false)
    }
  }

  const handleAddFlashcard = async (question: string, answer: string) => {
    try {
      const newFlashcard = await createFlashcard(question, answer)
      setFlashcards((prev) => [...prev, newFlashcard])
      setShowAddModal(false)
    } catch (err) {
      console.error("Error adding flashcard:", err)
    }
  }

  const handleUpdateFlashcard = async (id: string, question: string, answer: string) => {
    try {
      const updatedFlashcard = await updateFlashcard(id, question, answer)
      setFlashcards((prev) => prev.map((card) => (card.id === id ? updatedFlashcard : card)))
    } catch (err) {
      console.error("Error updating flashcard:", err)
    }
  }

  const handleDeleteFlashcard = async (id: string) => {
    try {
      await deleteFlashcard(id)
      setFlashcards((prev) => prev.filter((card) => card.id !== id))
    } catch (err) {
      console.error("Error deleting flashcard:", err)
    }
  }

  const handleFileUploadComplete = (newFlashcards: Flashcard[]) => {
    setFlashcards((prev) => [...prev, ...newFlashcards])
    setShowFileUpload(false)
  }

  const handleReviewPreference = async (preference: "due" | "all") => {
    try {
      setShowReviewPreference(false)

      const cards = await fetchReviewCards(preference)

      if (cards.length === 0) {
        error(
          "No cards to review",
          preference === "due" ? "You have no cards due for review" : "You have no flashcards to review",
        )
        return
      }

      // Shuffle the cards for variety
      const shuffledCards = [...cards].sort(() => Math.random() - 0.5)
      setReviewCards(shuffledCards)
      setReviewMode(true)
    } catch (err) {
      // Error is already handled in the API context
      console.error("Error in handleReviewPreference:", err)
    }
  }

  const handleReviewComplete = async (reviewResults: Array<{ cardId: number; isCorrect: boolean }>) => {
    try {
      // Prepare updates in the format expected by the review service
      const updates = reviewResults.map((result) => {
        const originalCard = reviewCards.find((card) => card.cardId === result.cardId)
        if (!originalCard) {
          throw new Error(`Card with ID ${result.cardId} not found`)
        }

        // Simple spaced repetition logic
        let newInterval = originalCard.interval
        let newEaseFactor = originalCard.ease_factor

        if (result.isCorrect) {
          newInterval = Math.max(1, originalCard.interval + 1)
          newEaseFactor = Math.min(3.0, originalCard.ease_factor + 0.1)
        } else {
          newInterval = 1
          newEaseFactor = Math.max(1.3, originalCard.ease_factor - 0.2)
        }

        return {
          card_id: result.cardId,
          is_correct: result.isCorrect,
          interval: newInterval,
          ease_factor: newEaseFactor,
        }
      })

      await updateReviewResults(updates)

      setReviewMode(false)
      setReviewCards([])
    } catch (err) {
      // Error is already handled in the API context
      console.error("Error in handleReviewComplete:", err)
    }
  }

  const handleReviewCancel = () => {
    setReviewMode(false)
    setReviewCards([])
  }

  if (reviewMode) {
    return <ReviewSession cards={reviewCards} onComplete={handleReviewComplete} onCancel={handleReviewCancel} />
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Loading your flashcards...</h2>
            <p className="text-muted-foreground">Please wait while we fetch your study materials.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Learning Platform</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{flashcards.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={() => setShowAddModal(true)} disabled={isCreatingCard}>
            {isCreatingCard ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Flashcard
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => setShowFileUpload(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
          <Button
            onClick={() => setShowReviewPreference(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white"
            disabled={isFetchingCards}
          >
            <Brain className="h-4 w-4 mr-2" />
            {isFetchingCards ? "Loading..." : "Review Cards"}
          </Button>
        </div>

        {/* Flashcards Grid */}
        <FlashcardGrid
          flashcards={flashcards}
          onUpdate={handleUpdateFlashcard}
          onDelete={handleDeleteFlashcard}
          isUpdating={isUpdatingCard}
          isDeleting={isDeletingCard}
        />
        <AddFlashcardModal open={showAddModal} onOpenChange={setShowAddModal} onAdd={handleAddFlashcard} />
        <FileUploadModal open={showFileUpload} onOpenChange={setShowFileUpload} onComplete={handleFileUploadComplete} />
        <ReviewPreferenceModal
          open={showReviewPreference}
          onOpenChange={setShowReviewPreference}
          onSelectPreference={handleReviewPreference}
        />
      </div>
    </div>
  )
}
