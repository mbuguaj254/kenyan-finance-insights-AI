
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentUploadProps {
  onDocumentProcessed: (content: string) => void;
}

const DocumentUpload = ({ onDocumentProcessed }: DocumentUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus('processing');
    setFileName(file.name);

    try {
      // Convert file to base64 for processing
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        try {
          const { data, error } = await supabase.functions.invoke('process-document', {
            body: { 
              file: base64,
              fileName: file.name 
            }
          });

          if (error) {
            throw error;
          }

          setUploadStatus('success');
          onDocumentProcessed(data.content);
          
          toast({
            title: "Document Processed",
            description: "Finance Bill content has been extracted and integrated into the AI system.",
          });
        } catch (error) {
          console.error('Document processing error:', error);
          setUploadStatus('error');
          toast({
            title: "Processing Error",
            description: "Failed to process the document. Please try again.",
            variant: "destructive",
          });
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      toast({
        title: "Upload Error",
        description: "Failed to upload the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'processing':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-kenya-green"></div>;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'processing':
        return 'Processing document...';
      case 'success':
        return `Successfully processed: ${fileName}`;
      case 'error':
        return 'Processing failed. Please try again.';
      default:
        return 'No document uploaded';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Finance Bill 2025
        </CardTitle>
        <CardDescription>
          Upload the Finance Bill PDF to enhance AI analysis with actual bill content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="document">Select PDF Document</Label>
          <Input
            id="document"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="mt-1"
          />
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          {getStatusIcon()}
          <span className="text-sm text-gray-600">{getStatusText()}</span>
        </div>

        {uploadStatus === 'success' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              The Finance Bill content is now integrated into the AI system and will provide more accurate analysis.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
