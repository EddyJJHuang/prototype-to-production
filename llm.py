"""
LLM abstraction layer.
Swap providers by changing the base_url and model below,
or by setting environment variables.

Supported out of the box (OpenAI-compatible):
  - OpenAI:   base_url=None,                    model="gpt-4o"
  - Groq:     base_url="https://api.groq.com/openai/v1"
  - Together: base_url="https://api.together.xyz/v1"
  - Ollama:   base_url="http://localhost:11434/v1", api_key="ollama"
"""

import json
import os
from typing import Type, TypeVar

from openai import OpenAI
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)

# ── CONFIGURE HERE ──────────────────────────────────────────────────────────
# Set LLM_API_KEY and optionally LLM_BASE_URL + LLM_MODEL as env vars,
# or edit the defaults below.
_client = OpenAI(
    api_key=os.environ.get("LLM_API_KEY", "YOUR_API_KEY_HERE"),  # <-- ADD YOUR KEY
    base_url=os.environ.get("LLM_BASE_URL", None),               # None = OpenAI default
)
_default_model = os.environ.get("LLM_MODEL", "gpt-4o-mini")
# ────────────────────────────────────────────────────────────────────────────


def call_llm(system_prompt: str, user_prompt: str, model: str = _default_model) -> str:
    """Raw LLM call, returns text."""
    response = _client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
    )
    return response.choices[0].message.content.strip()


def call_llm_structured(
    system_prompt: str,
    user_prompt: str,
    schema: Type[T],
    model: str = _default_model,
) -> T:
    """
    LLM call that returns a validated Pydantic object.
    Instructs the model to reply with JSON matching the schema.
    """
    schema_json = json.dumps(schema.model_json_schema(), indent=2)
    augmented_system = (
        f"{system_prompt}\n\n"
        f"Reply with ONLY a valid JSON object matching this schema:\n{schema_json}\n"
        "Do not include markdown fences or any explanation."
    )
    raw = call_llm(augmented_system, user_prompt, model=model)
    # Strip accidental markdown fences if the model adds them anyway
    raw = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return schema.model_validate_json(raw)
