
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailDraft } from "@/types/user";
import { Send, Edit, Copy, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmailService } from "@/services/emailService";

interface EmailDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailDraft: EmailDraft;
}

const EmailDraftModal = ({ isOpen, onClose, emailDraft }: EmailDraftModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState(emailDraft.subject);
  const [editedBody, setEditedBody] = useState(emailDraft.body);
  const [editedRecipients, setEditedRecipients] = useState(emailDraft.to.join(', '));
  const { toast } = useToast();

  const handleOpenEmailClient = async () => {
    try {
      const updatedEmailDraft = {
        ...emailDraft,
        to: editedRecipients.split(',').map(email => email.trim()),
        subject: editedSubject,
        body: editedBody
      };

      await EmailService.openEmailClient(updatedEmailDraft);
      
      toast({
        title: "Email client opened!",
        description: "Your email application should now be open with the draft ready to send.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Failed to open email client",
        description: "Please copy the email content and paste it into your email application.",
        variant: "destructive",
      });
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const updatedEmailDraft = {
        ...emailDraft,
        to: editedRecipients.split(',').map(email => email.trim()),
        subject: editedSubject,
        body: editedBody
      };

      await EmailService.copyEmailToClipboard(updatedEmailDraft);
      
      toast({
        title: "Email copied to clipboard!",
        description: "You can now paste this into your email application.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy email",
        description: "Please manually copy the email content.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Draft - Finance Bill Impact Analysis
          </DialogTitle>
          <DialogDescription>
            Review and edit your personalized impact analysis email. Use your personal email to send this to officials.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="recipients">To:</Label>
            {isEditing ? (
              <Input
                id="recipients"
                value={editedRecipients}
                onChange={(e) => setEditedRecipients(e.target.value)}
                placeholder="Enter email addresses separated by commas"
              />
            ) : (
              <Input
                id="recipients"
                value={editedRecipients}
                disabled
                className="bg-gray-50"
              />
            )}
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
              <Button 
                variant="outline" 
                onClick={handleCopyToClipboard}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Email
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleOpenEmailClient}
                className="bg-kenya-green hover:bg-kenya-green/90 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Open Email App
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDraftModal;
