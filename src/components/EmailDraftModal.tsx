
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailDraft } from "@/types/user";
import { Send, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailDraft: EmailDraft;
}

const EmailDraftModal = ({ isOpen, onClose, emailDraft }: EmailDraftModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState(emailDraft.subject);
  const [editedBody, setEditedBody] = useState(emailDraft.body);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    setIsSending(true);
    try {
      // Simulate email sending (in real implementation, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Email sent successfully!",
        description: "Your impact analysis has been sent to the specified recipients.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Failed to send email",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Email Draft - Finance Bill Impact Analysis
          </DialogTitle>
          <DialogDescription>
            Review and edit your personalized impact analysis email before sending
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="recipients">To:</Label>
            <Input
              id="recipients"
              value={emailDraft.to.join(', ')}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject:</Label>
            {isEditing ? (
              <Input
                id="subject"
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
              />
            ) : (
              <Input
                id="subject"
                value={editedSubject}
                disabled
                className="bg-gray-50"
              />
            )}
          </div>

          <div>
            <Label htmlFor="body">Message:</Label>
            {isEditing ? (
              <Textarea
                id="body"
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
            ) : (
              <div className="bg-gray-50 p-4 rounded-md border min-h-[400px] whitespace-pre-wrap text-sm">
                {editedBody}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              {isEditing ? 'Preview' : 'Edit'}
            </Button>

            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSend} 
                disabled={isSending}
                className="bg-kenya-green hover:bg-kenya-green/90"
              >
                {isSending ? 'Sending...' : 'Send Email'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDraftModal;
