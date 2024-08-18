# upoutodo/utils.py

import json

import jwt
import requests
from django.contrib.auth import authenticate

from upoutodo.settings import JWT_AUTH


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
