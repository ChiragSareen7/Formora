import sys
import json
import os
import re
from groq import Groq

def extract_json(text):
    """Extracts valid JSON from a response string."""
    # Try to find JSON object in the response
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            # Try to extract just the JSON part
            json_start = text.find('{')
            json_end = text.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                try:
                    return json.loads(text[json_start:json_end])
                except:
                    pass
    return None

def generate_form_from_description(business_description):
    """
    Generate a form structure from business description using AI.
    Example: "Nike wants feedback on their new shoe line"
    """
    
    prompt = f"""
You are an expert form builder. A business wants to create a feedback form based on this description:

"{business_description}"

Generate a comprehensive feedback form with relevant questions. The form should include:
1. Questions about different aspects (comfort, price, looks, quality, etc.)
2. Appropriate input types (radio buttons for ratings, textarea for detailed feedback, etc.)
3. Options for multiple choice questions

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just pure JSON):

{{
    "title": "Feedback Form Title",
    "description": "Brief description of the form",
    "questions": [
        {{
            "questionId": "q1",
            "question": "How would you rate the comfort?",
            "inputType": "radio",
            "options": ["Excellent", "Good", "Average", "Poor"],
            "required": true,
            "order": 1
        }},
        {{
            "questionId": "q2",
            "question": "What is your opinion on the price?",
            "inputType": "radio",
            "options": ["Too High", "Just Right", "Too Low"],
            "required": true,
            "order": 2
        }},
        {{
            "questionId": "q3",
            "question": "How would you rate the overall looks?",
            "inputType": "radio",
            "options": ["Excellent", "Good", "Average", "Poor"],
            "required": true,
            "order": 3
        }},
        {{
            "questionId": "q4",
            "question": "Any additional comments?",
            "inputType": "textarea",
            "required": false,
            "placeholder": "Share your thoughts...",
            "order": 4
        }}
    ]
}}

Important:
- Generate 4-6 relevant questions based on the business description
- Use appropriate input types: "radio", "textarea", "text", "select", "rating"
- Make sure questionId follows pattern "q1", "q2", "q3", etc.
- Include relevant options for radio/select questions
- Return ONLY the JSON, no explanations or markdown formatting
"""

    api_key = os.getenv("GROQ_API")
    if not api_key:
        return {"error": "Missing GROQ_API key. Set the environment variable."}
    
    client = Groq(api_key=api_key)

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are an expert form builder. Always return valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        
        result_text = response.choices[0].message.content
        
        # Clean the response - remove markdown code blocks if present
        result_text = re.sub(r'```json\s*', '', result_text)
        result_text = re.sub(r'```\s*', '', result_text)
        result_text = result_text.strip()
        
        json_data = extract_json(result_text)
        
        if json_data:
            return json_data
        else:
            return {"error": "Failed to parse AI response as JSON", "raw_response": result_text}

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"error": "Missing business description"}))
            sys.exit(1)

        business_description = sys.argv[1]
        result = generate_form_from_description(business_description)
        print(json.dumps(result, indent=2))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

