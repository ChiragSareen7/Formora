import sys
import json
import os
import re
from groq import Groq

def extract_json(text):
    """Extracts valid JSON from a response string."""
    # Try to find JSON object
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass
    
    # Try to find JSON array
    match = re.search(r'\[.*\]', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass
    
    return {"error": "AI response did not contain valid JSON", "raw_response": text[:500]}

def generate_ai_report(form_data, submissions_data):
    """Generate AI-powered report from form submissions."""
    
    api_key = os.getenv("GROQ_API")
    if not api_key:
        return {"error": "GROQ_API key not found"}

    # Format submissions for analysis
    submissions_text = ""
    for idx, submission in enumerate(submissions_data, 1):
        submissions_text += f"\n\nSubmission #{idx}:\n"
        for response in submission.get('responses', []):
            question = response.get('question', '')
            answer = response.get('answer', '')
            submissions_text += f"  Q: {question}\n  A: {answer}\n"

    prompt = f"""
You are an expert data analyst specializing in customer feedback analysis. Analyze the following product review form submissions and generate a comprehensive AI-powered report.

Form Title: {form_data.get('title', 'Product Review Form')}
Form Description: {form_data.get('description', '')}
Total Submissions: {len(submissions_data)}

Submissions Data:
{submissions_text}

Generate a detailed report in the following JSON format. Focus on:
1. Key insights and trends from customer responses
2. Sentiment analysis (positive, negative, neutral)
3. Common themes and patterns
4. Areas of strength and improvement
5. Actionable recommendations
6. Statistical summaries

Return ONLY valid JSON (no markdown, no explanations):

{{
    "executiveSummary": {{
        "overallSentiment": "positive/negative/neutral",
        "keyFindings": [
            "Finding 1",
            "Finding 2",
            "Finding 3"
        ],
        "totalSubmissions": {len(submissions_data)},
        "responseRate": "high/medium/low"
    }},
    "sentimentAnalysis": {{
        "positive": {{
            "count": 0,
            "percentage": 0,
            "examples": ["example 1", "example 2"]
        }},
        "negative": {{
            "count": 0,
            "percentage": 0,
            "examples": ["example 1", "example 2"]
        }},
        "neutral": {{
            "count": 0,
            "percentage": 0,
            "examples": ["example 1", "example 2"]
        }}
    }},
    "keyInsights": [
        {{
            "insight": "Insight description",
            "category": "price/quality/design/service/etc",
            "impact": "high/medium/low",
            "evidence": "Supporting data or quotes"
        }}
    ],
    "trends": [
        {{
            "trend": "Trend description",
            "direction": "increasing/decreasing/stable",
            "significance": "high/medium/low"
        }}
    ],
    "strengths": [
        "Strength 1",
        "Strength 2",
        "Strength 3"
    ],
    "improvements": [
        {{
            "area": "Area needing improvement",
            "priority": "high/medium/low",
            "recommendation": "Specific recommendation",
            "impact": "Expected impact if addressed"
        }}
    ],
    "recommendations": [
        {{
            "recommendation": "Actionable recommendation",
            "priority": "high/medium/low",
            "rationale": "Why this is important",
            "expectedOutcome": "Expected result"
        }}
    ],
    "statistics": {{
        "averageRating": 0,
        "satisfactionScore": 0,
        "responseDistribution": {{
            "excellent": 0,
            "good": 0,
            "average": 0,
            "poor": 0
        }}
    }}
}}

Important: Return ONLY the JSON object, no markdown formatting, no code blocks, no explanations.
"""

    try:
        client = Groq(api_key=api_key)
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an expert data analyst. Always return valid JSON only, no markdown."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.3
        )

        if not chat_completion.choices or len(chat_completion.choices) == 0:
            return {"error": "No valid response from AI"}

        raw_response = chat_completion.choices[0].message.content
        json_response = extract_json(raw_response)

        if "error" in json_response:
            return json_response

        return json_response

    except Exception as e:
        return {"error": f"AI API error: {str(e)}"}

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        form_data = input_data.get('form', {})
        submissions_data = input_data.get('submissions', [])
        
        result = generate_ai_report(form_data, submissions_data)
        print(json.dumps(result))
        
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}))
    except Exception as e:
        print(json.dumps({"error": f"Error: {str(e)}"}))

