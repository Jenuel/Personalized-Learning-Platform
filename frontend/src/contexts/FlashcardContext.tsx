import React, { createContext, useContext, useState, useCallback } from 'react';
import { FlashCard } from '@/types/FlashCard';

interface CardUpdate {
  card_id: number;
  is_correct: boolean;
  interval: number;
  ease_factor: number;
}

interface FlashcardContextType {
  cards: FlashCard[];
  loading: boolean;
  error: string | null;
  addCard: (front: string, back: string) => Promise<void>;
  updateCard: (id: string, front: string, back: string) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  markCardReviewed: (id: string) => Promise<void>;
  addCardsFromFile: (newCards: Omit<FlashCard, 'id'>[]) => Promise<void>;
  refreshCards: () => Promise<void>;
  fetchReviewCards: (reviewType: 'all' | 'due') => Promise<FlashCard[]>;
  updateCardsAfterReview: (updates: CardUpdate[]) => Promise<void>;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
};

interface FlashcardProviderProps {
  children: React.ReactNode;
}

export const FlashcardProvider = ({ children }: FlashcardProviderProps) => {
  const [cards, setCards] = useState<FlashCard[]>([
    {
      id: "1",
      front: "What is React?",
      back: "React is a JavaScript library for building user interfaces, particularly web applications.",
      interval: 1,
      easeFactor: 2.5,
    },
    {
      id: "2", 
      front: "What is TypeScript?",
      back: "TypeScript is a strongly typed programming language that builds on JavaScript.",
      interval: 1,
      easeFactor: 2.5,
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const simulateApiCall = (duration: number = 500) => {
    return new Promise(resolve => setTimeout(resolve, duration));
  };

  const fetchReviewCards = useCallback(async (reviewType: 'all' | 'due'): Promise<FlashCard[]> => {
    setLoading(true);
    setError(null);
    try {
      await simulateApiCall(1000);
      
      // Simulate API call to backend
      // POST /api/review/cards with body: { reviewType: 'all' | 'due' }
      console.log(`Fetching ${reviewType} cards for review session`);
      
      // Backend will determine which cards are due based on nextReview date
      // For now, return all cards as the backend will handle the filtering
      return cards;
    } catch (err) {
      setError('Failed to fetch review cards');
      console.error('Error fetching review cards:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cards]);

  const updateCardsAfterReview = useCallback(async (updates: CardUpdate[]) => {
    setLoading(true);
    setError(null);
    try {
      await simulateApiCall(1500);
      
      // Send updates array to backend API
      // POST /api/review/update with body: { updates: CardUpdate[] }
      console.log('Sending card updates to backend:', updates);
      
      // Backend will calculate new intervals, ease factors, and nextReview dates
      // and return the updated cards. For now, we'll just update the local state
      // to indicate the review is complete
      console.log('Cards updated successfully after review session');
    } catch (err) {
      setError('Failed to update cards after review');
      console.error('Error updating cards after review:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addCard = useCallback(async (front: string, back: string) => {
    setLoading(true);
    setError(null);
    try {
      await simulateApiCall();
      const newCard: FlashCard = {
        id: Date.now().toString(),
        front,
        back,
        interval: 1,
        easeFactor: 2.5,
      };
      setCards(prev => [...prev, newCard]);
    } catch (err) {
      setError('Failed to add card');
      console.error('Error adding card:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCard = useCallback(async (id: string, front: string, back: string) => {
    setLoading(true);
    setError(null);
    try {
      await simulateApiCall();
      setCards(prev => prev.map(card => 
        card.id === id ? { ...card, front, back } : card
      ));
    } catch (err) {
      setError('Failed to update card');
      console.error('Error updating card:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCard = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await simulateApiCall();
      setCards(prev => prev.filter(card => card.id !== id));
    } catch (err) {
      setError('Failed to delete card');
      console.error('Error deleting card:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markCardReviewed = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await simulateApiCall(200);
      // This function is no longer needed since we don't track lastReviewed
      // The backend will handle review status via nextReview dates
      console.log(`Card ${id} review status updated via backend`);
    } catch (err) {
      setError('Failed to mark card as reviewed');
      console.error('Error marking card as reviewed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCardsFromFile = useCallback(async (newCards: Omit<FlashCard, 'id'>[]) => {
    setLoading(true);
    setError(null);
    try {
      await simulateApiCall(1000);
      const cardsWithIds = newCards.map(card => ({
        ...card,
        id: Date.now().toString() + Math.random().toString(),
        interval: card.interval || 1,
        easeFactor: card.easeFactor || 2.5,
      }));
      setCards(prev => [...prev, ...cardsWithIds]);
    } catch (err) {
      setError('Failed to add cards from file');
      console.error('Error adding cards from file:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await simulateApiCall();
    } catch (err) {
      setError('Failed to refresh cards');
      console.error('Error refreshing cards:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value: FlashcardContextType = {
    cards,
    loading,
    error,
    addCard,
    updateCard,
    deleteCard,
    markCardReviewed,
    addCardsFromFile,
    refreshCards,
    fetchReviewCards,
    updateCardsAfterReview,
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
};
