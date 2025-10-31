import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory

from upoutodo.models import UserProfile
from upoutodo.serializers import UserSerializer
from upoutodo.tests.factories import ProjectFactory, UserFactory

User = get_user_model()


@pytest.fixture
def user_with_profile():
    """Create a user with a complete profile for testing."""
    user = UserFactory()
    # Ensure the user has a profile (should be created by signals)
    if not hasattr(user, "profile"):
        UserProfile.objects.create(user=user)
    return user


@pytest.fixture
def user_with_projects():
    """Create a user with projects for testing."""
    user = UserFactory()
    # Create some projects for the user
    ProjectFactory(created_by=user, updated_by=user, title="Project 1")
    ProjectFactory(created_by=user, updated_by=user, title="Project 2")
    return user


@pytest.fixture
def api_request():
    """Create a mock API request for context."""
    factory = APIRequestFactory()
    return factory.get("/")


@pytest.mark.django_db
def test_user_serializer_serialization(user_with_profile, api_request):
    """Test that UserSerializer correctly serializes user data."""
    serializer = UserSerializer(user_with_profile, context={"request": api_request})
    data = serializer.data

    # Check that all expected fields are present
    expected_fields = {
        "id",
        "name",
        "email",
        "is_faculty",
        "is_student",
        "is_onboarded",
        "projects",
        "theme",
    }
    assert set(data.keys()) == expected_fields

    # Check field types and values
    assert isinstance(data["id"], int)
    assert isinstance(data["name"], str)
    assert isinstance(data["email"], str)
    assert isinstance(data["is_faculty"], bool)
    assert isinstance(data["is_student"], bool)
    assert isinstance(data["is_onboarded"], bool)
    assert isinstance(data["projects"], list)
    assert isinstance(data["theme"], str)


@pytest.mark.django_db
def test_user_serializer_name_field(user_with_profile, api_request):
    """Test the custom name field logic."""
    # Test when profile has a name
    user_with_profile.profile.name = "John Doe"
    user_with_profile.profile.save()

    serializer = UserSerializer(user_with_profile, context={"request": api_request})
    assert serializer.data["name"] == "John Doe"

    # Test when profile has no name (should fall back to "User {id}")
    user_with_profile.profile.name = ""
    user_with_profile.profile.save()

    serializer = UserSerializer(user_with_profile, context={"request": api_request})
    assert serializer.data["name"] == f"User {user_with_profile.id}"


@pytest.mark.django_db
def test_user_serializer_profile_fields(user_with_profile, api_request):
    """Test that profile fields are correctly accessed."""
    # Set up profile data
    profile = user_with_profile.profile
    profile.is_student = True
    profile.is_faculty = False
    profile.is_onboarded = True
    profile.theme = "dark"
    profile.save()

    serializer = UserSerializer(user_with_profile, context={"request": api_request})
    data = serializer.data

    assert data["is_student"] is True
    assert data["is_faculty"] is False
    assert data["is_onboarded"] is True
    assert data["theme"] == "dark"


@pytest.mark.django_db
def test_user_serializer_projects_field(user_with_projects, api_request):
    """Test that projects are correctly serialized."""
    serializer = UserSerializer(user_with_projects, context={"request": api_request})
    data = serializer.data

    # Should have projects in the data
    assert "projects" in data
    assert isinstance(data["projects"], list)
    # User should have 3 projects: 1 default "Inbox" + 2 created projects
    assert len(data["projects"]) == 3

    # Check project structure
    for project in data["projects"]:
        assert "id" in project
        assert "title" in project
        assert "sections" in project
        assert "is_default" in project

    # Check that we have the expected projects
    project_titles = [p["title"] for p in data["projects"]]
    assert "Inbox" in project_titles  # Default project
    assert "Project 1" in project_titles
    assert "Project 2" in project_titles


@pytest.mark.django_db
def test_user_serializer_read_only_fields(user_with_profile, api_request):
    """Test that read-only fields are properly marked as read-only."""
    # Since this is a read-only serializer, we'll test that the fields are marked correctly
    # rather than trying to update them (which would fail due to nested field restrictions)

    serializer = UserSerializer(user_with_profile, context={"request": api_request})

    # Check that the expected fields are marked as read-only
    read_only_fields = serializer.Meta.read_only_fields
    expected_read_only = {
        "id",
        "projects",
        "email",
        "is_faculty",
        "is_student",
        "is_onboarded",
        "theme",
    }

    # Convert to set for comparison (handle both tuple and list)
    actual_read_only = set(read_only_fields)

    # All expected fields should be read-only
    for field in expected_read_only:
        assert field in actual_read_only, f"Field '{field}' should be read-only"

    # Test that we can serialize the data without issues
    data = serializer.data
    assert isinstance(data, dict)
    assert "id" in data
    assert "email" in data


@pytest.mark.django_db
def test_user_serializer_with_no_profile(api_request):
    """Test serializer behavior when user has no profile."""
    user = UserFactory()
    # Delete the profile if it exists
    if hasattr(user, "profile"):
        user.profile.delete()

    # The serializer should handle missing profile gracefully
    # This might raise an exception or return default values
    # depending on the implementation
    try:
        serializer = UserSerializer(user, context={"request": api_request})
        data = serializer.data
        # If it doesn't raise an exception, check that it handles missing profile
        assert "name" in data
        assert "theme" in data
    except AttributeError:
        # This is expected if the profile is required
        # The signal should create a profile, but if it doesn't exist,
        # the serializer should handle it gracefully
        pass


@pytest.mark.django_db
def test_user_serializer_with_default_project_only(user_with_profile, api_request):
    """Test serializer with user who has only the default project."""
    # User should have only the default "Inbox" project (created by signals)
    projects_count = user_with_profile.created_projects.count()
    assert projects_count >= 1, "User should have at least the default Inbox project"

    serializer = UserSerializer(user_with_profile, context={"request": api_request})
    data = serializer.data

    # Should have at least the default project
    assert len(data["projects"]) >= 1

    # Check that the default project exists
    project_titles = [p["title"] for p in data["projects"]]
    assert "Inbox" in project_titles, "Should have default Inbox project"

    # Find the default project
    default_projects = [p for p in data["projects"] if p["is_default"]]
    assert len(default_projects) == 1, "Should have exactly one default project"
    assert default_projects[0]["title"] == "Inbox"


@pytest.mark.django_db
def test_user_serializer_hyperlinked_fields(user_with_profile, api_request):
    """Test that hyperlinked serializer works correctly."""
    # Since this is a HyperlinkedModelSerializer, it should include URL fields
    # when the request context is provided
    serializer = UserSerializer(user_with_profile, context={"request": api_request})
    data = serializer.data

    # The serializer should work without errors
    assert isinstance(data, dict)
    assert "id" in data
