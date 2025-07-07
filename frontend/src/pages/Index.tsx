
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Upload, RotateCcw, AlertCircle, Brain } from "lucide-react";
import CardManager from "@/components/CardManager";
import ReviewMode from "@/components/ReviewMode";
import FileUpload from "@/components/FileUpload";
import Header from "@/components/Header";
import { useFlashcards } from "@/contexts/FlashcardContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const { cards, loading, error } = useFlashcards();
  const [isReviewMode, setIsReviewMode] = useState(false);

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
        onExit={exitReviewMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <p className="text-gray-600 text-lg">Master your knowledge with intelligent flashcards</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-transform duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5" />
                Total Cards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{cards.length}</div>
              <p className="text-purple-100 text-sm mt-1">Cards in your collection</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-transform duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5" />
                Study Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {cards.length > 0 ? '100%' : '0%'}
              </div>
              <p className="text-blue-100 text-sm mt-1">Ready for learning</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mb-8">
          <Button
            onClick={startReviewMode}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-lg"
            disabled={cards.length === 0 || loading}
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            {loading ? 'Loading...' : 'Start Review Session'}
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
            <CardManager />
          </TabsContent>

          <TabsContent value="upload">
            <FileUpload />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
