"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useApi } from "@/contexts/api-context"
import type { ReviewCard } from "@/components/dashboard"
import { ArrowLeft, CheckCircle, X, Loader2 } from "lucide-react"

interface ReviewSessionProps {
  cards: ReviewCard[]
  onComplete: (results: Array<{ cardId: number; isCorrect: boolean }>) => void
  onCancel: () => void
}

type FeedbackState = "none" | "correct" | "incorrect"

export function ReviewSession({ cards, onComplete, onCancel }: ReviewSessionProps) {
  const { checkAnswer, isUpdatingReview } = useApi()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [reviewResults, setReviewResults] = useState<Array<{ cardId: number; isCorrect: boolean }>>([])
  const [feedback, setFeedback] = useState<FeedbackState>("none")
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false)

  const currentCard = cards[currentIndex]
  const progress = ((currentIndex + 1) / cards.length) * 100
  const isLastCard = currentIndex === cards.length - 1

  const handleCheckAnswer = async () => {
    if (!userAnswer.trim()) return

    setIsCheckingAnswer(true)

    try {
      // Use local answer checking
      const isCorrect = checkAnswer(userAnswer.trim(), currentCard.answer)

      // Store the result
      const reviewResult = { cardId: currentCard.cardId, isCorrect }
      setReviewResults((prev) => [...prev, reviewResult])

      // Show feedback
      setFeedback(isCorrect ? "correct" : "incorrect")

      // Auto-advance after showing feedback
      setTimeout(() => {
        if (isLastCard) {
          handleCompleteReview([...reviewResults, reviewResult])
        } else {
          // Move to next card
          setCurrentIndex((prev) => prev + 1)
          setUserAnswer("")
          setFeedback("none")
        }
      }, 2000)
    } catch (error) {
      console.error("Error checking answer:", error)
      setFeedback("incorrect")
    } finally {
      setIsCheckingAnswer(false)
    }
  }

  const handleCompleteReview = async (finalResults: Array<{ cardId: number; isCorrect: boolean }>) => {
    try {
      await onComplete(finalResults)
    } catch (error) {
      console.error("Error completing review:", error)
    }
  }

  // Show loading state when completing review
  if (isUpdatingReview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Saving your progress...</h2>
            <p className="text-muted-foreground">Please wait while we update your review results.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onCancel} disabled={isCheckingAnswer}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Review Session</h1>
            <p className="text-sm text-gray-600">
              Card {currentIndex + 1} of {cards.length}
            </p>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
            </div>
            <Progress value={progress} className="w-full" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Question</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium leading-relaxed mb-4">{currentCard.question}</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-sm font-medium mb-2">
                  Your Answer:
                </label>
                <Textarea
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={4}
                  className="w-full"
                  disabled={isCheckingAnswer || feedback !== "none"}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Card */}
        {feedback !== "none" && (
          <Card
            className={`mb-6 ${feedback === "correct" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <CardContent className="py-6">
              <div className="flex items-center justify-center space-x-3">
                {feedback === "correct" ? (
                  <CheckCircle className="h-10 w-10 text-green-600" />
                ) : (
                  <X className="h-10 w-10 text-red-600" />
                )}
                <div className="text-center">
                  <p className={`font-medium text-lg ${feedback === "correct" ? "text-green-900" : "text-red-900"}`}>
                    {feedback === "correct" ? "Correct!" : "Incorrect"}
                  </p>
                  {feedback === "incorrect" && (
                    <div className="mt-2">
                      <p className="text-sm text-red-700 mb-1">Correct answer:</p>
                      <p className="font-medium text-red-900">{currentCard.answer}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {feedback === "none" && (
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleCheckAnswer}
              disabled={!userAnswer.trim() || isCheckingAnswer}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isCheckingAnswer ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                "Submit Answer"
              )}
            </Button>
          </div>
        )}

        {/* Review Stats */}
        <Card className="mt-6">
          <CardContent className="py-4">
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {reviewResults.filter((r) => r.isCorrect).length}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {reviewResults.filter((r) => !r.isCorrect).length}
                </div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{cards.length - currentIndex - 1}</div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
