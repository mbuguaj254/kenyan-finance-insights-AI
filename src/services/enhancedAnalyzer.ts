
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, ImpactAnalysis } from "@/types/user";

export class EnhancedAnalyzer {
  
  static async analyzeMultiPerspective(userProfile: UserProfile, billContent?: string): Promise<ImpactAnalysis[]> {
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-analysis', {
        body: { 
          userProfile,
          billContent,
          analysisType: 'multi_perspective'
        }
      });

      if (error) {
        throw error;
      }

      return data.impacts;
    } catch (error) {
      console.error('Enhanced Analysis Error:', error);
      return this.getFallbackMultiPerspectiveAnalysis(userProfile);
    }
  }

  static async generateDetailedQuestions(userProfile: UserProfile): Promise<string[]> {
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-analysis', {
        body: { 
          userProfile,
          analysisType: 'clarifying_questions'
        }
      });

      if (error) {
        throw error;
      }

      return data.questions;
    } catch (error) {
      console.error('Question Generation Error:', error);
      return this.getFallbackQuestions(userProfile);
    }
  }

  private static getFallbackMultiPerspectiveAnalysis(userProfile: UserProfile): ImpactAnalysis[] {
    const perspectives = [
      {
        category: "Constitutional & Legal Perspective",
        impact: "negative" as const,
        severity: "medium" as const,
        description: "The Finance Bill 2025 raises constitutional concerns regarding fair taxation principles under Article 201, potentially affecting your rights to economic participation.",
        constitutionalRights: ["Article 201 (Fair Taxation)", "Article 33 (Freedom of Expression)"],
        recommendations: ["File constitutional petition", "Join public participation forums"],
        loopholes: ["Appeal on constitutional grounds", "Seek judicial review"]
      },
      {
        category: "Economic & Financial Perspective", 
        impact: "negative" as const,
        severity: "high" as const,
        description: "Direct financial impact through increased costs of digital services, imported goods, and professional tools affecting your disposable income.",
        constitutionalRights: ["Article 43 (Economic Rights)"],
        recommendations: ["Budget adjustment for increased costs", "Explore tax-efficient alternatives"],
        loopholes: ["Maximize available deductions", "Time major purchases strategically"]
      },
      {
        category: "Professional & Career Perspective",
        impact: "negative" as const,
        severity: "medium" as const,
        description: `As a ${userProfile.occupation}, you face profession-specific impacts including increased operational costs and compliance requirements.`,
        constitutionalRights: ["Article 41 (Fair Labour Practices)"],
        recommendations: ["Join professional associations for collective action", "Adapt business model to new tax reality"],
        loopholes: ["Professional expense deductions", "Industry-specific exemptions"]
      },
      {
        category: "Social & Community Perspective",
        impact: "negative" as const,
        severity: "medium" as const,
        description: "Community-wide effects including reduced spending power, potential job market changes, and social service funding implications.",
        constitutionalRights: ["Article 43 (Social Security)"],
        recommendations: ["Community organizing and advocacy", "Support local economic initiatives"],
        loopholes: ["Community-based tax planning", "Collective purchasing power"]
      },
      {
        category: "Long-term Strategic Perspective",
        impact: "neutral" as const,
        severity: "medium" as const,
        description: "Long-term implications for economic growth, digital transformation, and Kenya's competitive position in the global economy.",
        constitutionalRights: ["Article 201 (Sustainable Development)"],
        recommendations: ["Strategic financial planning", "Invest in future-proof skills"],
        loopholes: ["Position for emerging opportunities", "Build resilient financial base"]
      }
    ];

    return perspectives;
  }

  private static getFallbackQuestions(userProfile: UserProfile): string[] {
    const baseQuestions = [
      "What percentage of your income comes from digital services or online work?",
      "Do you frequently purchase imported goods or equipment for your profession?",
      "Are you planning any major purchases or investments in the next 12 months?",
      "Do you use mobile money services daily for business transactions?",
      "What professional tools or software do you rely on that might be affected?"
    ];

    const professionSpecific = {
      'teacher': [
        "Do you use paid online educational platforms or tools?",
        "What percentage of your teaching materials are imported?",
        "Do you earn additional income from online tutoring?"
      ],
      'student': [
        "What online learning platforms do you subscribe to?",
        "Do you purchase textbooks or materials from international sources?",
        "How dependent are you on digital devices for your studies?"
      ],
      'entrepreneur': [
        "What digital payment platforms does your business use?",
        "Do you sell products or services online?",
        "What percentage of your revenue comes from digital channels?"
      ]
    };

    const occupation = userProfile.occupation?.toLowerCase() || '';
    for (const [key, questions] of Object.entries(professionSpecific)) {
      if (occupation.includes(key)) {
        return [...baseQuestions, ...questions];
      }
    }

    return baseQuestions;
  }
}
