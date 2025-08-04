import os
import tempfile
from unittest.mock import Mock, patch

from django.test import override_settings

from upoutodo.email.send_email import send_email


class TestSendEmail:
    """Test cases for the send_email function"""

    def setup_method(self):
        """Set up test fixtures before each test method"""
        # Create a temporary directory for test templates
        self.temp_dir = tempfile.mkdtemp()
        # Create the email/templates directory structure that send_email expects
        self.template_dir = os.path.join(self.temp_dir, "email", "templates")
        os.makedirs(self.template_dir, exist_ok=True)

    def teardown_method(self):
        """Clean up test fixtures after each test method"""
        import shutil

        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def _create_test_template(self, template_name, content):
        """Helper method to create a test template file"""
        template_path = os.path.join(self.template_dir, template_name)
        with open(template_path, "w") as f:
            f.write(content)
        return template_path

    @patch("upoutodo.email.send_email.EmailService")
    def test_send_email_single_recipient(self, mock_email_service_class):
        """Test sending email to a single recipient"""
        # Arrange
        subject = "Test Subject"
        recipient_email = "test@example.com"
        template_name = "test_template.html"
        template_vars = {"name": "John", "task_count": 5}

        # Create test template
        template_content = """
        <html>
            <body>
                <h1>Hello {{ name }}!</h1>
                <p>You have {{ task_count }} tasks today.</p>
            </body>
        </html>
        """
        self._create_test_template(template_name, template_content)

        # Mock EmailService
        mock_email_service = Mock()
        mock_email_service_class.return_value = mock_email_service

        # Act
        with override_settings(BASE_DIR=self.temp_dir):
            send_email(subject, recipient_email, template_name, template_vars)

        # Assert
        mock_email_service.send_email.assert_called_once()
        call_args = mock_email_service.send_email.call_args
        assert call_args[0][0] == recipient_email  # recipient
        assert call_args[0][1] == subject  # subject
        assert "Hello John!" in call_args[0][2]  # html content
        assert "You have 5 tasks today." in call_args[0][2]  # html content

    @patch("upoutodo.email.send_email.EmailService")
    def test_send_email_multiple_recipients(self, mock_email_service_class):
        """Test sending email to multiple recipients"""
        # Arrange
        subject = "Test Subject"
        recipient_emails = ["user1@example.com", "user2@example.com"]
        template_name = "test_template.html"
        template_vars = {"message": "Hello everyone!"}

        # Create test template
        template_content = """
        <html>
            <body>
                <p>{{ message }}</p>
            </body>
        </html>
        """
        self._create_test_template(template_name, template_content)

        # Mock EmailService
        mock_email_service = Mock()
        mock_email_service_class.return_value = mock_email_service

        # Act
        with override_settings(BASE_DIR=self.temp_dir):
            send_email(subject, recipient_emails, template_name, template_vars)

        # Assert
        mock_email_service.send_email.assert_called_once()
        call_args = mock_email_service.send_email.call_args
        assert call_args[0][0] == recipient_emails  # recipients
        assert call_args[0][1] == subject  # subject
        assert "Hello everyone!" in call_args[0][2]  # html content

    @patch("upoutodo.email.send_email.EmailService")
    def test_send_email_complex_template_vars(self, mock_email_service_class):
        """Test sending email with complex template variables"""
        # Arrange
        subject = "Daily Digest"
        recipient_email = "user@example.com"
        template_name = "daily_digest.html"
        template_vars = {
            "user_name": "Alice",
            "tasks": [
                {"title": "Task 1", "priority": "high"},
                {"title": "Task 2", "priority": "medium"},
            ],
            "total_tasks": 2,
            "completed_tasks": 1,
        }

        # Create test template
        template_content = """
        <html>
            <body>
                <h1>Hello {{ user_name }}!</h1>
                <p>You have {{ total_tasks }} tasks today.</p>
                <p>Completed: {{ completed_tasks }}</p>
                <ul>
                {% for task in tasks %}
                    <li>{{ task.title }} ({{ task.priority }})</li>
                {% endfor %}
                </ul>
            </body>
        </html>
        """
        self._create_test_template(template_name, template_content)

        # Mock EmailService
        mock_email_service = Mock()
        mock_email_service_class.return_value = mock_email_service

        # Act
        with override_settings(BASE_DIR=self.temp_dir):
            send_email(subject, recipient_email, template_name, template_vars)

        # Assert
        mock_email_service.send_email.assert_called_once()
        call_args = mock_email_service.send_email.call_args
        assert call_args[0][0] == recipient_email  # recipient
        assert call_args[0][1] == subject  # subject

        html_content = call_args[0][2]
        assert "Hello Alice!" in html_content
        assert "You have 2 tasks today." in html_content
        assert "Completed: 1" in html_content
        assert "Task 1 (high)" in html_content
        assert "Task 2 (medium)" in html_content

    @patch("upoutodo.email.send_email.EmailService")
    def test_send_email_empty_template_vars(self, mock_email_service_class):
        """Test sending email with empty template variables"""
        # Arrange
        subject = "Empty Template"
        recipient_email = "test@example.com"
        template_name = "empty_template.html"
        template_vars = {}

        # Create test template
        template_content = """
        <html>
            <body>
                <h1>Static Content</h1>
                <p>No variables needed.</p>
            </body>
        </html>
        """
        self._create_test_template(template_name, template_content)

        # Mock EmailService
        mock_email_service = Mock()
        mock_email_service_class.return_value = mock_email_service

        # Act
        with override_settings(BASE_DIR=self.temp_dir):
            send_email(subject, recipient_email, template_name, template_vars)

        # Assert
        mock_email_service.send_email.assert_called_once()
        call_args = mock_email_service.send_email.call_args
        assert call_args[0][0] == recipient_email  # recipient
        assert call_args[0][1] == subject  # subject
        assert "Static Content" in call_args[0][2]  # html content
        assert "No variables needed." in call_args[0][2]  # html content

    @patch("upoutodo.email.send_email.EmailService")
    def test_send_email_with_conditional_template_logic(self, mock_email_service_class):
        """Test sending email with conditional template logic"""
        # Arrange
        subject = "Conditional Email"
        recipient_email = "test@example.com"
        template_name = "conditional_template.html"
        template_vars = {"has_tasks": True, "task_count": 3}

        # Create test template with conditional logic
        template_content = """
        <html>
            <body>
                {% if has_tasks %}
                    <h1>You have {{ task_count }} tasks!</h1>
                    <p>Time to get busy!</p>
                {% else %}
                    <h1>No tasks today!</h1>
                    <p>Enjoy your free time!</p>
                {% endif %}
            </body>
        </html>
        """
        self._create_test_template(template_name, template_content)

        # Mock EmailService
        mock_email_service = Mock()
        mock_email_service_class.return_value = mock_email_service

        # Act
        with override_settings(BASE_DIR=self.temp_dir):
            send_email(subject, recipient_email, template_name, template_vars)

        # Assert
        mock_email_service.send_email.assert_called_once()
        call_args = mock_email_service.send_email.call_args
        html_content = call_args[0][2]
        assert "You have 3 tasks!" in html_content
        assert "Time to get busy!" in html_content
        assert "No tasks today!" not in html_content

    @patch("upoutodo.email.send_email.EmailService")
    def test_send_email_with_loop_template_logic(self, mock_email_service_class):
        """Test sending email with loop template logic"""
        # Arrange
        subject = "Task List"
        recipient_email = "test@example.com"
        template_name = "loop_template.html"
        template_vars = {
            "tasks": [
                {"title": "Buy groceries", "priority": "high"},
                {"title": "Call mom", "priority": "medium"},
                {"title": "Read book", "priority": "low"},
            ]
        }

        # Create test template with loop logic
        template_content = """
        <html>
            <body>
                <h1>Your Tasks:</h1>
                <ul>
                {% for task in tasks %}
                    <li>{{ task.title }} - {{ task.priority }}</li>
                {% endfor %}
                </ul>
            </body>
        </html>
        """
        self._create_test_template(template_name, template_content)

        # Mock EmailService
        mock_email_service = Mock()
        mock_email_service_class.return_value = mock_email_service

        # Act
        with override_settings(BASE_DIR=self.temp_dir):
            send_email(subject, recipient_email, template_name, template_vars)

        # Assert
        mock_email_service.send_email.assert_called_once()
        call_args = mock_email_service.send_email.call_args
        html_content = call_args[0][2]
        assert "Buy groceries - high" in html_content
        assert "Call mom - medium" in html_content
        assert "Read book - low" in html_content

    @patch("upoutodo.email.send_email.EmailService")
    def test_send_email_with_special_characters(self, mock_email_service_class):
        """Test sending email with special characters in template variables"""
        # Arrange
        subject = "Special Characters Test"
        recipient_email = "test@example.com"
        template_name = "special_chars_template.html"
        template_vars = {
            "name": "José & María",
            "message": "Hello <world> & 'everyone'!",
            "html_content": "<strong>Bold text</strong>",
        }

        # Create test template
        template_content = """
        <html>
            <body>
                <h1>Hello {{ name }}!</h1>
                <p>{{ message }}</p>
                <div>{{ html_content }}</div>
            </body>
        </html>
        """
        self._create_test_template(template_name, template_content)

        # Mock EmailService
        mock_email_service = Mock()
        mock_email_service_class.return_value = mock_email_service

        # Act
        with override_settings(BASE_DIR=self.temp_dir):
            send_email(subject, recipient_email, template_name, template_vars)

        # Assert
        mock_email_service.send_email.assert_called_once()
        call_args = mock_email_service.send_email.call_args
        html_content = call_args[0][2]
        assert "Hello José & María!" in html_content
        assert "Hello <world> & 'everyone'!" in html_content
        assert "<strong>Bold text</strong>" in html_content

    @patch("upoutodo.email.send_email.EmailService")
    def test_send_email_with_numeric_variables(self, mock_email_service_class):
        """Test sending email with numeric template variables"""
        # Arrange
        subject = "Numeric Test"
        recipient_email = "test@example.com"
        template_name = "numeric_template.html"
        template_vars = {"count": 42, "percentage": 85.5, "price": 19.99}

        # Create test template
        template_content = """
        <html>
            <body>
                <p>Count: {{ count }}</p>
                <p>Percentage: {{ percentage }}%</p>
                <p>Price: ${{ price }}</p>
            </body>
        </html>
        """
        self._create_test_template(template_name, template_content)

        # Mock EmailService
        mock_email_service = Mock()
        mock_email_service_class.return_value = mock_email_service

        # Act
        with override_settings(BASE_DIR=self.temp_dir):
            send_email(subject, recipient_email, template_name, template_vars)

        # Assert
        mock_email_service.send_email.assert_called_once()
        call_args = mock_email_service.send_email.call_args
        html_content = call_args[0][2]
        assert "Count: 42" in html_content
        assert "Percentage: 85.5%" in html_content
        assert "Price: $19.99" in html_content

    @patch("upoutodo.email.send_email.EmailService")
    def test_send_email_with_boolean_variables(self, mock_email_service_class):
        """Test sending email with boolean template variables"""
        # Arrange
        subject = "Boolean Test"
        recipient_email = "test@example.com"
        template_name = "boolean_template.html"
        template_vars = {
            "is_active": True,
            "has_permission": False,
            "show_details": True,
        }

        # Create test template
        template_content = """
        <html>
            <body>
                <p>Active: {{ is_active }}</p>
                <p>Permission: {{ has_permission }}</p>
                <p>Show Details: {{ show_details }}</p>
            </body>
        </html>
        """
        self._create_test_template(template_name, template_content)

        # Mock EmailService
        mock_email_service = Mock()
        mock_email_service_class.return_value = mock_email_service

        # Act
        with override_settings(BASE_DIR=self.temp_dir):
            send_email(subject, recipient_email, template_name, template_vars)

        # Assert
        mock_email_service.send_email.assert_called_once()
        call_args = mock_email_service.send_email.call_args
        html_content = call_args[0][2]
        assert "Active: True" in html_content
        assert "Permission: False" in html_content
        assert "Show Details: True" in html_content

    @patch("upoutodo.email.send_email.EmailService")
    def test_send_email_with_none_variables(self, mock_email_service_class):
        """Test sending email with None values in template variables"""
        # Arrange
        subject = "None Test"
        recipient_email = "test@example.com"
        template_name = "none_template.html"
        template_vars = {
            "name": None,
            "description": "Some description",
            "optional_field": None,
        }

        # Create test template
        template_content = """
        <html>
            <body>
                <p>Name: {{ name or 'Unknown' }}</p>
                <p>Description: {{ description }}</p>
                <p>Optional: {{ optional_field or 'Not provided' }}</p>
            </body>
        </html>
        """
        self._create_test_template(template_name, template_content)

        # Mock EmailService
        mock_email_service = Mock()
        mock_email_service_class.return_value = mock_email_service

        # Act
        with override_settings(BASE_DIR=self.temp_dir):
            send_email(subject, recipient_email, template_name, template_vars)

        # Assert
        mock_email_service.send_email.assert_called_once()
        call_args = mock_email_service.send_email.call_args
        html_content = call_args[0][2]
        assert "Name: Unknown" in html_content
        assert "Description: Some description" in html_content
        assert "Optional: Not provided" in html_content

    @patch("upoutodo.email.send_email.EmailService")
    def test_send_email_with_long_content(self, mock_email_service_class):
        """Test sending email with long content"""
        # Arrange
        subject = "Long Content Test"
        recipient_email = "test@example.com"
        template_name = "long_content_template.html"
        template_vars = {
            "long_text": "A" * 1000,  # 1000 character string
            "paragraphs": ["Paragraph " + str(i) + " content." for i in range(10)],
        }

        # Create test template
        template_content = """
        <html>
            <body>
                <h1>Long Content Email</h1>
                <p>{{ long_text }}</p>
                {% for paragraph in paragraphs %}
                    <p>{{ paragraph }}</p>
                {% endfor %}
            </body>
        </html>
        """
        self._create_test_template(template_name, template_content)

        # Mock EmailService
        mock_email_service = Mock()
        mock_email_service_class.return_value = mock_email_service

        # Act
        with override_settings(BASE_DIR=self.temp_dir):
            send_email(subject, recipient_email, template_name, template_vars)

        # Assert
        mock_email_service.send_email.assert_called_once()
        call_args = mock_email_service.send_email.call_args
        html_content = call_args[0][2]
        assert "A" * 1000 in html_content
        assert "Paragraph 0 content." in html_content
        assert "Paragraph 9 content." in html_content
        assert len(html_content) > 1000  # Should be longer than the input

    @patch("upoutodo.email.send_email.EmailService")
    def test_send_email_creates_new_email_service_instance(
        self, mock_email_service_class
    ):
        """Test that send_email creates a new EmailService instance each time"""
        # Arrange
        subject = "Test Subject"
        recipient_email = "test@example.com"
        template_name = "test_template.html"
        template_vars = {"name": "Test"}

        # Create test template
        template_content = "<html><body>Hello {{ name }}!</body></html>"
        self._create_test_template(template_name, template_content)

        # Mock EmailService
        mock_email_service = Mock()
        mock_email_service_class.return_value = mock_email_service

        # Act
        with override_settings(BASE_DIR=self.temp_dir):
            send_email(subject, recipient_email, template_name, template_vars)
            send_email(subject, recipient_email, template_name, template_vars)

        # Assert
        assert mock_email_service_class.call_count == 2
        assert mock_email_service.send_email.call_count == 2
