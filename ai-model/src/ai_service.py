from config.settings import API_KEY
import google.generativeai as genai

# Configure the API key once at the top-level
if not API_KEY or not isinstance(API_KEY, str):
    raise EnvironmentError("Missing or invalid API key. Please set 'API_KEY' in the configuration properly.")
genai.configure(api_key=API_KEY)


def get_response(prompt: str) -> str:
    """
    Generates a response using Google's Gemini AI model.
    Parameters:
        prompt (str): The input text for which a response is needed.
    Returns:
        str: The generated response from the AI model or an error message.
    """
    try:

        # Validate input before any processing
        if not isinstance(prompt, str) or not prompt.strip():
            raise ValueError("Prompt must be a non-empty string.")

        # Initialize the Gemini model with error handling
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
        except genai.GenAIError as model_error:
            return f"Model Initialization Error: {str(model_error)}"

        # Generate content based on the prompt
        response = model.generate_content(prompt)

        # Validate the response if it exists
        if response and hasattr(response, "text"):
            return response.text.strip()
        else:
            return "Error: Invalid response format or missing 'text' attribute."
    except genai.GenAIError as api_error:
        return f"API Error: {str(api_error)}"
    except ValueError as val_error:
        return f"Input Error: {str(val_error)}"
    except Exception as general_error:
        return f"Unexpected Error: {str(general_error)}"


# Example usage
if __name__ == "__main__":
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content("Tell me a good joke")
        if response and hasattr(response, "text"):
            print(response.text.strip())
        else:
            print("Error: No response or invalid response from the model.")
    except genai.GenAIError as genai_error:
        print(f"API Error: {str(genai_error)}")
    except Exception as error:
        print(f"Unexpected Error: {str(error)}")
