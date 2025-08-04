import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        self.api_key = getattr(settings, "BREVO_API_KEY", None)
        self.base_url = "https://api.brevo.com/v3"
        self.sender_email = getattr(
            settings, "BREVO_SENDER_EMAIL", "upoutodo@gmail.com"
        )
        self.sender_name = getattr(settings, "BREVO_SENDER_NAME", "UPOU TODO")

    def send_email(
        self, to_email: str, subject: str, body: str, to_name: str = None
    ) -> None:
        # Validate API key
        if not self.api_key:
            logger.error("BREVO_API_KEY is not configured")
            return

        # Validate sender email
        if not self.sender_email:
            logger.error("BREVO_SENDER_EMAIL is not configured")
            return

        # Validate recipient email
        if not to_email:
            logger.error("Recipient email is missing or empty")
            return

        url = f"{self.base_url}/smtp/email"
        headers = {
            "accept": "application/json",
            "api-key": self.api_key,
            "content-type": "application/json",
        }

        # Prepare recipient data
        recipient = {"email": to_email}
        if to_name:
            recipient["name"] = to_name

        data = {
            "sender": {"name": self.sender_name, "email": self.sender_email},
            "to": [recipient],
            "subject": subject,
            "htmlContent": body,
        }
        try:
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
        except Exception as e:
            logger.error(f"Error sending email: {e}")
            # Log response details if available
            if hasattr(e, "response") and e.response is not None:
                logger.error(f"Response status: {e.response.status_code}")
                logger.error(f"Response body: {e.response.text}")
