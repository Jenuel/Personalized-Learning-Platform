"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, BookOpen, Clock } from "lucide-react"

interface ReviewPreferenceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectPreference: (preference: "due" | "all") => void
}

export function ReviewPreferenceModal({ open, onOpenChange, onSelectPreference }: ReviewPreferenceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-orange-600" />
            <span>Choose Review Mode</span>
          </DialogTitle>
          <DialogDescription>Select which flashcards you'd like to review in this session.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Due Cards Option */}
          <Card
            className="cursor-pointer transition-all hover:shadow-md hover:border-orange-300 border-2"
            onClick={() => onSelectPreference("due")}
          >
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Due Cards Only</CardTitle>
              <CardDescription>Review cards that are due for study</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-lg font-medium text-orange-600 mb-2">Cards due for review</div>
              <p className="text-sm text-muted-foreground mb-4">Focus on cards that need immediate attention</p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">Review Due Cards</Button>
            </CardContent>
          </Card>

          {/* All Cards Option */}
          <Card
            className="cursor-pointer transition-all hover:shadow-md hover:border-blue-300 border-2"
            onClick={() => onSelectPreference("all")}
          >
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg">All Cards</CardTitle>
              <CardDescription>Review your entire flashcard collection</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-lg font-medium text-blue-600 mb-2">Complete review session</div>
              <p className="text-sm text-muted-foreground mb-4">Practice with all available flashcards</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Review All Cards</Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
