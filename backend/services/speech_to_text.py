from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

from core.config import settings
from models.response_models import TranscriptionResponse

logger = logging.getLogger(__name__)


def transcribe_audio(audio_path: str) -> TranscriptionResponse:
    path = Path(audio_path)
    if not path.exists():
        raise FileNotFoundError(f"Audio file not found: {audio_path!r}")

    try:
        from groq import Groq
        client = Groq(api_key=settings.GROQ_API_KEY)

        with open(path, "rb") as f:
            response = client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=(path.name, f),
                response_format="verbose_json",
            )

        transcript = response.text.strip()
        language = getattr(response, "language", "en")
        duration = getattr(response, "duration", None)

        return TranscriptionResponse(
            transcript=transcript,
            detected_language=language,
            duration_seconds=round(float(duration), 2) if duration else None,
            confidence=None,
        )

    except Exception as exc:
        logger.error("Groq transcription failed: %s", exc, exc_info=True)
        raise RuntimeError(f"Transcription failed: {exc}") from exc


def warmup_model() -> None:
    pass
