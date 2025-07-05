import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Upload, RotateCcw } from "lucide-react";
import CardManager from "@/components/CardManager";
import ReviewMode from "@/components/ReviewMode";
import FileUpload from "@/components/FileUpload";

export interface FlashCard {
  id: string;
  front: string;
  back: string;
  createdAt: Date;
  lastReviewed?: Date;
}

const Index = () => {
  const [cards, setCards] = useState<FlashCard[]>([
    {
      id: "1",
      front: "What is React?",
      back: "React is a JavaScript library for building user interfaces, particularly web applications.",
      createdAt: new Date(),
    },
    {
      id: "2", 
      front: "What is TypeScript?",
      back: "TypeScript is a strongly typed programming language that builds on JavaScript.",
      createdAt: new Date(),
    }
  ]);

  const [isReviewMode, setIsReviewMode] = useState(false);

  const addCard = (front: string, back: string) => {
    const newCard: FlashCard = {
      id: Date.now().toString(),
      front,
      back,
      createdAt: new Date(),
    };
    setCards([...cards, newCard]);
  };

  const updateCard = (id: string, front: string, back: string) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, front, back } : card
    ));
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const markCardReviewed = (id: string) => {
    setCards(cards.map(card =>
      card.id === id ? { ...card, lastReviewed: new Date() } : card
    ));
  };

  const addCardsFromFile = (newCards: Omit<FlashCard, 'id' | 'createdAt'>[]) => {
    const cardsWithIds = newCards.map(card => ({
      ...card,
      id: Date.now().toString() + Math.random().toString(),
      createdAt: new Date(),
    }));
    setCards([...cards, ...cardsWithIds]);
  };

  const startReviewMode = () => {
    setIsReviewMode(true);
  };

  const exitReviewMode = () => {
    setIsReviewMode(false);
  };

  if (isReviewMode) {
    return (
      <ReviewMode
        cards={cards}
        onMarkReviewed={markCardReviewed}
        onExit={exitReviewMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Card Genius
          </h1>
          <p className="text-gray-600 text-lg">Master your knowledge with intelligent flashcards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-transform duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5" />
                Total Cards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{cards.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-transform duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <RotateCcw className="h-5 w-5" />
                Reviewed Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {cards.filter(card => 
                  card.lastReviewed && 
                  new Date(card.lastReviewed).toDateString() === new Date().toDateString()
                ).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white transform hover:scale-105 transition-transform duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plus className="h-5 w-5" />
                Ready to Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {cards.filter(card => !card.lastReviewed).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mb-8">
          <Button
            onClick={startReviewMode}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-lg"
            disabled={cards.length === 0}
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Start Review Session
          </Button>
        </div>

        <Tabs defaultValue="manage" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Manage Cards
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload File
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manage">
            <CardManager
              cards={cards}
              onAddCard={addCard}
              onUpdateCard={updateCard}
              onDeleteCard={deleteCard}
            />
          </TabsContent>

          <TabsContent value="upload">
            <FileUpload onCardsGenerated={addCardsFromFile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
