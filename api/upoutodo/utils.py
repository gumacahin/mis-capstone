# upoutodo/utils.py

import json

import jwt
import requests
from django.contrib.auth import authenticate


def jwt_get_username_from_payload_handler(payload):
    username = payload.get("sub").replace("|", ".")
    authenticate(remote_user=username)
    return username


def jwt_decode_token(token):
    """Decode JWT token, supporting both Auth0 RS256 and test HS256 tokens."""
    from django.conf import settings

    header = jwt.get_unverified_header(token)

    # Check if this is a test token (HS256)
    if header.get("alg") == "HS256" and getattr(settings, "E2E_TEST_MODE", False):
        # Test mode HS256 token
        test_issuer = settings.JWT_AUTH.get("JWT_TEST_ISSUER")
        test_audience = settings.JWT_AUTH.get("JWT_TEST_AUDIENCE")
        test_signing_key = settings.JWT_AUTH.get("JWT_TEST_SIGNING_KEY")

        if not all([test_issuer, test_audience, test_signing_key]):
            raise Exception("Test JWT configuration incomplete.")

        return jwt.decode(
            token,
            test_signing_key,
            audience=test_audience,
            issuer=test_issuer,
            algorithms=["HS256"],
        )

    # Production Auth0 RS256 token
    jwt_audience = settings.JWT_AUTH["JWT_AUDIENCE"]
    jwt_issuer = settings.JWT_AUTH["JWT_ISSUER"]

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
