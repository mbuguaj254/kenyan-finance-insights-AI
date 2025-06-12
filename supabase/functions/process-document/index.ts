
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { file, fileName } = await req.json();
    
    console.log(`Processing document: ${fileName}`);
    
    // For now, we'll extract a comprehensive Finance Bill 2025 context
    // In a production environment, you'd use a PDF parsing library
    const financeBillContent = `
FINANCE BILL 2025 - KEY PROVISIONS AND IMPACTS

PART I: INCOME TAX AMENDMENTS
1. Personal Relief and Tax Bands
   - Tax-free per diem increased to KES 10,000 from KES 3,000
   - Streamlined PAYE relief system
   - Enhanced tax-free thresholds for low-income earners

2. Employment Benefits
   - Fully tax-exempt pension contributions and gratuities
   - Improved housing and transport allowances
   - Medical insurance deductions enhanced

3. Professional Deductions
   - Reduced special deductions for expatriates
   - Professional body membership fees remain deductible
   - Training and certification costs eligible for relief

PART II: VALUE ADDED TAX AMENDMENTS
1. Digital Services
   - VAT on digital marketplace services
   - Enhanced compliance for online platforms
   - Impact on e-commerce and digital transactions

2. Financial Services
   - VAT adjustments on banking and insurance
   - Mobile money transaction costs
   - Investment platform charges

PART III: EXCISE DUTY AMENDMENTS
1. Import Duties
   - Increased duties on luxury goods
   - Electronics and gadgets price impacts
   - Motor vehicle importation changes

2. Local Production
   - Incentives for local manufacturing
   - Reduced duties on raw materials
   - Export promotion measures

PART IV: DIGITAL ECONOMY TAXATION
1. Significant Economic Presence Tax (SEPT)
   - 1.5% tax on digital services
   - Impact on IT professionals and tech companies
   - Compliance requirements for online businesses

2. Cryptocurrency and Digital Assets
   - 1.5% tax on crypto transactions (reduced from 3%)
   - Digital asset trading regulations
   - Reporting requirements

PART V: SECTOR-SPECIFIC IMPACTS

EDUCATION SECTOR:
- Higher costs for digital learning platforms
- Increased prices for imported educational technology
- VAT on online educational services
- Relief for local educational content

HEALTHCARE SECTOR:
- Medical equipment import duty changes
- Digital health platform taxation
- Telemedicine service costs
- Healthcare insurance adjustments

AGRICULTURE SECTOR:
- Import protection through duties
- Fertilizer and seed cost implications
- Agricultural technology investments
- Export incentive programs

TRANSPORT SECTOR:
- Fuel levy adjustments
- Vehicle importation costs
- Digital payment platform fees
- Public transport fare impacts

TECHNOLOGY SECTOR:
- SEPT compliance costs vs startup incentives
- Reduced corporate tax for qualifying businesses
- Digital infrastructure investments
- Software licensing cost implications

RETAIL AND COMMERCE:
- E-commerce platform compliance
- Digital payment processing costs
- Import duty on consumer goods
- Local vs imported product pricing

PART VI: CONSTITUTIONAL CONSIDERATIONS
Article 201 (Principles of Public Finance):
- Fair taxation and equitable distribution
- Transparency in tax policy
- Public participation in fiscal decisions

Article 33 (Freedom of Expression):
- Impact on digital content creators
- Online platform accessibility
- Information access costs

Article 37 (Right to Petition):
- Citizens' right to challenge tax policies
- Public participation mechanisms
- Legal recourse options

PART VII: IMPLEMENTATION TIMELINE
- Phased rollout of digital taxes
- Compliance deadlines for businesses
- Transition periods for affected sectors
- Appeals and review processes

PART VIII: ECONOMIC IMPACT PROJECTIONS
- Revenue generation targets
- GDP growth implications
- Employment sector effects
- Consumer price index impacts
- Foreign investment considerations
`;

    // Extract key provisions for different profession categories
    const professionImpacts = {
      'student': 'Higher digital learning costs, increased prices for educational technology, VAT on online courses',
      'teacher': 'Digital teaching platform costs, educational technology price increases, professional development expenses',
      'doctor': 'Medical equipment price increases, telemedicine service costs, digital health platform charges',
      'nurse': 'Healthcare system cost pressures, medical technology price impacts, training cost implications',
      'engineer': 'SEPT compliance if in tech, startup incentives vs compliance costs, digital tool price increases',
      'lawyer': 'Digital legal research tool costs, case management system expenses, professional service platform charges',
      'farmer': 'Import protection benefits vs input cost increases, agricultural technology pricing, export incentives',
      'driver': 'Fuel cost implications, digital payment platform fees, vehicle importation costs',
      'entrepreneur': 'SEPT compliance vs startup incentives, e-commerce platform costs, digital payment processing fees',
      'accountant': 'Digital accounting software costs, compliance system expenses, professional service platform charges'
    };

    return new Response(JSON.stringify({ 
      content: financeBillContent,
      professionImpacts: professionImpacts,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in process-document function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
