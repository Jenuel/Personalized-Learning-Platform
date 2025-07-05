
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { FlashCard } from "@/pages/Index";

interface CardManagerProps {
  cards: FlashCard[];
  onAddCard: (front: string, back: string) => void;
  onUpdateCard: (id: string, front: string, back: string) => void;
  onDeleteCard: (id: string) => void;
}

const CardManager = ({ cards, onAddCard, onUpdateCard, onDeleteCard }: CardManagerProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashCard | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");

  const filteredCards = cards.filter(card =>
    card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.back.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCard = () => {
    if (newCardFront.trim() && newCardBack.trim()) {
      onAddCard(newCardFront.trim(), newCardBack.trim());
      setNewCardFront("");
      setNewCardBack("");
      setIsAddDialogOpen(false);
    }
  };

  const handleUpdateCard = () => {
    if (editingCard && newCardFront.trim() && newCardBack.trim()) {
      onUpdateCard(editingCard.id, newCardFront.trim(), newCardBack.trim());
      setEditingCard(null);
      setNewCardFront("");
      setNewCardBack("");
    }
  };

  const startEditing = (card: FlashCard) => {
    setEditingCard(card);
    setNewCardFront(card.front);
    setNewCardBack(card.back);
  };

  const cancelEditing = () => {
    setEditingCard(null);
    setNewCardFront("");
    setNewCardBack("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add New Card
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Flashcard</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Front (Question)</label>
                <Textarea
                  placeholder="Enter the question or prompt..."
                  value={newCardFront}
                  onChange={(e) => setNewCardFront(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Back (Answer)</label>
                <Textarea
                  placeholder="Enter the answer or explanation..."
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddCard}>
                  Add Card
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map((card) => (
          <Card key={card.id} className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 mb-2">Question</CardTitle>
              <div className="text-base font-semibold text-gray-800 line-clamp-3">
                {card.front}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-600 mb-2">Answer</div>
                <div className="text-sm text-gray-700 line-clamp-3">
                  {card.back}
                </div>
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEditing(card)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDeleteCard(card.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {searchTerm ? "No cards match your search" : "No cards yet"}
          </div>
          {!searchTerm && (
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              variant="outline"
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first card
            </Button>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingCard} onOpenChange={(open) => !open && cancelEditing()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Flashcard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Front (Question)</label>
              <Textarea
                placeholder="Enter the question or prompt..."
                value={newCardFront}
                onChange={(e) => setNewCardFront(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Back (Answer)</label>
              <Textarea
                placeholder="Enter the answer or explanation..."
                value={newCardBack}
                onChange={(e) => setNewCardBack(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={cancelEditing}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCard}>
                Update Card
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardManager;
