import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { RotateCcw, Check, X, Shuffle, Home, Send } from "lucide-react";
import { FlashCard } from "@/types/FlashCard";
import { useFlashcards } from "@/contexts/FlashcardContext";
import ReviewPreferences from "./ReviewPreferences";

interface ReviewModeProps {
  cards: FlashCard[];
  onExit: () => void;
}

interface ReviewResult {
  cardId: string;
  userAnswer: string;
  isCorrect: boolean;
  interval: number;
  easeFactor: number;
}

const ReviewMode = ({ cards, onExit }: ReviewModeProps) => {
  const { fetchReviewCards, updateCardsAfterReview, loading } = useFlashcards();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [reviewResults, setReviewResults] = useState<ReviewResult[]>([]);
  const [reviewCards, setReviewCards] = useState<FlashCard[]>([]);
  const [showPreferences, setShowPreferences] = useState(true);
  const [reviewType, setReviewType] = useState<'all' | 'due'>('due');
  const [isComplete, setIsComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingCards, setIsFetchingCards] = useState(false);

  const dueCards = cards.filter(card => !card.lastReviewed);

  const startReview = async (type: 'all' | 'due') => {
    setReviewType(type);
    setIsFetchingCards(true);
    
    try {
      // Make API call to fetch review cards based on preference
      const fetchedCards = await fetchReviewCards(type);
      const shuffled = [...fetchedCards].sort(() => Math.random() - 0.5);
      
      setReviewCards(shuffled);
      setCurrentIndex(0);
      setUserAnswer("");
      setFeedback(null);
      setReviewResults([]);
      setIsComplete(false);
      setShowPreferences(false);
    } catch (error) {
      console.error('Failed to fetch review cards:', error);
      // Handle error - maybe show error message to user
    } finally {
      setIsFetchingCards(false);
    }
  };

  const currentCard = reviewCards[currentIndex];
  const progress = reviewCards.length > 0 ? ((currentIndex + 1) / reviewCards.length) * 100 : 0;

  const handleSubmit = async () => {
    if (!currentCard || !userAnswer.trim()) return;

    const isCorrect = userAnswer.trim().toLowerCase() === currentCard.back.toLowerCase();
    
    // Store the result for batch processing later
    const result: ReviewResult = {
      cardId: currentCard.id,
      userAnswer: userAnswer.trim(),
      isCorrect,
      interval: currentCard.interval || 1,
      easeFactor: currentCard.easeFactor || 2.5,
    };
    
    setReviewResults(prev => [...prev, result]);
    
    setFeedback({
      isCorrect,
      message: isCorrect ? "Correct! Well done!" : `Incorrect. The correct answer is: ${currentCard.back}`
    });

    // Auto-advance to next card after 2 seconds
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  const handleNext = async () => {
    setUserAnswer("");
    setFeedback(null);
    
    if (currentIndex < reviewCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All cards reviewed - now make API call to update cards
      setIsProcessing(true);
      
      // Transform review results to match backend schema
      const updates = reviewResults.map(result => ({
        card_id: parseInt(result.cardId), // Convert to number as required by schema
        is_correct: result.isCorrect,
        interval: result.interval,
        ease_factor: result.easeFactor,
      }));
      
      try {
        await updateCardsAfterReview(updates);
        setIsComplete(true);
        console.log('Review session completed. Cards updated via API:', updates);
      } catch (error) {
        console.error('Failed to update cards:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const shuffleCards = () => {
    const shuffled = [...reviewCards].sort(() => Math.random() - 0.5);
    setReviewCards(shuffled);
    setCurrentIndex(0);
    setUserAnswer("");
    setFeedback(null);
    setReviewResults([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !feedback) {
      handleSubmit();
    }
  };

  if (showPreferences) {
    return (
      <ReviewPreferences
        onStartReview={startReview}
        onBack={onExit}
        isLoading={isFetchingCards}
      />
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-md text-center">
          <Card className="w-full">
            <CardContent className="p-8">
              <div className="text-4xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Results...</h2>
              <p className="text-gray-600 mb-6">
                Updating your flashcards with backend API
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const correctAnswers = reviewResults.filter(r => r.isCorrect).length;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-md text-center">
          <Card className="w-full">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Complete!</h2>
              <p className="text-gray-600 mb-6">
                You've reviewed {reviewCards.length} card{reviewCards.length !== 1 ? 's' : ''}
              </p>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                <p className="text-green-700 font-medium">
                  ✅ {correctAnswers} cards answered correctly
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Cards have been updated via backend API
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

  if (reviewCards.length === 0) {
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
              Card {currentIndex + 1} of {reviewCards.length}
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

          {reviewResults.length > 0 && (
            <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
              📝 Progress: {reviewResults.length} of {reviewCards.length} cards answered
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewMode;
