# upoutodo/utils.py

import json
from datetime import datetime
from typing import Optional

import jwt
import requests
from dateutil.rrule import rrulestr
from django.contrib.auth import authenticate

from api.settings import JWT_AUTH


def jwt_get_username_from_payload_handler(payload):
    username = payload.get("sub").replace("|", ".")
    authenticate(remote_user=username)
    return username


def jwt_decode_token(token):
    jwt_audience = JWT_AUTH["JWT_AUDIENCE"]
    jwt_issuer = JWT_AUTH["JWT_ISSUER"]

    header = jwt.get_unverified_header(token)
    jwks = requests.get(
        "https://{}/.well-known/jwks.json".format("dev-tbs5lvhtbsscsnn5.us.auth0.com")
    ).json()
    public_key = None
    for jwk in jwks["keys"]:
        if jwk["kid"] == header["kid"]:
            public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))

    if public_key is None:
        raise Exception("Public key not found.")

    issuer = "https://{}/".format(jwt_issuer)
    return jwt.decode(
        token, public_key, audience=jwt_audience, issuer=issuer, algorithms=["RS256"]
    )


def calculate_next_due_date(rrule_str: str, dtstart: datetime) -> Optional[datetime]:
    """
    Calculate the next due date based on an RRULE string and start datetime.

    Args:
        rrule_str: RRULE string (e.g., "FREQ=DAILY", "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR")
        dtstart: Start datetime in UTC

    Returns:
        Next occurrence datetime in UTC, or None if no valid occurrence found
    """
    try:
        # Parse the RRULE string
        rrule = rrulestr(rrule_str, dtstart=dtstart)

        # Find the next occurrence after dtstart (inclusive)
        next_occurrence = rrule.after(dtstart, inc=True)

        return next_occurrence

    except (ValueError, TypeError):
        # Handle invalid RRULE strings gracefully
        # Log the error in a real application, but for now just return None
        return None
