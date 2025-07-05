
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { RotateCcw, Check, X, Shuffle, Home, Send } from "lucide-react";
import { FlashCard } from "@/pages/Index";
import ReviewPreferences from "./ReviewPreferences";

interface ReviewModeProps {
  cards: FlashCard[];
  onMarkReviewed: (id: string) => void;
  onExit: () => void;
}

const ReviewMode = ({ cards, onMarkReviewed, onExit }: ReviewModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [reviewedCards, setReviewedCards] = useState<string[]>([]);
  const [shuffledCards, setShuffledCards] = useState<FlashCard[]>([]);
  const [showPreferences, setShowPreferences] = useState(true);
  const [reviewType, setReviewType] = useState<'all' | 'due'>('due');
  const [isComplete, setIsComplete] = useState(false);

  const dueCards = cards.filter(card => !card.lastReviewed);

  const startReview = (type: 'all' | 'due') => {
    setReviewType(type);
    const cardsToReview = type === 'due' ? dueCards : cards;
    const shuffled = [...cardsToReview].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setUserAnswer("");
    setFeedback(null);
    setReviewedCards([]);
    setIsComplete(false);
    setShowPreferences(false);
  };

  const currentCard = shuffledCards[currentIndex];
  const progress = shuffledCards.length > 0 ? ((currentIndex + 1) / shuffledCards.length) * 100 : 0;

  const handleSubmit = () => {
    if (!currentCard || !userAnswer.trim()) return;

    const isCorrect = userAnswer.trim().toLowerCase() === currentCard.back.toLowerCase();
    
    if (isCorrect) {
      setFeedback({
        isCorrect: true,
        message: "Correct! Well done!"
      });
      onMarkReviewed(currentCard.id);
      setReviewedCards([...reviewedCards, currentCard.id]);
    } else {
      setFeedback({
        isCorrect: false,
        message: `Incorrect. The correct answer is: ${currentCard.back}`
      });
    }

    // Auto-advance to next card after 2 seconds
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  const handleNext = () => {
    setUserAnswer("");
    setFeedback(null);
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Review complete
      setIsComplete(true);
      // Send updates to backend here
      console.log('Review session completed. Sending updates to backend...');
      // TODO: Send review data to backend
    }
  };

  const shuffleCards = () => {
    const shuffled = [...shuffledCards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setUserAnswer("");
    setFeedback(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !feedback) {
      handleSubmit();
    }
  };

  if (showPreferences) {
    return (
      <ReviewPreferences
        totalCards={cards.length}
        dueCards={dueCards.length}
        onStartReview={startReview}
        onBack={onExit}
      />
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-md text-center">
          <Card className="w-full">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Complete!</h2>
              <p className="text-gray-600 mb-6">
                You've reviewed {shuffledCards.length} card{shuffledCards.length !== 1 ? 's' : ''}
              </p>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                <p className="text-green-700 font-medium">
                  ✅ {reviewedCards.length} cards answered correctly
                </p>
              </div>
              <Button
                onClick={onExit}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Home className="h-5 w-5 mr-2" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (shuffledCards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-md text-center">
          <Card className="w-full">
            <CardContent className="p-8">
              <div className="text-gray-400 mb-4 text-lg">No cards available for review</div>
              <div className="text-gray-500 mb-6">Add some cards first to start reviewing!</div>
              <Button onClick={onExit} variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Card {currentIndex + 1} of {shuffledCards.length}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={shuffleCards}
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Shuffle
              </Button>
              <Button
                onClick={onExit}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Home className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>

          <Progress value={progress} className="w-full h-2" />

          <Card className="h-96">
            <CardContent className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
              <div className="text-center space-y-6 w-full max-w-lg">
                <div className="text-sm font-medium text-purple-600 mb-2">QUESTION</div>
                <div className="text-xl font-semibold text-gray-800 leading-relaxed mb-6">
                  {currentCard?.front}
                </div>
                
                <div className="w-full space-y-4">
                  <Input
                    type="text"
                    placeholder="Type your answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!!feedback}
                    className="text-center text-lg py-3 px-4 border-2 border-purple-200 focus:border-purple-400 rounded-lg shadow-sm"
                  />
                  
                  {!feedback && (
                    <Button
                      onClick={handleSubmit}
                      disabled={!userAnswer.trim()}
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-3 text-lg"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Submit Answer
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {feedback && (
            <Card className={`animate-in fade-in duration-300 ${feedback.isCorrect ? 'border-green-300' : 'border-red-300'}`}>
              <CardContent className={`p-6 text-center ${feedback.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className={`flex items-center justify-center gap-2 mb-2 ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {feedback.isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                  <span className="font-medium text-lg">{feedback.isCorrect ? 'Correct!' : 'Incorrect'}</span>
                </div>
                <p className={`${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {feedback.message}
                </p>
                <div className="text-sm text-gray-500 mt-2">
                  Moving to next card automatically...
                </div>
              </CardContent>
            </Card>
          )}

          {reviewedCards.length > 0 && (
            <div className="text-center text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
              ✅ You've answered {reviewedCards.length} card{reviewedCards.length !== 1 ? 's' : ''} correctly so far!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewMode;
