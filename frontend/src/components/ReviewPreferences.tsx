
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BookOpen, Clock, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface ReviewPreferencesProps {
  totalCards: number;
  dueCards: number;
  onStartReview: (reviewType: 'all' | 'due') => void;
  onBack: () => void;
}

const ReviewPreferences = ({ totalCards, dueCards, onStartReview, onBack }: ReviewPreferencesProps) => {
  const [reviewType, setReviewType] = useState<'all' | 'due'>('due');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Review Session
            </CardTitle>
            <p className="text-gray-600">Choose which cards to review</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={reviewType} onValueChange={(value) => setReviewType(value as 'all' | 'due')}>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="due" id="due" />
                  <Label htmlFor="due" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">Due Cards Only</span>
                      </div>
                      <span className="text-sm text-gray-500 bg-orange-100 px-2 py-1 rounded">
                        {dueCards} cards
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Review cards that haven't been studied yet</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">All Cards</span>
                      </div>
                      <span className="text-sm text-gray-500 bg-blue-100 px-2 py-1 rounded">
                        {totalCards} cards
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Review all cards in your collection</p>
                  </Label>
                </div>
              </div>
            </RadioGroup>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => onStartReview(reviewType)}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                disabled={(reviewType === 'due' && dueCards === 0) || (reviewType === 'all' && totalCards === 0)}
              >
                Start Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewPreferences;
