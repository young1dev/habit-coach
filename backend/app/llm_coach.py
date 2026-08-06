from openai import OpenAI
from dotenv import load_dotenv
import json
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

def get_prompt (probability, features, habit_name, archetype,):
    prompt = f"""
    You are an AI Habit Coach.

    Your job is to analyze today's habit metrics and provide actionable coaching.

    Inputs:
    Habit Name - {habit_name}
    - Completion probability - {probability}
    - Habit current streak, Completed Yesterday,  Today's metrics - {features}
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

    {
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
    }

    Do not invent user history that was not provided.
    Do not assume medical conditions.
    Only reason from the supplied metrics.
    """
    return prompt


def generate_coach_response(
    probability: float,
    features: dict,
    habit_name: str,
    archetype: str
) -> dict:
    prompt = get_prompt(probability, features, habit_name, archetype,) -str
    response = client.responses.create(
        model="gpt-5",
        input=prompt,
    )
    print(response.output_text)
    
    try:
        return json.loads(response.output_text)
    except json.JSONDecodeError:
        return {
            "summary": "Error: Unable to parse response.",
            "risks": [],
            "recommendations": [],
            "motivation": "",
        }
