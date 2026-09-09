"use client"

import { FlashcardCard } from "@/components/flashcard-card"
import type { Flashcard } from "@/components/dashboard"

interface FlashcardGridProps {
  flashcards: Flashcard[]
  onUpdate: (id: string, question: string, answer: string) => void
  onDelete: (id: string) => void
  isUpdating?: boolean
  isDeleting?: boolean
}

export function FlashcardGrid({ flashcards, onUpdate, onDelete, isUpdating, isDeleting }: FlashcardGridProps) {
  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg">No flashcards yet</div>
        <div className="text-sm text-muted-foreground mt-2">
          Add your first flashcard or upload a file to get started
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashcards.map((flashcard) => (
        <FlashcardCard
          key={flashcard.id}
          flashcard={flashcard}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  )
}
