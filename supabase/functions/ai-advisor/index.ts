import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Received request with context:", JSON.stringify(userContext, null, 2));

    // Build context-aware system prompt
    const systemPrompt = buildSystemPrompt(userContext);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI Advisor error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildSystemPrompt(userContext: any): string {
  const basePrompt = `You are a helpful AI Investment Advisor for Bajaj Capital, a leading wealth management firm in India with over ₹15,000 Cr+ assets under management.

IMPORTANT COMPLIANCE NOTES:
- You provide general investment education and guidance, NOT personalized investment advice
- All suggestions are for illustration purposes only
- Past performance does not guarantee future returns
- Always recommend consulting with a qualified financial advisor for specific decisions

YOUR PERSONALITY:
- Professional yet warm and approachable
- Knowledgeable about Indian financial markets and investment products
- Patient in explaining complex concepts simply
- Encouraging but realistic about investment expectations

CAPABILITIES:
- Answer questions about investment strategies and concepts
- Explain different asset classes (Mutual Funds, Stocks, Bonds, FDs, etc.)
- Discuss goal-based investing approaches
- Provide general market insights
- Help users understand their portfolio composition`;

  // Add user-specific context if available
  if (userContext) {
    let contextSection = "\n\nUSER CONTEXT (use this to personalize responses):";
    
    if (userContext.profileType) {
      contextSection += `\n- Investor Profile: ${userContext.profileType}`;
    }
    if (userContext.confidence) {
      contextSection += `\n- Profile Confidence: ${userContext.confidence}%`;
    }
    if (userContext.goals && userContext.goals.length > 0) {
      contextSection += `\n- Financial Goals: ${userContext.goals.map((g: any) => 
        `${g.goal_name} (₹${formatIndianNumber(g.target_amount)} in ${g.timeline_years} years)`
      ).join(', ')}`;
    }
    if (userContext.scores) {
      contextSection += `\n- Risk Profile Scores: ${JSON.stringify(userContext.scores)}`;
    }
    
    return basePrompt + contextSection;
  }

  return basePrompt;
}

function formatIndianNumber(num: number): string {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(2) + ' Cr';
  } else if (num >= 100000) {
    return (num / 100000).toFixed(2) + ' L';
  }
  return num.toLocaleString('en-IN');
}
