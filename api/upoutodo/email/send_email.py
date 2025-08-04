import os
from typing import Dict, List, Union

from django.conf import settings
from jinja2 import Environment, FileSystemLoader

from .email_service import EmailService


def send_email(
    subject: str,
    recipient_email: Union[str, List[str]],
    template_name: str,
    template_vars: Dict[str, str],
    recipient_name: str = None,
) -> None:
    file_loader = FileSystemLoader(
        os.path.join(settings.BASE_DIR, "upoutodo", "email", "templates")
    )
    env = Environment(loader=file_loader)
    template = env.get_template(template_name)
    html_content = template.render(template_vars)
    email_service = EmailService()
    email_service.send_email(recipient_email, subject, html_content, recipient_name)
