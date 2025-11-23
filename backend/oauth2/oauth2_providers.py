import os


PROVIDERS = {
    "google": {
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "project_id": "goof-ai",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "redirect_uri": "http://localhost:3000/google/oauth2/callback",
        "scope": ["https://www.googleapis.com/auth/gmail.send"],
        "redirect_uris": [
            "http://localhost:3000/google/oauth2/callback"
        ],
        "javascript_origins": [
            "http://localhost:3000"
        ]
    }
}