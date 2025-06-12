
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
    const { userProfile, billContent, analysisType } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPEN_AI_API');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (analysisType === 'multi_perspective') {
      systemPrompt = `You are a constitutional expert analyzing Kenya's Finance Bill 2025 from multiple perspectives. You MUST provide exactly 5 different analytical perspectives:

1. Constitutional & Legal Perspective - Focus on Articles 201, 33, 37, and Chapter 6
2. Economic & Financial Perspective - Direct monetary impacts and financial implications  
3. Professional & Career Perspective - Profession-specific impacts and opportunities
4. Social & Community Perspective - Broader societal and community effects
5. Long-term Strategic Perspective - Future implications and positioning

For each perspective, provide:
- Specific impact assessment (positive/negative/neutral)
- Severity level (low/medium/high)
- Detailed description with concrete examples
- Relevant constitutional rights
- Actionable recommendations
- Legal strategies and loopholes

Use the Finance Bill content provided to give specific, detailed analysis grounded in actual provisions.`;

      userPrompt = `Analyze the Finance Bill 2025 impact for a ${userProfile.occupation} in ${userProfile.location} with ${userProfile.incomeLevel} income from exactly 5 perspectives.

User Profile:
- Occupation: ${userProfile.occupation}
- Income: ${userProfile.incomeLevel}
- Location: ${userProfile.location}
- Property Owner: ${userProfile.propertyOwner}
- Business Owner: ${userProfile.businessOwner}
- Transport: ${userProfile.transport?.join(', ')}
- Consumption: ${userProfile.consumptionHabits?.join(', ')}

${billContent ? `Finance Bill Content:\n${billContent}` : 'Use general Finance Bill 2025 knowledge.'}

Provide detailed analysis from all 5 required perspectives with specific examples and actionable insights.`;

    } else if (analysisType === 'clarifying_questions') {
      systemPrompt = `You are an expert questionnaire designer for financial policy analysis. Generate 8-10 detailed clarifying questions that will help provide more accurate Finance Bill 2025 impact analysis.

Focus on:
- Specific financial behaviors and dependencies
- Digital service usage patterns  
- Professional tool and platform usage
- Import/export activities
- Investment and savings patterns
- Family and dependent considerations
- Future planning and major purchases

Make questions specific, actionable, and directly relevant to Finance Bill impacts.`;

      userPrompt = `Generate detailed clarifying questions for a ${userProfile.occupation} in ${userProfile.location} with ${userProfile.incomeLevel} income to better analyze Finance Bill 2025 impacts.

Consider their profile:
- Occupation: ${userProfile.occupation}
- Income Level: ${userProfile.incomeLevel}
- Location: ${userProfile.location}
- Business Owner: ${userProfile.businessOwner}
- Property Owner: ${userProfile.propertyOwner}

Generate questions that will reveal specific ways the Finance Bill will affect them personally and professionally.`;
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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    const aiResponse = data.choices[0].message.content;

    if (analysisType === 'multi_perspective') {
      const impacts = parseMultiPerspectiveAnalysis(aiResponse, userProfile);
      return new Response(JSON.stringify({ impacts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (analysisType === 'clarifying_questions') {
      const questions = parseQuestions(aiResponse);
      return new Response(JSON.stringify({ questions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in enhanced analysis:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function parseMultiPerspectiveAnalysis(aiResponse: string, userProfile: any): any[] {
  const impacts = [];
  const sections = aiResponse.split(/\d+\.\s+/).filter(section => section.length > 50);
  
  const perspectives = [
    "Constitutional & Legal Perspective",
    "Economic & Financial Perspective", 
    "Professional & Career Perspective",
    "Social & Community Perspective",
    "Long-term Strategic Perspective"
  ];

  sections.forEach((section, index) => {
    if (index < perspectives.length) {
      impacts.push({
        category: perspectives[index],
        impact: extractImpactType(section),
        severity: extractSeverity(section),
        description: section.substring(0, 300).trim(),
        constitutionalRights: extractConstitutionalRights(section),
        recommendations: extractRecommendations(section),
        loopholes: extractLoopholes(section)
      });
    }
  });

  // Ensure we have exactly 5 perspectives
  while (impacts.length < 5) {
    impacts.push({
      category: perspectives[impacts.length],
      impact: 'neutral',
      severity: 'medium',
      description: `Analysis from ${perspectives[impacts.length].toLowerCase()} perspective requires further assessment.`,
      constitutionalRights: ['Article 201 (Fair Taxation)'],
      recommendations: ['Seek professional advice'],
      loopholes: ['Review available options']
    });
  }

  return impacts.slice(0, 5);
}

function parseQuestions(aiResponse: string): string[] {
  const lines = aiResponse.split('\n').filter(line => 
    line.trim().length > 10 && 
    (line.includes('?') || line.match(/^\d+\./) || line.includes('-'))
  );
  
  return lines.map(line => 
    line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim()
  ).filter(q => q.includes('?'));
}

function extractImpactType(text: string): 'positive' | 'negative' | 'neutral' {
  if (text.toLowerCase().includes('negative') || text.toLowerCase().includes('increase cost') || text.toLowerCase().includes('burden')) {
    return 'negative';
  } else if (text.toLowerCase().includes('positive') || text.toLowerCase().includes('benefit') || text.toLowerCase().includes('opportunity')) {
    return 'positive';
  }
  return 'neutral';
}

function extractSeverity(text: string): 'low' | 'medium' | 'high' {
  if (text.toLowerCase().includes('high') || text.toLowerCase().includes('severe') || text.toLowerCase().includes('significant')) {
    return 'high';
  } else if (text.toLowerCase().includes('low') || text.toLowerCase().includes('minor') || text.toLowerCase().includes('minimal')) {
    return 'low';
  }
  return 'medium';
}

function extractConstitutionalRights(text: string): string[] {
  const rights = [];
  if (text.includes('201') || text.toLowerCase().includes('taxation')) {
    rights.push('Article 201 (Fair Taxation)');
  }
  if (text.includes('33') || text.toLowerCase().includes('expression')) {
    rights.push('Article 33 (Freedom of Expression)');
  }
  if (text.includes('37') || text.toLowerCase().includes('petition')) {
    rights.push('Article 37 (Right to Petition)');
  }
  if (text.includes('43') || text.toLowerCase().includes('economic')) {
    rights.push('Article 43 (Economic Rights)');
  }
  if (rights.length === 0) {
    rights.push('Article 201 (Fair Taxation)');
  }
  return rights;
}

function extractRecommendations(text: string): string[] {
  const recommendations = [];
  if (text.toLowerCase().includes('petition') || text.toLowerCase().includes('legal')) {
    recommendations.push('Consider legal consultation');
  }
  if (text.toLowerCase().includes('budget') || text.toLowerCase().includes('plan')) {
    recommendations.push('Adjust financial planning');
  }
  if (text.toLowerCase().includes('association') || text.toLowerCase().includes('collective')) {
    recommendations.push('Join professional associations');
  }
  if (recommendations.length === 0) {
    recommendations.push('Stay informed about changes');
  }
  return recommendations;
}

function extractLoopholes(text: string): string[] {
  const loopholes = [];
  if (text.toLowerCase().includes('deduction') || text.toLowerCase().includes('exemption')) {
    loopholes.push('Explore available deductions');
  }
  if (text.toLowerCase().includes('timing') || text.toLowerCase().includes('strategic')) {
    loopholes.push('Strategic timing of transactions');
  }
  if (loopholes.length === 0) {
    loopholes.push('Review compliance options');
  }
  return loopholes;
}
