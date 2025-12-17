import sys
import json
import os
import re
from groq import Groq

def extract_json(text):
    """Extracts valid JSON from a response string."""
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            json_start = text.find('{')
            json_end = text.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                try:
                    return json.loads(text[json_start:json_end])
                except:
                    pass
    return None

def generate_followup_questions(question_data, answer, all_responses):
    """
    Generate follow-up questions based on user's answer to a question.
    
    Args:
        question_data: The question object (questionId, question, inputType, etc.)
        answer: The user's answer
        all_responses: All previous responses to understand context
    """
    
    # Build context from all responses
    context = "\n".join([
        f"Q: {r.get('question', '')}\nA: {r.get('answer', '')}" 
        for r in all_responses
    ])
    
    # Analyze the answer to determine what kind of follow-up is needed
    answer_lower = str(answer).lower()
    
    prompt = f"""
You are an expert at creating contextual follow-up questions for feedback forms. Analyze the user's EXACT answer and generate 1-2 highly relevant follow-up questions that directly address what they said.

Current Question: "{question_data.get('question', '')}"
User's Answer: "{answer}"

Previous responses for context:
{context}

CRITICAL: Generate follow-up questions that are SPECIFICALLY tailored to the EXACT answer given. The follow-up must directly relate to what the user said:

EXAMPLES:
- If answer is "Too High" or "price was high" or "expensive" → Generate: "What price range do you think it should fall in?" with radio options ["$50-75", "$75-100", "$100-150", "Above $150"]
- If answer is "Too Low" → Generate: "What price range would be more appropriate?"
- If answer is "Just Right" → Generate: "Would you recommend this product to others at this price?"
- If answer mentions "poor" or "bad" or "uncomfortable" → Generate: "What specific aspects need improvement?" with relevant options
- If answer mentions "excellent" or "great" or "good" → Generate: "What did you like most about it?" with specific options
- If answer is negative → Generate questions to understand WHY and WHAT should be changed
- If answer is positive → Generate questions to understand WHAT specifically they liked

Generate 1-2 follow-up questions that:
1. DIRECTLY address what the user said in their answer (not generic questions)
2. Ask for SPECIFIC, actionable information
3. Use appropriate input types (radio for choices, textarea for details, text for short answers)
4. Help the business understand the user's perspective better

Return ONLY a valid JSON object with this structure (no markdown, just pure JSON):

    {{
        "followUpQuestions": [
            {{
                "questionId": "q1_f1",
                "question": "What price range do you think it should fall in?",
                "inputType": "radio",
                "options": ["$50-75", "$75-100", "$100-150", "Above $150"],
                "required": true,
                "order": 1
            }}
        ]
    }}

CRITICAL RULES:
- Generate 1-2 follow-up questions MAXIMUM
- Questions MUST directly address what the user said in their answer
- If they mentioned price being high → ask about acceptable price range
- If they mentioned something negative → ask what should be improved
- If they mentioned something positive → ask what specifically they liked
- Keep questions concise, specific, and actionable
- Return ONLY the JSON, no explanations, no markdown formatting
"""

    api_key = os.getenv("GROQ_API")
    if not api_key:
        return {"error": "Missing GROQ_API key"}
    
    client = Groq(api_key=api_key)

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are an expert at creating contextual follow-up questions. Always return valid JSON only. Generate questions that directly address what the user said in their answer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )
        
        result_text = response.choices[0].message.content
        
        # Clean the response
        result_text = re.sub(r'```json\s*', '', result_text)
        result_text = re.sub(r'```\s*', '', result_text)
        result_text = result_text.strip()
        
        json_data = extract_json(result_text)
        
        if json_data:
            return json_data
        else:
            return {"error": "Failed to parse AI response", "raw_response": result_text}

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"error": "Missing input data"}))
            sys.exit(1)

        input_data = json.loads(sys.argv[1])
        
        question_data = input_data.get("question")
        answer = input_data.get("answer")
        all_responses = input_data.get("allResponses", [])
        
        result = generate_followup_questions(question_data, answer, all_responses)
        print(json.dumps(result, indent=2))

    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

