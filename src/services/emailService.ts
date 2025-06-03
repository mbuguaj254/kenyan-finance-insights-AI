
import { EmailDraft } from "@/types/user";

export class EmailService {
  
  static generateMailtoLink(emailDraft: EmailDraft): string {
    const subject = encodeURIComponent(emailDraft.subject);
    const body = encodeURIComponent(emailDraft.body);
    const recipients = emailDraft.to.join(',');
    
    return `mailto:${recipients}?subject=${subject}&body=${body}`;
  }

  static async openEmailClient(emailDraft: EmailDraft): Promise<void> {
    const mailtoLink = this.generateMailtoLink(emailDraft);
    
    // For mobile devices, we'll try to open the native email client
    if (this.isMobileDevice()) {
      window.location.href = mailtoLink;
    } else {
      // For desktop, open in a new window/tab
      window.open(mailtoLink, '_blank');
    }
  }

  static isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  static async copyEmailToClipboard(emailDraft: EmailDraft): Promise<void> {
    const emailText = `To: ${emailDraft.to.join(', ')}\nSubject: ${emailDraft.subject}\n\n${emailDraft.body}`;
    
    try {
      await navigator.clipboard.writeText(emailText);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = emailText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  static getDefaultRecipients(): string[] {
    // These can be configured or made editable by users
    return [
      'financecommittee@parliament.go.ke',
      'publicparticipation@treasury.go.ke'
    ];
  }
}
