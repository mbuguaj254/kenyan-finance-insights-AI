
export interface UserProfile {
  id?: string;
  occupation: string;
  incomeLevel: 'low' | 'middle' | 'high';
  location: 'urban' | 'rural';
  transport: string[];
  propertyOwner: boolean;
  dependents: number;
  businessOwner: boolean;
  consumptionHabits: string[];
  concerns: string[];
  createdAt?: string;
}

export interface ImpactAnalysis {
  category: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  severity: 'low' | 'medium' | 'high';
  constitutionalRights?: string[];
  recommendations?: string[];
  loopholes?: string[];
}

export interface EmailDraft {
  to: string[];
  subject: string;
  body: string;
  userProfile: UserProfile;
  impactSummary: ImpactAnalysis[];
}
