import os
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware


class APIKeyMiddleware(BaseHTTPMiddleware):
    """Middleware to validate X-API-Key header on all requests except /health."""

    async def dispatch(self, request: Request, call_next):
        if request.url.path == "/health":
            return await call_next(request)

        if request.method == "OPTIONS":
            return await call_next(request)

        api_key = request.headers.get("X-API-Key")
        expected_key = os.environ.get("INTERNAL_API_KEY", "")

        if not expected_key:
            raise HTTPException(status_code=500, detail="Server misconfigured: API key not set")

        if api_key != expected_key:
            raise HTTPException(status_code=401, detail="Invalid or missing API key")

        return await call_next(request)
