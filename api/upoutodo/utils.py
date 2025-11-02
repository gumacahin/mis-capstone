# upoutodo/utils.py

import json
import logging
from datetime import datetime
from typing import Optional

import jwt
import requests
from dateutil.rrule import rrulestr
from django.contrib.auth import authenticate

from api.settings import JWT_AUTH

logger = logging.getLogger(__name__)


def jwt_get_username_from_payload_handler(payload):
    username = payload.get("sub").replace("|", ".")
    authenticate(remote_user=username)
    return username


def jwt_decode_token(token):
    """
    Decode and validate a JWT token using Auth0 public keys or test signing key.

    Args:
        token: JWT token string to decode

    Returns:
        Decoded JWT payload

    Raises:
        JWTDecodeError: If token is invalid or cannot be decoded
        JWTPublicKeyError: If public key cannot be found or retrieved
    """
    try:
        jwt_audience = JWT_AUTH["JWT_AUDIENCE"]
        jwt_issuer = JWT_AUTH["JWT_ISSUER"]

        header = jwt.get_unverified_header(token)

        # Fetch JWKS from Auth0
        jwks_url = "https://dev-tbs5lvhtbsscsnn5.us.auth0.com/.well-known/jwks.json"
        try:
            jwks_response = requests.get(jwks_url, timeout=10)
            jwks_response.raise_for_status()
            jwks = jwks_response.json()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch JWKS from {jwks_url}: {e}")
            raise JWTPublicKeyError(f"Cannot fetch public keys: {e}")

        # Find matching public key
        public_key = None
        for jwk in jwks.get("keys", []):
            if jwk.get("kid") == header.get("kid"):
                try:
                    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))
                    break
                except Exception as e:
                    logger.error(f"Failed to create public key from JWK: {e}")
                    continue

        if public_key is None:
            logger.error(f"Public key not found for kid: {header.get('kid')}")
            raise JWTPublicKeyError("Public key not found for token")

        issuer = f"https://{jwt_issuer}/"
        return jwt.decode(
            token,
            public_key,
            audience=jwt_audience,
            issuer=issuer,
            algorithms=["RS256"],
        )

    except jwt.InvalidTokenError as e:
        logger.error(f"JWT token validation failed: {e}")
        raise JWTDecodeError(f"Invalid token: {e}")
    except Exception as e:
        logger.error(f"Unexpected error during JWT decode: {e}")
        raise JWTDecodeError(f"Token decode failed: {e}")


def calculate_next_due_date(rrule_str: str, dtstart: datetime) -> Optional[datetime]:
    """
    Calculate the next due date based on an RRULE string and start datetime.

    Args:
        rrule_str: RRULE string (e.g., "FREQ=DAILY", "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR")
        dtstart: Start datetime in UTC

    Returns:
        Next occurrence datetime in UTC, or None if no valid occurrence found
    """
    if not rrule_str or not rrule_str.strip():
        logger.warning("Empty or whitespace-only RRULE string provided")
        return None

    if not dtstart:
        logger.warning("No dtstart provided for RRULE calculation")
        return None

    try:
        # Parse the RRULE string
        rrule = rrulestr(rrule_str, dtstart=dtstart)

        # Check if this is a one-time task (COUNT=1)
        if "COUNT=1" in rrule_str.upper():
            # For one-time tasks, the due date is the dtstart date itself
            logger.debug(
                f"One-time task detected (COUNT=1), returning dtstart: {dtstart} for RRULE: {rrule_str}"
            )
            return dtstart

        # For recurring tasks, find the next occurrence after dtstart (exclusive)
        # Use inc=False to get the next occurrence, not the current one
        next_occurrence = rrule.after(dtstart, inc=False)

        if next_occurrence:
            logger.debug(
                f"Calculated next occurrence: {next_occurrence} for RRULE: {rrule_str}"
            )
        else:
            logger.info(f"No future occurrences found for RRULE: {rrule_str}")

        return next_occurrence

    except ValueError as e:
        logger.error(f"Invalid RRULE string '{rrule_str}': {e}")
        return None
    except TypeError as e:
        logger.error(f"Type error in RRULE calculation for '{rrule_str}': {e}")
        return None
    except Exception as e:
        logger.error(
            f"Unexpected error calculating next due date for RRULE '{rrule_str}': {e}"
        )
        return None


# Custom exception classes for better error handling
class JWTDecodeError(Exception):
    """Raised when JWT token cannot be decoded or is invalid."""

    pass


class JWTPublicKeyError(Exception):
    """Raised when JWT public key cannot be retrieved or processed."""

    pass
