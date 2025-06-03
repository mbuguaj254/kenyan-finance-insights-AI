
import { UserProfile, ImpactAnalysis, EmailDraft } from "@/types/user";

// Sample Finance Bill data and analysis logic
const FINANCE_BILL_PROVISIONS = {
  vat: {
    increases: ["Digital services VAT increase to 16%", "Imported goods VAT adjustments"],
    exemptions: ["Basic foodstuffs remain exempt", "Medical supplies exemption"]
  },
  incomeTax: {
    changes: ["Tax bands adjustment", "Relief changes for dependents"],
    rates: { low: 10, middle: 25, high: 30 }
  },
  transport: {
    fuel: "Fuel levy increase by KSh 5 per liter",
    vehicleImport: "Import duty on vehicles increased by 5%"
  },
  property: {
    landTax: "Land value assessment changes",
    rentalIncome: "Rental income tax adjustments"
  },
  business: {
    corporateTax: "Corporate tax rate changes",
    turnoverTax: "Turnover tax threshold adjustments"
  }
};

const CONSTITUTIONAL_ARTICLES = {
  expression: "Article 33 - Freedom of Expression",
  petition: "Article 37 - Right to Petition",
  fairTax: "Article 201 - Principles of Public Finance",
  equality: "Article 27 - Equality and Non-discrimination",
  property: "Article 40 - Right to Property"
};

export class FinanceBillAnalyzer {
  
  static analyzeImpact(profile: UserProfile): ImpactAnalysis[] {
    const impacts: ImpactAnalysis[] = [];

    // Career Impact Analysis
    impacts.push(this.analyzeCareerImpact(profile));
    
    // Transport Impact Analysis
    impacts.push(this.analyzeTransportImpact(profile));
    
    // Food and Living Costs
    impacts.push(this.analyzeFoodImpact(profile));
    
    // Property Impact
    if (profile.propertyOwner) {
      impacts.push(this.analyzePropertyImpact(profile));
    }
    
    // Business Impact
    if (profile.businessOwner) {
      impacts.push(this.analyzeBusinessImpact(profile));
    }

    return impacts;
  }

  private static analyzeCareerImpact(profile: UserProfile): ImpactAnalysis {
    const isDigitalWorker = profile.occupation.toLowerCase().includes('tech') || 
                           profile.occupation.toLowerCase().includes('digital');
    
    if (isDigitalWorker) {
      return {
        category: "Career & Employment",
        impact: "negative",
        severity: "medium",
        description: "The increased VAT on digital services may affect your industry, potentially leading to higher costs for digital tools and services used in your work.",
        constitutionalRights: [CONSTITUTIONAL_ARTICLES.fairTax],
        recommendations: [
          "Consider negotiating cost-of-living adjustments with your employer",
          "Explore tax-deductible business expenses for digital tools",
          "Join professional associations advocating for fair digital taxation"
        ],
        loopholes: [
          "Personal use vs business use distinction in digital services VAT",
          "Potential exemptions for educational digital tools"
        ]
      };
    }

    return {
      category: "Career & Employment",
      impact: "neutral",
      severity: "low",
      description: "Based on your occupation, the Finance Bill's direct impact on your career may be minimal, though indirect effects through overall economic changes are possible.",
      constitutionalRights: [CONSTITUTIONAL_ARTICLES.fairTax],
      recommendations: [
        "Monitor inflation and its impact on your purchasing power",
        "Consider skills development in recession-proof areas"
      ]
    };
  }

  private static analyzeTransportImpact(profile: UserProfile): ImpactAnalysis {
    const usesPersonalVehicle = profile.transport.includes("Personal Car");
    const usesPublicTransport = profile.transport.includes("Matatu/Bus") || 
                               profile.transport.includes("Uber/Taxi");

    if (usesPersonalVehicle) {
      return {
        category: "Transportation Costs",
        impact: "negative",
        severity: "high",
        description: "The fuel levy increase of KSh 5 per liter will significantly increase your monthly transport costs. Additionally, vehicle import duty increases may affect car maintenance and replacement costs.",
        constitutionalRights: [CONSTITUTIONAL_ARTICLES.fairTax],
        recommendations: [
          "Consider carpooling or public transport alternatives",
          "Explore fuel-efficient driving techniques",
          "Budget for increased monthly fuel costs (approximately KSh 1,500-3,000 more per month)"
        ],
        loopholes: [
          "Business vehicle fuel expenses may be tax-deductible",
          "Hybrid/electric vehicle incentives may offset some costs"
        ]
      };
    }

    if (usesPublicTransport) {
      return {
        category: "Transportation Costs",
        impact: "negative",
        severity: "medium",
        description: "While you don't directly pay for fuel, transport operators will likely increase fares to offset the fuel levy increase, affecting your commuting costs.",
        constitutionalRights: [CONSTITUTIONAL_ARTICLES.fairTax],
        recommendations: [
          "Budget for 10-15% increase in transport fares",
          "Consider relocating closer to work if feasible",
          "Explore remote work options"
        ]
      };
    }

    return {
      category: "Transportation Costs",
      impact: "neutral",
      severity: "low",
      description: "Your transport methods may be minimally affected by the Finance Bill changes.",
      constitutionalRights: [CONSTITUTIONAL_ARTICLES.fairTax],
      recommendations: ["Continue monitoring transport cost changes in your area"]
    };
  }

  private static analyzeFoodImpact(profile: UserProfile): ImpactAnalysis {
    const consumesImported = profile.consumptionHabits.includes("Imported goods");
    
    if (consumesImported) {
      return {
        category: "Food & Living Costs",
        impact: "negative",
        severity: "medium",
        description: "VAT adjustments on imported goods may increase the cost of imported food items and consumer goods you regularly use.",
        constitutionalRights: [CONSTITUTIONAL_ARTICLES.fairTax],
        recommendations: [
          "Substitute imported items with local alternatives where possible",
          "Buy in bulk during promotional periods",
          "Grow your own vegetables if you have space"
        ],
        loopholes: [
          "Basic foodstuffs remain VAT-exempt - focus on these items",
          "Some imported raw materials for local production may have different rates"
        ]
      };
    }

    return {
      category: "Food & Living Costs",
      impact: "positive",
      severity: "low",
      description: "Your focus on basic foodstuffs means you'll benefit from continued VAT exemptions on essential food items.",
      constitutionalRights: [CONSTITUTIONAL_ARTICLES.fairTax],
      recommendations: [
        "Continue prioritizing basic foodstuffs to maintain low costs",
        "Support local farmers and producers"
      ]
    };
  }

  private static analyzePropertyImpact(profile: UserProfile): ImpactAnalysis {
    return {
      category: "Property & Real Estate",
      impact: "negative",
      severity: profile.incomeLevel === "high" ? "high" : "medium",
      description: "Land value assessment changes and potential property tax adjustments may increase your annual property-related tax burden.",
      constitutionalRights: [CONSTITUTIONAL_ARTICLES.property, CONSTITUTIONAL_ARTICLES.fairTax],
      recommendations: [
        "Get your property professionally valued to understand potential tax implications",
        "Consider property improvements that may qualify for tax relief",
        "Explore legal property structuring options"
      ],
      loopholes: [
        "Owner-occupied vs investment property different tax treatments",
        "Agricultural land may have preferential rates",
        "Property development incentives may be available"
      ]
    };
  }

  private static analyzeBusinessImpact(profile: UserProfile): ImpactAnalysis {
    return {
      category: "Business Operations",
      impact: "negative",
      severity: "high",
      description: "Corporate tax changes and turnover tax threshold adjustments may significantly affect your business profitability and cash flow.",
      constitutionalRights: [CONSTITUTIONAL_ARTICLES.fairTax],
      recommendations: [
        "Consult with a tax advisor for business restructuring options",
        "Review pricing strategies to maintain margins",
        "Explore business expense optimization",
        "Consider timing of major business decisions around tax year"
      ],
      loopholes: [
        "Small business relief provisions may apply",
        "Capital allowances and depreciation benefits",
        "Export incentives may offset some tax increases",
        "Business loss carry-forward provisions"
      ]
    };
  }

  static generateEmailDraft(profile: UserProfile, impacts: ImpactAnalysis[]): EmailDraft {
    const subject = `Finance Bill 2025 Impact Analysis - ${profile.occupation} from ${profile.location} Kenya`;
    
    const body = `
Dear Recipients,

I hope this message finds you well. I am writing to share my personalized analysis of how the Finance Bill 2025 may impact my life and livelihood, as guaranteed by my constitutional rights under Articles 33 (Freedom of Expression) and 37 (Right to Assembly and Petition).

PERSONAL PROFILE:
- Occupation: ${profile.occupation}
- Location: ${profile.location} Kenya
- Income Level: ${profile.incomeLevel}
- Dependents: ${profile.dependents}
- Property Owner: ${profile.propertyOwner ? 'Yes' : 'No'}
- Business Owner: ${profile.businessOwner ? 'Yes' : 'No'}
- Main Transport: ${profile.transport.join(', ')}

IMPACT ANALYSIS:

${impacts.map((impact, index) => `
${index + 1}. ${impact.category.toUpperCase()}
   Impact Level: ${impact.impact.toUpperCase()} (${impact.severity} severity)
   
   ${impact.description}
   
   Constitutional Rights Affected: ${impact.constitutionalRights?.join(', ') || 'General fair taxation principles'}
   
   ${impact.recommendations ? `Recommended Actions:
   ${impact.recommendations.map(rec => `   • ${rec}`).join('\n')}` : ''}
   
   ${impact.loopholes ? `Legal Considerations:
   ${impact.loopholes.map(loop => `   • ${loop}`).join('\n')}` : ''}
`).join('\n')}

CONSTITUTIONAL BASIS:
This analysis is grounded in Kenya's Constitution, particularly:
- Article 201: Principles of Public Finance requiring fair and reasonable taxation
- Article 33: My right to freely express my views on public policy
- Article 37: My right to petition government on matters of public concern
- Chapter Six: Leadership and integrity principles that should guide all public officials

CALL TO ACTION:
I respectfully request that our elected representatives:
1. Consider the disproportionate impact on citizens like myself
2. Ensure proper public participation in fiscal policy decisions
3. Uphold constitutional principles of fair taxation
4. Provide clear implementation guidelines to minimize uncertainty

I trust that this information will contribute to informed decision-making that serves the best interests of all Kenyans while upholding our constitutional values.

In service of our nation and constitution,

A Concerned Kenyan Citizen
${new Date().toLocaleDateString()}

---
This analysis was generated using constitutional principles and publicly available information about the Finance Bill 2025. All views expressed are protected under Article 33 of the Constitution of Kenya.
`;

    return {
      to: ["recipient1@example.com", "recipient2@example.com"], // These would be configurable
      subject,
      body,
      userProfile: profile,
      impactSummary: impacts
    };
  }
}
