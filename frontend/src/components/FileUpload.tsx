
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { FlashCard } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onCardsGenerated: (cards: Omit<FlashCard, 'id' | 'createdAt'>[]) => void;
}

const FileUpload = ({ onCardsGenerated }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewCards, setPreviewCards] = useState<Omit<FlashCard, 'id' | 'createdAt'>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setPreviewCards([]);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setPreviewCards([]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const simulateCardGeneration = async (fileContent: string) => {
    // This simulates calling your backend API
    // In real implementation, you would send the file content to your backend
    // and receive generated cards in response
    
    const lines = fileContent.split('\n').filter(line => line.trim().length > 0);
    const generatedCards: Omit<FlashCard, 'id' | 'createdAt'>[] = [];

    // Simple example: Create cards from lines that contain question marks
    // In real implementation, your backend would use AI to generate meaningful Q&A pairs
    lines.forEach((line, index) => {
      if (line.includes('?')) {
        generatedCards.push({
          front: line.trim(),
          back: `This is a generated answer for: ${line.trim()}`,
        });
      } else if (line.length > 20) {
        generatedCards.push({
          front: `What is the main concept in: "${line.substring(0, 50)}..."?`,
          back: line.trim(),
        });
      }
    });

    // If no meaningful cards generated, create some example cards
    if (generatedCards.length === 0) {
      generatedCards.push(
        {
          front: "What was the main topic of the uploaded file?",
          back: "The file contained information that can be used to generate study cards.",
        },
        {
          front: "How many lines of content were in the file?",
          back: `The file contained ${lines.length} lines of content.`,
        }
      );
    }

    return generatedCards;
  };

  const processFile = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const fileContent = await uploadedFile.text();
      const generatedCards = await simulateCardGeneration(fileContent);
      
      setPreviewCards(generatedCards);
      
      toast({
        title: "File processed successfully!",
        description: `Generated ${generatedCards.length} cards from your file.`,
      });

    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error processing file",
        description: "There was an error generating cards from your file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const addCardsToCollection = () => {
    onCardsGenerated(previewCards);
    setPreviewCards([]);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "Cards added successfully!",
      description: `${previewCards.length} new cards have been added to your collection.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload File to Generate Cards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {uploadedFile ? (
              <div className="space-y-2">
                <FileText className="h-12 w-12 text-green-500 mx-auto" />
                <div className="font-medium">{uploadedFile.name}</div>
                <div className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div className="font-medium">Drop your file here or click to browse</div>
                <div className="text-sm text-gray-500">
                  Supports .txt, .md, .pdf, .docx files
                </div>
              </div>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {uploadedFile && !isUploading && previewCards.length === 0 && (
            <Button
              onClick={processFile}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Generate Cards from File
            </Button>
          )}
        </CardContent>
      </Card>

      {previewCards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Generated Cards Preview
              </span>
              <Button onClick={addCardsToCollection} className="bg-green-600 hover:bg-green-700">
                Add {previewCards.length} Cards
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {previewCards.map((card, index) => (
                <Card key={index} className="border border-gray-200 hover:border-purple-300 transition-colors">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <div className="text-xs font-medium text-purple-600 mb-1">QUESTION</div>
                      <div className="text-sm font-medium">{card.front}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-blue-600 mb-1">ANSWER</div>
                      <div className="text-sm text-gray-600">{card.back}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-1">How it works:</div>
              <div>
                Upload a text file, and our system will analyze the content to automatically generate 
                flashcards with relevant questions and answers. The AI will identify key concepts and 
                create study materials to help you learn more effectively.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
