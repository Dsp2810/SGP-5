#!/usr/bin/env python3
"""
Aptitude RAG MCQ Generator
Usage: python aptitudeRAG.py <topic> [count]
Outputs: JSON with generated MCQs
"""

import sys
import json
import os
import re
from pathlib import Path

def retrieve_context(topic, k=5):
    """Retrieve relevant chunks from FAISS index"""
    index_dir = Path(__file__).parent.parent.parent / "aptitude_data"
    index_path = index_dir / "aptitude.index"
    chunks_path = index_dir / "chunks.npy"

    if not index_path.exists() or not chunks_path.exists():
        return None, "Index not found. Run build_index.py first."

    import faiss
    import numpy as np
    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer("all-MiniLM-L6-v2")
    index = faiss.read_index(str(index_path))
    chunks = np.load(str(chunks_path), allow_pickle=True)

    query_embedding = model.encode([topic])
    distances, ids = index.search(query_embedding.astype("float32"), k)

    relevant = [chunks[i] for i in ids[0] if i < len(chunks)]
    context = "\n\n".join(relevant)
    return context, None


def _load_env_key(key_name):
    """Read a key from env or from .env file directly."""
    val = os.environ.get(key_name)
    if val:
        return val
    env_path = Path(__file__).parent.parent.parent / ".env"
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                if line.startswith(f"{key_name}="):
                    return line.split("=", 1)[1].strip()
    return None


def generate_mcqs(topic, count=5):
    """Generate MCQs using Groq (free) or OpenAI as fallback."""
    groq_key = _load_env_key("GROQ_API_KEY")
    openai_key = _load_env_key("OPENAI_API_KEY")

    if not groq_key and not openai_key:
        return {"success": False, "error": "No API key found. Set GROQ_API_KEY in backend/.env (free at console.groq.com)"}

    context, err = retrieve_context(topic)
    if err:
        return {"success": False, "error": err}

    # Prefer Groq (free tier) over OpenAI
    if groq_key:
        from groq import Groq
        client = Groq(api_key=groq_key)
        model_name = "llama-3.3-70b-versatile"
    else:
        from openai import OpenAI
        client = OpenAI(api_key=openai_key)
        model_name = "gpt-4o-mini"

    prompt = f"""You are an aptitude MCQ generator for placement exam preparation.

Generate exactly {count} multiple choice questions on the topic: "{topic}"

Use the following reference content from an aptitude book as context:
{context[:3000]}

IMPORTANT: Return ONLY valid JSON in this exact format, no other text:
{{
  "questions": [
    {{
      "question": "Question text here?",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correct": 0
    }}
  ]
}}

Rules:
- "correct" is the 0-based index of the correct option (0=A, 1=B, 2=C, 3=D)
- Each question must have exactly 4 options
- Questions should be appropriate for campus placement aptitude tests
- Make questions varied in difficulty (easy, medium, hard)
- Return exactly {count} questions
"""

    response = client.chat.completions.create(
        model=model_name,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=2000
    )

    raw = response.choices[0].message.content.strip()

    # Parse JSON from response
    # Handle case where model wraps in ```json ... ```
    json_match = re.search(r'\{[\s\S]*\}', raw)
    if json_match:
        raw = json_match.group(0)

    parsed = json.loads(raw)
    questions = parsed.get("questions", [])

    # Add sequential IDs
    for i, q in enumerate(questions):
        q["id"] = i + 1

    return {
        "success": True,
        "questions": questions,
        "topic": topic,
        "count": len(questions)
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Topic argument required"}))
        sys.exit(1)

    topic = sys.argv[1]
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 5

    try:
        result = generate_mcqs(topic, count)
        print(json.dumps(result))
    except json.JSONDecodeError as e:
        print(json.dumps({"success": False, "error": f"Failed to parse LLM response as JSON: {str(e)}"}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
