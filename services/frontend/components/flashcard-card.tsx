"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Flashcard } from "@/components/dashboard"
import { Edit, Trash2, Save, X, RotateCcw, Loader2 } from "lucide-react"

interface FlashcardCardProps {
  flashcard: Flashcard
  onUpdate: (id: string, question: string, answer: string) => void
  onDelete: (id: string) => void
  isUpdating?: boolean
  isDeleting?: boolean
}

export function FlashcardCard({ flashcard, onUpdate, onDelete, isUpdating, isDeleting }: FlashcardCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [editQuestion, setEditQuestion] = useState(flashcard.question)
  const [editAnswer, setEditAnswer] = useState(flashcard.answer)

  const handleSave = () => {
    if (editQuestion.trim() && editAnswer.trim()) {
      onUpdate(flashcard.id, editQuestion.trim(), editAnswer.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditQuestion(flashcard.question)
    setEditAnswer(flashcard.answer)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(flashcard.id)
  }

  if (isEditing) {
    return (
      <Card className="h-64">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSave} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} disabled={isUpdating}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Question:</label>
            <Input
              value={editQuestion}
              onChange={(e) => setEditQuestion(e.target.value)}
              placeholder="Enter question"
              disabled={isUpdating}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Answer:</label>
            <Textarea
              value={editAnswer}
              onChange={(e) => setEditAnswer(e.target.value)}
              placeholder="Enter answer"
              rows={3}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`h-64 cursor-pointer transition-all duration-300 ${isFlipped ? "bg-blue-50" : ""} ${
        isDeleting ? "opacity-50" : ""
      }`}
      onClick={() => !isDeleting && setIsFlipped(!isFlipped)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-end items-center">
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsFlipped(!isFlipped)}
              disabled={isDeleting || isUpdating}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} disabled={isDeleting || isUpdating}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleDelete} disabled={isDeleting || isUpdating}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">{isFlipped ? "Answer:" : "Question:"}</div>
          <div className="text-lg font-medium">{isFlipped ? flashcard.answer : flashcard.question}</div>
        </div>
      </CardContent>
    </Card>
  )
}
