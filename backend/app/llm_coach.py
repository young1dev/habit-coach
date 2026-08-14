import os
import json
import re
from dotenv import load_dotenv
from pydantic import ValidationError
from google import genai
from app.schemas import CoachResponse

load_dotenv()

# Supported providers: OPENAI or GEMINI. Default to GEMINI if available.
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "GEMINI").upper()

# OpenAI client kept for compatibility if needed (optional)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Gemini / Google Generative API settings
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")


def get_prompt(
    probability,
    features,
    habit_name,
    archetype,
):
    prompt = f"""
    You are an AI Habit Coach.

    Your job is to analyze today's habit metrics and provide actionable coaching.

    Inputs:
    Habit Name - {habit_name}
    - Completion probability - {probability}
    - Habit current streak, Completed Yesterday,  Today's metrics - {features}
    - Energy Level is over 3, moodscore/5, 
    - Habit archetype - {archetype}

    Rules:
    - Be realistic. Do not exaggerate.
    - Do not praise poor habits.
    - Base your advice on the supplied metrics.
    - If the probability is low, explain why.
    - If the probability is high, explain what is helping.
    - Keep recommendations practical.
    - Keep motivation concise.

    Return ONLY valid JSON in this format:

    {{
    "summary": "...",
    "risks": [
        "...",
        "..."
    ],
    "recommendations": [
        "...",
        "..."
    ],
    "motivation": "..."
    }}

    Do not invent user history that was not provided.
    Do not assume medical conditions.
    Only reason from the supplied metrics.
    """
    return prompt


def generate_coach_response(
    probability: float,
    features: dict,
    habit_name: str,
    archetype: str,
) -> CoachResponse:

    prompt = get_prompt(
        probability,
        features,
        habit_name,
        archetype,
    )

    # Choose provider
    if LLM_PROVIDER == "GEMINI":
        if not GEMINI_API_KEY:
            return CoachResponse(
                summary="AI coaching is not configured (missing GEMINI_API_KEY).",
                risks=[],
                recommendations=[],
                motivation="",
            )

        try:
            client = genai.Client(api_key=GEMINI_API_KEY)
            interaction = client.interactions.create(
                request={
                    "body": {
                        "model": GEMINI_MODEL,
                        "input": prompt,
                        "temperature": 0.2,
                    }
                }
            )
        except Exception as e:
            return CoachResponse(
                summary=f"AI coaching error: {type(e).__name__}: {e}",
                risks=[],
                recommendations=[],
                motivation="",
            )

        text = getattr(interaction, "output_text", None)
        if not text and isinstance(interaction, dict):
            text = (
                interaction.get("output_text")
                or interaction.get("output")
                or interaction.get("text")
            )
        if not text:
            steps = getattr(interaction, "steps", None)
            if isinstance(steps, list):
                for step in reversed(steps):
                    if isinstance(step, dict) and step.get("type") == "model_output":
                        content = step.get("content") or []
                        if isinstance(content, list) and len(content) > 0:
                            text = content[0].get("text") or text
                            if text:
                                break
        if not text:
            return CoachResponse(
                summary="AI coaching returned no text.",
                risks=[],
                recommendations=[],
                motivation="",
            )

        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            m = re.search(r"\{(?:.|\\n)*\}", text)
            if m:
                try:
                    data = json.loads(m.group(0))
                except json.JSONDecodeError:
                    data = None
            else:
                data = None

        if data is None:
            return CoachResponse(
                summary=text[:240],
                risks=[],
                recommendations=[],
                motivation="",
            )

        try:
            return CoachResponse(**data)
        except ValidationError:
            return CoachResponse(
                summary=data.get("summary", ""),
                risks=data.get("risks", []),
                recommendations=data.get("recommendations", []),
                motivation=data.get("motivation", ""),
            )

    # Fallback / OPENAI (not fully implemented)
    return CoachResponse(
        summary="AI coaching is temporarily unavailable.",
        risks=[],
        recommendations=[],
        motivation="",
    )
