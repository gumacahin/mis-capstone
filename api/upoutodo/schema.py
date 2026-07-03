from drf_spectacular.extensions import OpenApiAuthenticationExtension


class E2EBearerTokenAuthenticationScheme(OpenApiAuthenticationExtension):
    target_class = "upoutodo.authentication.E2EBearerTokenAuthentication"
    name = "E2ETestBearer"

    def get_security_definition(self, auto_schema):
        return {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "E2E",
            "description": (
                "Test-only bearer token for local Playwright E2E runs. "
                "Disabled unless explicit local E2E flags are enabled."
            ),
        }
