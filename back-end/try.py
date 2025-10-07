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
            return {"error": "AI response did not contain valid JSON"}
    return {"error": "No JSON found in AI response"}

def analyze_feedback(feedback_data):
    formatted_feedback = "\n".join([f"- {q['question']}: {q['answer']}" for q in feedback_data])

    prompt = f"""
Analyze the following customer feedback responses and generate structured insights. Extract trends based on sentiment, urgency, and common themes.whenever we have a customer feedback. annalyse the answers and fill the following JSON format.
Return **only JSON**—no explanations, introductions, or additional text.

JSON format:
{{
    "positiveResponses": {{
      "total": 450,
      "percentageChange": "5%",
      "chartData": {{
        "labels": ["1", "2", "3", "4"],
        "values": [120, 150, 110, 70]
      }}
    }},
    "negativeResponses": {{
      "negativeResponses": [
        {{ "date": "01-01-2024", "value": 30 }},
        {{ "date": "02-01-2024", "value": 45 }},
        {{ "date": "03-01-2024", "value": 40 }},
        {{ "date": "04-01-2024", "value": 50 }},
        {{ "date": "05-01-2024", "value": 60 }}
      ],
      "percentageChange": -5.2,
      "totalNegative": 225
    }},
    "responseTrend": {{
      "trendData": [
        {{ "date": "2025-02-08T12:00:00Z", "value": 70 }},
        {{ "date": "2025-02-08T12:02:00Z", "value": 52 }},
        {{ "date": "2025-02-08T12:04:00Z", "value": 50 }}
      ]
    }},
    "sentiment": {{
      "sentiment": {{
        "positive": 120,
        "negative": 45,
        "neutral": 85
      }}
    }},
    "salesRefund": {{
      "labels": ["12-01-2022", "01-01-2023", "02-01-2023", "03-01-2023", "04-01-2023", "05-01-2023"],
      "stack1": [6200, 9200, 6600, 8800, 5200, 9200],
      "stack2": [-4000, -2600, -5350, -4000, -7500, -2000],
      "totalSales": 6796,
      "refundRate": -34
    }},
    "reasons": {{
        "totalRefunds": 420,
        "refundRate": 25,
        "reasons": [
          {{ "label": "Damaged Product", "count": 150 }},
          {{ "label": "Late Delivery", "count": 120 }},
          {{ "label": "Wrong Item", "count": 90 }},
          {{ "label": "Changed Mind", "count": 60 }}
        ]
      }},
    "recentActivity": {{
      "feedbacks": [
        {{ "title": "Long response time" }},
        {{ "title": "Checkout process is confusing" }}
      ],
      "highPriority": [
        {{ "title": "Payment issues" }},
        {{ "title": "Login failures" }}
      ]
    }},
    "customers": [
    {{
      "id": "0",
      "name": "Alex Shatov",
      "feedback": "Great service!"
    }},
    {{
      "id": "1",
      "name": "Philip Harbach",
      "feedback": "Quick response and friendly support!"
    }},
    {{
      "id": "2",
      "name": "Mirko Fisuk",
      "feedback": "I had some issues, but they were resolved fast."
    }},
    {{
      "id": "3",
      "name": "Olga Semklo",
      "feedback": "Amazing experience! Highly recommended."
    }},
    {{
      "id": "4",
      "name": "Burak Long",
      "feedback": "Good but room for improvement."
    }}
  ]
}}

Make sure the response follows **exactly** the JSON format above. Only return the JSON output—no explanations, comments, or extra text.
"""

    # Initialize Groq AI
    api_key = os.getenv("GROQ_API")
    if not api_key:
        return {"error": "Missing GROQ_API key. Set the environment variable or pass it explicitly."}
    
    client = Groq(api_key=api_key) 

    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "system", "content": prompt},
                      {"role": "user", "content": formatted_feedback}],
            temperature=0.2
        )
        result_text = response.choices[0].message.content
        return extract_json(result_text)

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        # Validate that the input is passed correctly as a JSON string
        if len(sys.argv) < 2:
            print(json.dumps({"error": "Missing input data. Please provide JSON formatted data as a command-line argument."}))
            sys.exit(1)

        # Parse the input JSON
        input_data = json.loads(sys.argv[1])

        # Check if the "questions" key is present
        if "questions" not in input_data:
            print(json.dumps({"error": "Invalid input format. Ensure 'questions' key is present with an array of questions and answers."}))
            sys.exit(1)

        # Proceed with analyzing the feedback
        feedback_data = input_data["questions"]
        output = analyze_feedback(feedback_data)
        print(json.dumps(output, indent=2))  # Ensure only valid JSON is printed

    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON format. Please ensure the input is valid JSON."}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
