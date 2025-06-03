
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // This function can be scheduled to run daily to check for Finance Bill updates
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    
    if (!perplexityApiKey) {
      console.log('Perplexity API key not configured, skipping update check');
      return new Response(JSON.stringify({ message: 'No API key configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a constitutional expert monitoring Kenya\'s Finance Bill 2025. Provide factual updates only.'
          },
          {
            role: 'user',
            content: 'What are the latest developments regarding Kenya\'s Finance Bill 2025? Include any amendments, court cases, or public reactions in the last 24 hours.'
          }
        ],
        temperature: 0.2,
        max_tokens: 500,
        search_recency_filter: 'day',
      }),
    });

    const data = await response.json();
    const updates = data.choices[0].message.content;

    // Log the updates (in a real app, you might store these in the database)
    console.log('Finance Bill 2025 Updates:', updates);

    return new Response(JSON.stringify({ 
      updates,
      timestamp: new Date().toISOString(),
      message: 'Finance Bill updates checked successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error checking Finance Bill updates:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
