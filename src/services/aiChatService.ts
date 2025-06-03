
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/user";

export class AIChatService {
  
  static async sendMessage(message: string, userProfile?: UserProfile): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message,
          userProfile 
        }
      });

      if (error) {
        throw error;
      }

      return data.response;
    } catch (error) {
      console.error('AI Chat Service Error:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  static async getFinanceBillUpdates(): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('finance-bill-updates');

      if (error) {
        throw error;
      }

      return data.updates || 'No recent updates available.';
    } catch (error) {
      console.error('Finance Bill Updates Error:', error);
      return 'Unable to fetch updates at this time.';
    }
  }
}
