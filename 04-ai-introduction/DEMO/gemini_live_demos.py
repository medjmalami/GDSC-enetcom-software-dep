"""
=============================================================================
GDSC Enetcom - Software Engineering Department
Session 04: AI Introduction - Live Demos with Google Gemini API
=============================================================================
Prerequisites:
  1. Install dependencies:
     pip install google-genai pydantic

  2. Set your Google AI Studio API key in your terminal/environment:
     - Windows (PowerShell):
         $env:GEMINI_API_KEY="your-api-key-here"
     - Windows (CMD):
         set GEMINI_API_KEY=your-api-key-here
     - Linux / macOS:
         export GEMINI_API_KEY="your-api-key-here"

How to run:
  - Scroll to the bottom of this file (under `if __name__ == "__main__":`).
  - Uncomment the specific demo function you want to execute!
=============================================================================
"""

import os
import json
from typing import Literal
from pydantic import BaseModel, Field

# New official Google GenAI SDK (google-genai)
from google import genai
from google.genai import types

# Initialize client (automatically reads GEMINI_API_KEY from environment)
# You can also pass it explicitly: client = genai.Client(api_key="...")
client = genai.Client(http_options=types.HttpOptions(api_version="v1beta"))
MODEL_ID = "gemini-2.5-flash"


# =============================================================================
# DEMO 1: SETUP AND YOUR FIRST API CALL (Slide 5.1)
# =============================================================================
def demo_1_first_call():
    """
    Minimal first call to Gemini.
    - Sends a raw prompt string via `contents`.
    - Receives a response object and prints `response.text`.
    """
    print("\n--- Running Demo 1: First Call ---")
    response = client.models.generate_content(
        model=MODEL_ID,
        contents="Explain what an LLM is in one sentence.",
    )
    print("Response:\n", response.text)

# =============================================================================
# DEMO 2: PROMPT ENGINEERING: BAD VS. GOOD (Slide 5.2)
# =============================================================================
def demo_2_prompt_engineering():
    """
    Compares an unconstrained vague prompt vs. an engineered prompt
    using system instructions, explicit constraints, and XML-style delimiters.
    """
    sample_text = (
        "Large language models are complex deep neural networks composed of "
        "transformer layers that predict sequential text patterns based on "
        "extensive web scraping datasets. They calculate probability distributions "
        "across a vocabulary of tokens to autocomplete user inputs."
    )

    print("\n--- Running Demo 2: Prompt Engineering ---")

    # 1. Bad Prompt (No role, no constraints, no format)
    print("\n[1] Executing Bad Prompt...")
    bad_response = client.models.generate_content(
        model=MODEL_ID,
        contents=f"summarize this: {sample_text}",
    )
    print("Bad Prompt Output:\n", bad_response.text)

    # 2. Good Prompt (Role + Task + Context + Constraints + Delimiters)
    print("\n[2] Executing Good Prompt...")
    good_response = client.models.generate_content(
        model=MODEL_ID,
        config=types.GenerateContentConfig(
            system_instruction="You are a concise tutor for beginners."
        ),
        contents=f"""Summarize the text inside <text> tags in exactly 3 bullets,
under 15 words each, for someone with no technical background.
<text>
{sample_text}
</text>""",
    )
    print("Good Prompt Output:\n", good_response.text)

# =============================================================================
# DEMO 3: STRUCTURED OUTPUTS - THE 3 LEVELS (Slide 5.3)
# =============================================================================
class Person(BaseModel):
    name: str = Field(description="The full name of the person")
    age: int = Field(description="The age in whole years")
    role: Literal["student", "teacher"] = Field(description="Current role")
    city: str = Field(description="City of residence")


def demo_3_structured_outputs():
    """
    Demonstrates the 3 levels of output reliability:
    - Level 1: Ask nicely in prompt (often wrapped in markdown ```json, fails json.loads)
    - Level 2: JSON Mode (valid JSON syntax, but unpredictable field names/types)
    - Level 3: Schema-enforced decoding with Pydantic (100% deterministic & typed)
    """
    input_text = "Sara is 29 years old and teaches computer science in Tunis."
    print("\n--- Running Demo 3: Structured Outputs ---")

    # --- LEVEL 1: Ask nicely in prompt ---
    print("\n[Level 1] Asking nicely in prompt...")
    lvl1_resp = client.models.generate_content(
        model=MODEL_ID,
        contents=f"Extract name, age, role, city from: '{input_text}'. Return JSON only.",
    )
    print("Raw output:\n", lvl1_resp.text)
    try:
        data = json.loads(lvl1_resp.text)
        print("json.loads() succeeded:", data)
    except Exception as e:
        print("❌ json.loads() failed (likely due to markdown ticks ```json):", e)

    # --- LEVEL 2: JSON Mode (response_mime_type) ---
    print("\n[Level 2] JSON Mode (response_mime_type='application/json')...")
    lvl2_resp = client.models.generate_content(
        model=MODEL_ID,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
        contents=f"Extract name, age, role, city from: '{input_text}'",
    )
    print("Guaranteed raw JSON syntax:\n", lvl2_resp.text)
    try:
        parsed_json = json.loads(lvl2_resp.text)
        print("Parsed JSON keys:", list(parsed_json.keys()))
        print("⚠️ Notice: The model chooses the keys (might pick 'occupation' instead of 'role').")
    except Exception as e:
        print("Error:", e)

    # --- LEVEL 3: Schema-Enforced with Pydantic ---
    print("\n[Level 3] Schema-Enforced Decoding (response_schema=Person)...")
    lvl3_resp = client.models.generate_content(
        model=MODEL_ID,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=Person,
        ),
        contents=f"Extract the person details from: '{input_text}'",
    )
    # The SDK automatically decodes the JSON into your Pydantic class:
    person_obj: Person = lvl3_resp.parsed
    print("✅ Strongly-typed Pydantic instance:", person_obj)
    print(f"Direct access: Name={person_obj.name}, Age={person_obj.age}, Role={person_obj.role}, City={person_obj.city}")


# =============================================================================
# DEMO 4: GENERATION PARAMETERS (TEMPERATURE & LIMITS) (Slide 5.4)
# =============================================================================
def demo_4_generation_parameters():
    """
    Shows the effect of temperature on the same prompt:
    - Temperature 0.0: Deterministic and predictable (great for data extraction)
    - Temperature 1.0: Balanced and natural (great for conversational answers)
    - Temperature 2.0: High entropy, wild creativity and novel tokens
    """
    prompt = "Give me a single unique, catchy name for a specialty coffee shop."
    print("\n--- Running Demo 4: Generation Parameters ---")

    for temp in [0.0, 1.0, 2.0]:
        print(f"\n--- Testing Temperature = {temp} (3 answers, 1 request) ---")
        resp = client.models.generate_content(
            model=MODEL_ID,
            config=types.GenerateContentConfig(
                temperature=temp,
                max_output_tokens=30,  # Caps output length
                candidate_count=3,     # 3 answers in a single request
                thinking_config=types.ThinkingConfig(thinking_budget=0),
            ),
            contents=prompt,
        )
        for i, candidate in enumerate(resp.candidates, 1):
            print(f"  Run {i}: {candidate.content.parts[0].text.strip()}")


# =============================================================================
# DEMO 5.1: TOKEN COUNTING & TELEMETRY (Slide 5.5 - Tab 1)
# =============================================================================
def demo_5_1_count_tokens():
    """
    Demonstrates token counting and inspecting usage metadata (billing tokens).
    """
    word = "unbelievable"
    print("\n--- Running Demo 5.1: Count Tokens & Usage Telemetry ---")

    token_count = client.models.count_tokens(
        model=MODEL_ID,
        contents=word,
    )
    print(f"The word '{word}' is composed of: {token_count.total_tokens} tokens.")

    # Inspect usage telemetry on a real generation request:
    resp = client.models.generate_content(
        model=MODEL_ID,
        contents="Say hello in Arabic and French.",
    )
    print(f"Response: {resp.text.strip()}")
    print("Usage Metadata:", resp.usage_metadata)
    if resp.usage_metadata:
        print(f"  - Prompt tokens: {resp.usage_metadata.prompt_token_count}")
        print(f"  - Candidates (generated) tokens: {resp.usage_metadata.candidates_token_count}")
        print(f"  - Total tokens: {resp.usage_metadata.total_token_count}")


# =============================================================================
# DEMO 5.2: STATELESS API VS. CHAT SESSION (Slide 5.5 - Tab 2)
# =============================================================================
def demo_5_2_stateless_vs_chat():
    """
    Illustrates that raw API calls have NO memory (stateless),
    while `client.chats.create()` maintains and resends conversation history.
    """
    print("\n--- Running Demo 5.2: Stateless vs. Chat Session ---")

    # 1. Stateless calls: Model forgets between HTTP requests
    print("\n[1] Stateless calls (Model forgets):")
    r1 = client.models.generate_content(
        model=MODEL_ID,
        contents="Hi! My name is Mohamed and I study software engineering.",
    )
    print("User: 'Hi! My name is Mohamed...'")
    print(f"Assistant: {r1.text.strip()}")

    r2 = client.models.generate_content(
        model=MODEL_ID,
        contents="What is my name and what do I study?",
    )
    print("User: 'What is my name and what do I study?'")
    print(f"Assistant: {r2.text.strip()}")
    print("❌ The model forgot because no history was resent!")

    # 2. Chat Session: SDK automatically keeps turn history
    print("\n[2] Multi-turn Chat Session (SDK resends history):")
    chat = client.chats.create(model=MODEL_ID)

    c1 = chat.send_message("Hi! My name is Mohamed and I study software engineering.")
    print("User: 'Hi! My name is Mohamed...'")
    print(f"Assistant: {c1.text.strip()}")

    c2 = chat.send_message("What is my name and what do I study?")
    print("User: 'What is my name and what do I study?'")
    print(f"Assistant: {c2.text.strip()}")
    print("✅ The model remembers because the chat session manages conversation history!")


# =============================================================================
# DEMO 5.3: GROUNDING WITH CONTEXT (Slide 5.5 - Tab 3)
# =============================================================================
def demo_5_3_grounding_context():
    """
    Demonstrates how injecting specific context stops hallucinations.
    """
    question = "What is the return policy for GDSC Store laptops?"
    print("\n--- Running Demo 5.3: Grounding with Context ---")

    # 1. Without context: Model might hallucinate a generic policy
    print("\n[1] Without Context (High Hallucination Risk):")
    r_unsupported = client.models.generate_content(
        model=MODEL_ID,
        contents=question,
    )
    print("Assistant:\n", r_unsupported.text.strip())

    # 2. Grounded with Context: Model extracts strictly from provided facts
    print("\n[2] Grounded with Injected Context:")
    context_doc = (
        "GDSC Store Policy Document (Updated 2026): Laptops may be returned strictly "
        "within 14 calendar days of purchase with original receipt. A 5% restocking fee "
        "applies if the box is opened. Software licenses are non-refundable."
    )
    grounded_prompt = f"""Answer the question strictly based on the provided policy document.
If the answer is not mentioned, say "I don't know based on the provided document."

<policy_document>
{context_doc}
</policy_document>

Question: {question}"""

    r_grounded = client.models.generate_content(
        model=MODEL_ID,
        contents=grounded_prompt,
    )
    print("Assistant:\n", r_grounded.text.strip())
    print("✅ Accurate, grounded answer derived directly from injected context.")

# =============================================================================
# MAIN EXECUTION CONTROLLER
# =============================================================================
# UNCOMMENT ANY OF THE DEMOS BELOW TO RUN THEM:
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    # Check that GEMINI_API_KEY is configured before running
    if not os.environ.get("GEMINI_API_KEY"):
        print("⚠️ WARNING: GEMINI_API_KEY environment variable is not set!")
        print("Please set your API key: $env:GEMINI_API_KEY='your-key-here'")
        print("You can get a free key from Google AI Studio: https://aistudio.google.com/")
        exit(1)

    # --- UNCOMMENT THE DEMO YOU WANT TO RUN ---

    # demo_1_first_call()
    # demo_2_prompt_engineering()
    # demo_3_structured_outputs()
    # demo_4_generation_parameters()
    # demo_5_1_count_tokens()
    # demo_5_2_stateless_vs_chat()
    # demo_5_3_grounding_context()

    print("\nDone! To run a demo, uncomment one of the function calls above.")