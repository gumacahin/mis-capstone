from unittest.mock import Mock, patch

import requests
from django.test import override_settings

from upoutodo.email.email_service import EmailService

# Test constants
TEST_API_KEY = "test_api_key_123"
TEST_EMAIL = "test@example.com"
TEST_SUBJECT = "Test Subject"
TEST_BODY = "<p>Test email body</p>"
TEST_BASE_URL = "https://api.brevo.com/v3"


class TestEmailServiceInitialization:
    """Test cases for EmailService initialization"""

    @override_settings(BREVO_API_KEY=TEST_API_KEY)
    def test_init_with_api_key(self):
        """Test EmailService initialization with API key"""
        # Act
        email_service = EmailService()

        # Assert
        assert email_service.api_key == TEST_API_KEY
        assert email_service.base_url == TEST_BASE_URL

    @override_settings(BREVO_API_KEY=None)
    def test_init_without_api_key(self):
        """Test EmailService initialization without API key"""
        # Act
        email_service = EmailService()

        # Assert
        assert email_service.api_key is None
        assert email_service.base_url == TEST_BASE_URL


class TestEmailServiceSuccessfulSending:
    """Test cases for successful email sending scenarios"""

    def _create_mock_success_response(self):
        """Helper method to create a mock successful response"""
        mock_response = Mock()
        mock_response.raise_for_status.return_value = None
        return mock_response

    @patch("requests.post")
    @override_settings(BREVO_API_KEY=TEST_API_KEY, BREVO_SENDER_NAME="UPOU TODO")
    def test_send_email_success(self, mock_post):
        """Test successful email sending"""
        # Arrange
        email_service = EmailService()

        # Mock successful response
        mock_response = self._create_mock_success_response()
        mock_post.return_value = mock_response

        # Act
        result = email_service.send_email(
            to_email=TEST_EMAIL,
            subject=TEST_SUBJECT,
            body=TEST_BODY,
        )

        # Assert
        assert result is None
        mock_post.assert_called_once_with(
            f"{TEST_BASE_URL}/smtp/email",
            headers={
                "accept": "application/json",
                "api-key": TEST_API_KEY,
                "content-type": "application/json",
            },
            json={
                "sender": {"name": "UPOU TODO", "email": "upoutodo@gmail.com"},
                "to": [{"email": TEST_EMAIL}],
                "subject": TEST_SUBJECT,
                "htmlContent": TEST_BODY,
            },
        )
        mock_response.raise_for_status.assert_called_once()

    @patch("requests.post")
    @override_settings(BREVO_API_KEY=None)
    def test_send_email_without_api_key(self, mock_post):
        """Test email sending without API key configured"""
        # Arrange
        email_service = EmailService()  # No API key in settings

        # Act
        result = email_service.send_email(
            to_email=TEST_EMAIL,
            subject=TEST_SUBJECT,
            body=TEST_BODY,
        )

        # Assert
        assert result is None
        # Should not make API call when API key is missing
        mock_post.assert_not_called()

    @patch("requests.post")
    @override_settings(BREVO_API_KEY="")
    def test_send_email_empty_api_key(self, mock_post):
        """Test email sending with empty API key"""
        # Arrange
        email_service = EmailService()

        # Act
        result = email_service.send_email(
            to_email=TEST_EMAIL,
            subject=TEST_SUBJECT,
            body=TEST_BODY,
        )

        # Assert
        assert result is None
        # Should not make API call when API key is empty
        mock_post.assert_not_called()

    @patch("requests.post")
    @override_settings(BREVO_API_KEY=TEST_API_KEY, BREVO_SENDER_NAME="UPOU TODO")
    def test_send_email_with_recipient_name(self, mock_post):
        """Test email sending with recipient name"""
        # Arrange
        email_service = EmailService()

        # Mock successful response
        mock_response = self._create_mock_success_response()
        mock_post.return_value = mock_response

        # Act
        result = email_service.send_email(
            to_email=TEST_EMAIL,
            subject=TEST_SUBJECT,
            body=TEST_BODY,
            to_name="John Doe",
        )

        # Assert
        assert result is None
        mock_post.assert_called_once_with(
            f"{TEST_BASE_URL}/smtp/email",
            headers={
                "accept": "application/json",
                "api-key": TEST_API_KEY,
                "content-type": "application/json",
            },
            json={
                "sender": {"name": "UPOU TODO", "email": "upoutodo@gmail.com"},
                "to": [{"email": TEST_EMAIL, "name": "John Doe"}],
                "subject": TEST_SUBJECT,
                "htmlContent": TEST_BODY,
            },
        )
        mock_response.raise_for_status.assert_called_once()


class TestEmailServiceInputValidation:
    """Test cases for email service input validation and edge cases"""

    def _create_mock_success_response(self):
        """Helper method to create a mock successful response"""
        mock_response = Mock()
        mock_response.raise_for_status.return_value = None
        return mock_response

    @patch("requests.post")
    @override_settings(BREVO_API_KEY=TEST_API_KEY, BREVO_SENDER_NAME="UPOU TODO")
    def test_send_email_with_different_content_types(self, mock_post):
        """Test email sending with different content types"""
        # Arrange
        email_service = EmailService()

        # Mock successful response
        mock_response = self._create_mock_success_response()
        mock_post.return_value = mock_response

        test_cases = [
            {
                "body": "<h1>HTML Content</h1><p>Rich text email</p>",
                "expected_body": "<h1>HTML Content</h1><p>Rich text email</p>",
            },
            {"body": "Plain text email", "expected_body": "Plain text email"},
            {"body": "", "expected_body": ""},
            {
                "body": "Special chars: & < > \" '",
                "expected_body": "Special chars: & < > \" '",
            },
        ]

        for test_case in test_cases:
            # Act
            result = email_service.send_email(
                to_email=TEST_EMAIL,
                subject=TEST_SUBJECT,
                body=test_case["body"],
            )

            # Assert
            assert result is None
            mock_post.assert_called_with(
                f"{TEST_BASE_URL}/smtp/email",
                headers={
                    "accept": "application/json",
                    "api-key": TEST_API_KEY,
                    "content-type": "application/json",
                },
                json={
                    "sender": {"name": "UPOU TODO", "email": "upoutodo@gmail.com"},
                    "to": [{"email": TEST_EMAIL}],
                    "subject": TEST_SUBJECT,
                    "htmlContent": test_case["expected_body"],
                },
            )
            mock_post.reset_mock()

    @patch("requests.post")
    @override_settings(BREVO_API_KEY=TEST_API_KEY, BREVO_SENDER_NAME="UPOU TODO")
    def test_send_email_with_different_emails(self, mock_post):
        """Test email sending with different email formats"""
        # Arrange
        email_service = EmailService()

        # Mock successful response
        mock_response = self._create_mock_success_response()
        mock_post.return_value = mock_response

        test_emails = [
            "user@example.com",
            "test.user@domain.co.uk",
            "user+tag@example.org",
            "user123@test-domain.com",
        ]

        for email in test_emails:
            # Act
            result = email_service.send_email(
                to_email=email, subject=TEST_SUBJECT, body="Test body"
            )

            # Assert
            assert result is None
            mock_post.assert_called_with(
                f"{TEST_BASE_URL}/smtp/email",
                headers={
                    "accept": "application/json",
                    "api-key": TEST_API_KEY,
                    "content-type": "application/json",
                },
                json={
                    "sender": {"name": "UPOU TODO", "email": "upoutodo@gmail.com"},
                    "to": [{"email": email}],
                    "subject": TEST_SUBJECT,
                    "htmlContent": "Test body",
                },
            )
            mock_post.reset_mock()

    @patch("requests.post")
    @override_settings(BREVO_API_KEY=TEST_API_KEY, BREVO_SENDER_NAME="UPOU TODO")
    def test_send_email_with_different_subjects(self, mock_post):
        """Test email sending with different subject lines"""
        # Arrange
        email_service = EmailService()

        # Mock successful response
        mock_response = self._create_mock_success_response()
        mock_post.return_value = mock_response

        test_subjects = [
            "Simple subject",
            "Subject with spaces",
            "Subject with special chars: !@#$%^&*()",
            "Subject with unicode: ñáéíóú",
            "",  # Empty subject
            "Very long subject " * 10,  # Long subject
        ]

        for subject in test_subjects:
            # Act
            result = email_service.send_email(
                to_email=TEST_EMAIL, subject=subject, body="Test body"
            )

            # Assert
            assert result is None
            mock_post.assert_called_with(
                f"{TEST_BASE_URL}/smtp/email",
                headers={
                    "accept": "application/json",
                    "api-key": TEST_API_KEY,
                    "content-type": "application/json",
                },
                json={
                    "sender": {"name": "UPOU TODO", "email": "upoutodo@gmail.com"},
                    "to": [{"email": TEST_EMAIL}],
                    "subject": subject,
                    "htmlContent": "Test body",
                },
            )
            mock_post.reset_mock()


class TestEmailServiceErrorHandling:
    """Test cases for email service error handling"""

    def _create_mock_error_response(self, error_message):
        """Helper method to create a mock error response"""
        mock_response = Mock()
        mock_response.raise_for_status.side_effect = requests.HTTPError(error_message)
        return mock_response

    @patch("requests.post")
    @override_settings(BREVO_API_KEY=TEST_API_KEY)
    def test_send_email_http_error(self, mock_post):
        """Test email sending with HTTP error response"""
        # Arrange
        email_service = EmailService()

        # Mock HTTP error response
        mock_response = self._create_mock_error_response("400 Bad Request")
        mock_post.return_value = mock_response

        # Act
        result = email_service.send_email(
            to_email=TEST_EMAIL,
            subject=TEST_SUBJECT,
            body=TEST_BODY,
        )

        # Assert
        assert result is None
        mock_post.assert_called_once()
        mock_response.raise_for_status.assert_called_once()

    @patch("requests.post")
    @override_settings(BREVO_API_KEY=TEST_API_KEY)
    def test_send_email_network_error(self, mock_post):
        """Test email sending with network error"""
        # Arrange
        email_service = EmailService()

        # Mock network error
        mock_post.side_effect = requests.ConnectionError("Connection failed")

        # Act
        result = email_service.send_email(
            to_email=TEST_EMAIL,
            subject=TEST_SUBJECT,
            body=TEST_BODY,
        )

        # Assert
        assert result is None
        mock_post.assert_called_once()

    @patch("requests.post")
    @override_settings(BREVO_API_KEY=TEST_API_KEY)
    def test_send_email_timeout_error(self, mock_post):
        """Test email sending with timeout error"""
        # Arrange
        email_service = EmailService()

        # Mock timeout error
        mock_post.side_effect = requests.Timeout("Request timed out")

        # Act
        result = email_service.send_email(
            to_email=TEST_EMAIL,
            subject=TEST_SUBJECT,
            body=TEST_BODY,
        )

        # Assert
        assert result is None
        mock_post.assert_called_once()

    @patch("requests.post")
    @override_settings(BREVO_API_KEY=TEST_API_KEY)
    def test_send_email_500_server_error(self, mock_post):
        """Test email sending with 500 server error"""
        # Arrange
        email_service = EmailService()

        # Mock 500 server error
        mock_response = self._create_mock_error_response("500 Internal Server Error")
        mock_post.return_value = mock_response

        # Act
        result = email_service.send_email(
            to_email=TEST_EMAIL,
            subject=TEST_SUBJECT,
            body=TEST_BODY,
        )

        # Assert
        assert result is None
        mock_post.assert_called_once()
        mock_response.raise_for_status.assert_called_once()

    @patch("requests.post")
    @override_settings(BREVO_API_KEY=TEST_API_KEY)
    def test_send_email_401_unauthorized(self, mock_post):
        """Test email sending with 401 unauthorized error"""
        # Arrange
        email_service = EmailService()

        # Mock 401 unauthorized error
        mock_response = self._create_mock_error_response("401 Unauthorized")
        mock_post.return_value = mock_response

        # Act
        result = email_service.send_email(
            to_email=TEST_EMAIL,
            subject=TEST_SUBJECT,
            body=TEST_BODY,
        )

        # Assert
        assert result is None
        mock_post.assert_called_once()
        mock_response.raise_for_status.assert_called_once()

    @patch("requests.post")
    @override_settings(BREVO_API_KEY=TEST_API_KEY)
    def test_send_email_429_rate_limit(self, mock_post):
        """Test email sending with 429 rate limit error"""
        # Arrange
        email_service = EmailService()

        # Mock 429 rate limit error
        mock_response = self._create_mock_error_response("429 Too Many Requests")
        mock_post.return_value = mock_response

        # Act
        result = email_service.send_email(
            to_email=TEST_EMAIL,
            subject=TEST_SUBJECT,
            body=TEST_BODY,
        )

        # Assert
        assert result is None
        mock_post.assert_called_once()
        mock_response.raise_for_status.assert_called_once()
