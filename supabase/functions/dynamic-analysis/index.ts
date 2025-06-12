
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
    const { userProfile, impacts, analysisType } = await req.json();
    
    // Using Hugging Face's free inference API
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: generatePrompt(userProfile, impacts, analysisType),
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      // Fallback to OpenAI if Hugging Face fails
      return await fallbackToOpenAI(userProfile, impacts, analysisType);
    }

    const data = await response.json();
    const aiResponse = data[0]?.generated_text || data.generated_text;

    if (analysisType === 'personal_impact') {
      const impacts = parseImpactAnalysis(aiResponse, userProfile);
      return new Response(JSON.stringify({ impacts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (analysisType === 'email_draft') {
      const emailDraft = parseEmailDraft(aiResponse, userProfile);
      return new Response(JSON.stringify({ emailDraft }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in dynamic analysis:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fallbackToOpenAI(userProfile: any, impacts: any, analysisType: string) {
  const openAIApiKey = Deno.env.get('OPEN_AI_API');
  if (!openAIApiKey) {
    throw new Error('No AI service available');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: getSystemPrompt(analysisType) },
        { role: 'user', content: generatePrompt(userProfile, impacts, analysisType) }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;

  if (analysisType === 'personal_impact') {
    const impacts = parseImpactAnalysis(aiResponse, userProfile);
    return new Response(JSON.stringify({ impacts }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } else if (analysisType === 'email_draft') {
    const emailDraft = parseEmailDraft(aiResponse, userProfile);
    return new Response(JSON.stringify({ emailDraft }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

function getSystemPrompt(analysisType: string): string {
  if (analysisType === 'personal_impact') {
    return `You are a constitutional expert analyzing Kenya's Finance Bill 2025. Provide detailed, profession-specific impact analysis including:
    - Constitutional rights affected
    - Specific financial impacts
    - Practical recommendations
    - Legal strategies and loopholes
    
    Format your response as structured analysis with clear categories.`;
  } else {
    return `You are a professional writer helping Kenyan citizens draft impactful emails to their MPs about Finance Bill 2025. Write persuasive, respectful, and constitutionally-grounded correspondence.`;
  }
}

function generatePrompt(userProfile: any, impacts: any, analysisType: string): string {
  const professionContext = getProfessionContext(userProfile.occupation);
  
  if (analysisType === 'personal_impact') {
    return `Analyze the Finance Bill 2025 impact for a ${userProfile.occupation} in ${userProfile.location} with ${userProfile.incomeLevel} income.

Profession Context: ${professionContext}

Consider:
- Specific tax changes affecting this profession
- Digital economy impacts
- Constitutional rights (Articles 33, 37, 201, Chapter 6)
- Practical financial implications
- Legal strategies and advocacy opportunities

User Profile:
- Occupation: ${userProfile.occupation}
- Income: ${userProfile.incomeLevel}
- Location: ${userProfile.location}
- Property Owner: ${userProfile.propertyOwner}
- Business Owner: ${userProfile.businessOwner}
- Transport: ${userProfile.transport?.join(', ')}
- Consumption: ${userProfile.consumptionHabits?.join(', ')}

Provide 3-5 specific impact analyses with severity levels, constitutional rights, and actionable recommendations.`;
  } else {
    return `Draft a professional email to an MP regarding Finance Bill 2025 for a ${userProfile.occupation}.

Profession Context: ${professionContext}

Key concerns based on analysis:
${impacts?.map((impact: any) => `- ${impact.category}: ${impact.description}`).join('\n')}

Write a persuasive email that:
- References constitutional rights
- Includes specific profession impacts
- Suggests concrete policy changes
- Maintains respectful tone
- Includes call to action

Format as: Subject line, then email body.`;
  }
}

function getProfessionContext(occupation: string): string {
  const contexts = {
    'teacher': 'Teachers face increased costs for digital learning tools, classroom technology, and educational materials due to VAT changes and import duties.',
    'student': 'Students experience higher costs for online learning platforms, educational technology, and imported textbooks while dealing with reduced family income.',
    'farmer': 'Farmers benefit from crop protection through import duties but face higher costs for imported seeds, fertilizers, and agricultural technology.',
    'doctor': 'Healthcare professionals see increased costs for medical equipment and digital health platforms while patients face higher healthcare expenses.',
    'engineer': 'Engineers in IT face new digital economy taxes (SEPT) but may benefit from startup incentives and reduced corporate taxes.',
    'lawyer': 'Legal professionals face higher costs for digital legal research tools and case management systems.',
    'driver': 'Transport workers experience increased costs from mobile payment platform fees and digital service taxes.',
    'nurse': 'Healthcare workers face indirect impacts through increased costs of medical technology and digital health systems.',
    'accountant': 'Financial professionals deal with new compliance requirements and digital service taxes affecting accounting software.',
    'entrepreneur': 'Business owners face mixed impacts - startup incentives vs increased digital economy taxes and compliance costs.',
  };
  
  const lowerOccupation = occupation.toLowerCase();
  for (const [key, context] of Object.entries(contexts)) {
    if (lowerOccupation.includes(key)) {
      return context;
    }
  }
  
  return 'General impact analysis considering digital economy changes, tax adjustments, and constitutional rights.';
}

function parseImpactAnalysis(aiResponse: string, userProfile: any): any[] {
  // Parse AI response into structured impact analysis
  // This is a simplified parser - in production, you'd want more robust parsing
  const impacts = [];
  
  try {
    // Try to extract structured information from AI response
    const sections = aiResponse.split('\n\n');
    let currentImpact: any = null;
    
    for (const section of sections) {
      if (section.includes('Impact:') || section.includes('Category:')) {
        if (currentImpact) impacts.push(currentImpact);
        currentImpact = {
          category: extractField(section, 'Category') || 'Economic Impact',
          impact: extractField(section, 'Impact') || 'negative',
          severity: extractField(section, 'Severity') || 'medium',
          description: extractField(section, 'Description') || section.substring(0, 200),
          constitutionalRights: ['Article 201 (Fair Taxation)'],
          recommendations: [extractField(section, 'Recommendation') || 'Stay informed and engage in public participation'],
          loopholes: [extractField(section, 'Strategy') || 'Review available exemptions']
        };
      }
    }
    
    if (currentImpact) impacts.push(currentImpact);
    
    // Ensure we have at least one impact
    if (impacts.length === 0) {
      impacts.push({
        category: `${userProfile.occupation} Professional Impact`,
        impact: 'negative',
        severity: 'medium',
        description: aiResponse.substring(0, 300) || 'AI analysis indicates potential impacts from Finance Bill 2025',
        constitutionalRights: ['Article 201 (Fair Taxation)', 'Article 33 (Freedom of Expression)'],
        recommendations: ['Engage with professional associations', 'Participate in public forums'],
        loopholes: ['Explore professional expense deductions', 'Consider timing of major purchases']
      });
    }
    
  } catch (error) {
    console.error('Parsing error:', error);
    // Fallback impact
    impacts.push({
      category: 'AI Analysis',
      impact: 'neutral',
      severity: 'medium', 
      description: aiResponse.substring(0, 300),
      constitutionalRights: ['Article 201 (Fair Taxation)'],
      recommendations: ['Review the analysis carefully'],
      loopholes: ['Consult with professionals']
    });
  }
  
  return impacts;
}

function parseEmailDraft(aiResponse: string, userProfile: any): any {
  const lines = aiResponse.split('\n');
  let subject = '';
  let body = '';
  let foundSubject = false;
  
  for (const line of lines) {
    if (line.toLowerCase().includes('subject:') && !foundSubject) {
      subject = line.replace(/subject:/i, '').trim();
      foundSubject = true;
    } else if (foundSubject) {
      body += line + '\n';
    }
  }
  
  return {
    subject: subject || `Finance Bill 2025 Concerns - ${userProfile.occupation}`,
    body: body.trim() || aiResponse,
    to: []
  };
}

function extractField(text: string, fieldName: string): string | null {
  const regex = new RegExp(`${fieldName}:?\\s*([^\\n]+)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}
