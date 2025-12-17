import sys
import json
import os
import re
from groq import Groq

def extract_json(text):
    """Extracts the first valid JSON object from a given text string."""
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return match.group(0)
    return None

def analyze_cross_feedback(feedback_forms):
    # Handle both old format (with 'questions') and new format (with 'responses')
    formatted_feedback = ""
    for i, form in enumerate(feedback_forms, 1):
        formatted_feedback += f"\n### Customer Review {i} ###\n"
        if 'responses' in form:
            # New format: form has 'responses' array
            for response in form['responses']:
                question = response.get('question', '')
                answer = response.get('answer', '')
                formatted_feedback += f"- {question}: {answer}\n"
        elif 'questions' in form:
            # Old format: form has 'questions' array
            formatted_feedback += "\n".join([f"- {q['question']}: {q['answer']}" for q in form['questions']])
        formatted_feedback += "\n\n"

    prompt = f"""
You are an expert product strategist specializing in product review analysis. Analyze the following customer product reviews and generate actionable business strategies focused on product improvement, customer satisfaction, and market positioning.

The output **must be a valid JSON** following this exact structure. Focus on product-specific insights:

    JSON format:
    {{
        "summary": {{
            "keyInsights": [
                "Key insight 1 based on product reviews",
                "Key insight 2 based on product reviews",
                "Key insight 3 based on product reviews"
            ],
            "recommendations": [
                "Product improvement recommendation 1",
                "Product improvement recommendation 2",
                "Product improvement recommendation 3"
            ],
            "actionItems": [
                "Actionable item 1 for product enhancement",
                "Actionable item 2 for customer satisfaction",
                "Actionable item 3 for market positioning"
            ],
            "productStrengths": [
                "Strength 1 identified from reviews",
                "Strength 2 identified from reviews"
            ],
            "productWeaknesses": [
                "Weakness 1 that needs attention",
                "Weakness 2 that needs improvement"
            ],
            "customerSentiment": "overall positive/negative/mixed",
            "priorityAreas": [
                "High priority area 1",
                "High priority area 2"
            ]
        }},
        "strategies": [
            {{
                "id": 1,
                "title": "Product Quality Enhancement",
                "status": "ACTIVE",
                "year": "2025",
                "category": "product_improvement",
                "actions": [
                    {{
                        "description": "Specific action based on reviews",
                        "completed": false,
                        "priority": "high"
                    }}
                ]
            }},
            {{
                "id": 2,
                "title": "Pricing Strategy Optimization",
                "status": "ACTIVE",
                "year": "2025",
                "category": "pricing",
                "actions": [
                    {{
                        "description": "Action based on price feedback",
                        "completed": false,
                        "priority": "medium"
                    }}
                ]
            }},
            {{
                "id": 3,
                "title": "Customer Experience Improvement",
                "status": "ACTIVE",
                "year": "2025",
                "category": "customer_experience",
                "actions": [
                    {{
                        "description": "Action to improve customer experience",
                        "completed": false,
                        "priority": "high"
                    }}
                ]
            }}
        ],
        "metrics": [
            {{
                "label": "Critical Issues",
                "count": 0,
                "bgColor": "bg-red-100"
            }},
            {{
                "label": "High Priority",
                "count": 0,
                "bgColor": "bg-orange-100"
            }},
            {{
                "label": "Improvement Opportunities",
                "count": 0,
                "bgColor": "bg-blue-100"
            }}
        ],
        "tasks": [
            {{
                "label": "Product Improvements",
                "count": 0,
                "actionType": "Enhancement",
                "iconColor": "bg-green-100"
            }},
            {{
                "label": "Customer Concerns",
                "count": 0,
                "actionType": "Address",
                "iconColor": "bg-yellow-100"
            }}
        ]
    }}

    Analyze the product reviews focusing on:
    - Product quality, design, and functionality
    - Pricing and value perception
    - Customer satisfaction and pain points
    - Areas for improvement
    - Competitive advantages and disadvantages
    - Market positioning opportunities

    Ensure strategies are product-review focused and actionable.

    Feedback Data:
    {formatted_feedback}
    """

    api_key = os.getenv("GROQ_API")
    if not api_key:
        return {"error": "API key not found"}

    try:
        client = Groq(api_key=api_key)
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an expert product strategist. Analyze product reviews and generate actionable business strategies. Always return valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.4
        )

        # Debugging: only print if needed
        # print("Raw AI Response:", chat_completion)

        if not chat_completion.choices or len(chat_completion.choices) == 0:
            return {"error": "No valid response from AI"}

        raw_response = chat_completion.choices[0].message.content
        
        # Try to extract JSON
        json_text = extract_json(raw_response)
        if json_text:
            try:
                return json.loads(json_text)
            except json.JSONDecodeError:
                pass
        
        # If extraction failed, try to parse the raw response directly
        try:
            return json.loads(raw_response)
        except json.JSONDecodeError:
            return {"error": "AI did not return valid JSON", "raw_response": raw_response[:500]}

    except json.JSONDecodeError:
        return {"error": "Invalid JSON output from AI"}
    except Exception as e:
        return {"error": f"AI API error: {str(e)}"}

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        
        # Handle both single form and multiple forms
        if isinstance(input_data, list):
            if len(input_data) < 1:
                print(json.dumps({"error": "No feedback data provided"}))
                sys.exit(1)
        elif isinstance(input_data, dict):
            # Single form, wrap in list
            input_data = [input_data]

        analysis_result = analyze_cross_feedback(input_data)
        print(json.dumps(analysis_result, indent=2))

    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
        sys.exit(1)

    except Exception as e:
        print(json.dumps({"error": f"Unexpected error: {str(e)}"}))
        sys.exit(1)
