
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, ImpactAnalysis } from "@/types/user";

export class DynamicAnalyzer {
  
  static async analyzePersonalizedImpact(userProfile: UserProfile): Promise<ImpactAnalysis[]> {
    try {
      const { data, error } = await supabase.functions.invoke('dynamic-analysis', {
        body: { 
          userProfile,
          analysisType: 'personal_impact' 
        }
      });

      if (error) {
        throw error;
      }

      return data.impacts;
    } catch (error) {
      console.error('Dynamic Analysis Error:', error);
      // Fallback to basic analysis if AI fails
      return this.getBasicFallbackAnalysis(userProfile);
    }
  }

  static async generateEmailDraft(userProfile: UserProfile, impacts: ImpactAnalysis[]): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('dynamic-analysis', {
        body: { 
          userProfile,
          impacts,
          analysisType: 'email_draft' 
        }
      });

      if (error) {
        throw error;
      }

      return data.emailDraft;
    } catch (error) {
      console.error('Email Draft Generation Error:', error);
      return this.getBasicEmailFallback(userProfile);
    }
  }

  private static getBasicFallbackAnalysis(userProfile: UserProfile): ImpactAnalysis[] {
    const impacts: ImpactAnalysis[] = [];
    
    // Basic fallback based on profession
    if (userProfile.occupation?.toLowerCase().includes('teacher') || 
        userProfile.occupation?.toLowerCase().includes('student')) {
      impacts.push({
        category: "Education Sector Impact",
        impact: "negative",
        severity: "medium",
        description: "Higher costs for digital learning resources and imported educational materials.",
        constitutionalRights: ["Article 43 (Right to Education)"],
        recommendations: ["Advocate for education sector exemptions", "Form educator coalitions"],
        loopholes: ["Education materials may qualify for exemptions"]
      });
    }

    return impacts.length > 0 ? impacts : [{
      category: "General Economic Impact",
      impact: "negative", 
      severity: "medium",
      description: "The Finance Bill 2025 may affect your economic situation through various tax changes.",
      constitutionalRights: ["Article 201 (Fair Taxation)"],
      recommendations: ["Stay informed about changes", "Engage in public participation"],
      loopholes: ["Review all available deductions and exemptions"]
    }];
  }

  private static getBasicEmailFallback(userProfile: UserProfile): any {
    return {
      subject: `Finance Bill 2025 Impact - ${userProfile.occupation}`,
      body: `Dear Honorable Member of Parliament,

I am writing as a ${userProfile.occupation} from ${userProfile.location} to express my concerns about the Finance Bill 2025.

Based on my profession and circumstances, I am particularly concerned about the economic impacts of this legislation.

I urge you to consider the constitutional principles of fair taxation as outlined in Article 201 of our Constitution.

Thank you for your consideration.

Sincerely,
A Concerned Citizen`,
      to: []
    };
  }
}
