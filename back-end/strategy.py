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
    formatted_feedback = ""
    for i, form in enumerate(feedback_forms, 1):
        formatted_feedback += f"\n### Feedback Form {i} ###\n"
        formatted_feedback += "\n".join([f"- {q['question']}: {q['answer']}" for q in form['questions']])
        formatted_feedback += "\n\n"

    prompt = f"""
    Analyze the following multiple feedback forms and generate strategic recommendations whenever we have a customer feedback. Analyze the answers and fill the following JSON format. 
    The output **must be a valid JSON** following this exact structure:

    JSON format:
    {{
        "strategies": [
            {{
                "id": 1,
                "title": "Reduce Plastic Usage",
                "status": "ACTIVE",
                "year": "2025",
                "actions": [
                    {{
                        "description": "30% less PET bottles",
                        "completed": true
                    }},
                    {{
                        "description": "40% less plastic bags",
                        "completed": true
                    }}
                ]
            }},
            {{
                "id": 2,
                "title": "Enhance Customer Support",
                "status": "INACTIVE",
                "year": "2024",
                "actions": [
                    {{
                        "description": "24/7 chat support",
                        "completed": false
                    }},
                    {{
                        "description": "Automated responses",
                        "completed": true
                    }}
                ]
            }},
            {{
                "id": 3,
                "title": "Optimize Pricing Strategy",
                "status": "ACTIVE",
                "year": "2025",
                "actions": [
                    {{
                        "description": "Seasonal Discounts",
                        "completed": true
                    }},
                    {{
                        "description": "Customer Loyalty Program",
                        "completed": false
                    }}
                ]
            }}
        ],
        "metrics": [
            {{
                "label": "Immediate Action",
                "count": 7,
                "bgColor": "bg-purple-100"
            }},
            {{
                "label": "High Priority",
                "count": 3,
                "bgColor": "bg-pink-100"
            }},
            {{
                "label": "Potential Issues",
                "count": 2,
                "bgColor": "bg-blue-100"
            }}
        ],
        
        "tasks": [
            {{
                "label": "Target's Completed",
                "count": 4,
                "actionType": "Report",
                "iconColor": "bg-blue-100"
            }},
            {{
                "label": "Issue's Resolved",
                "count": 2,
                "actionType": "Report",
                "iconColor": "bg-red-100"
            }}
        ]
    }}

    Ensure that the response maintains this structure while incorporating meaningful insights based on the feedback provided.

    Feedback Data:
    {formatted_feedback}
    """

    api_key = os.getenv("GROQ_API")
    if not api_key:
        return {"error": "API key not found"}

    try:
        client = Groq(api_key=api_key)
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192"
        )

        print("Raw AI Response:", chat_completion)  # Debugging print

        if not chat_completion.choices or len(chat_completion.choices) == 0:
            return {"error": "No valid response from AI"}

        raw_response = chat_completion.choices[0].message.content
        json_text = extract_json(raw_response)

        if not json_text:
            return {"error": "AI did not return valid JSON"}

        return json.loads(json_text)

    except json.JSONDecodeError:
        return {"error": "Invalid JSON output from AI"}
    except Exception as e:
        return {"error": f"AI API error: {str(e)}"}

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        if not input_data or len(input_data) < 2:
            print(json.dumps({"error": "Not enough feedback forms for analysis"}))
            sys.exit(1)

        analysis_result = analyze_cross_feedback(input_data)
        print(json.dumps(analysis_result, indent=2))

    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
        sys.exit(1)

    except Exception as e:
        print(json.dumps({"error": f"Unexpected error: {str(e)}"}))
        sys.exit(1)
