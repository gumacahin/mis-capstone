import os
import django
import argparse
from datetime import datetime

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "upoutodo.settings")
django.setup()

from api.models import Task


def add_task(name, description=None, due_date=None):
    task = Task(name=name, description=description, due_date=due_date)
    task.save()
    print(f"Task '{name}' added successfully.")


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="Add a new task.")
    parser.add_argument("name", type=str, help="The name of the task")
    parser.add_argument(
        "--description", type=str, help="The description of the task", default=None
    )
    parser.add_argument(
        "--due_date",
        type=str,
        help="The due date of the task (YYYY-MM-DD)",
        default=None,
    )

    args = parser.parse_args()

    if args.due_date:
        try:
            datetime.strptime(args.due_date, "%Y-%m-%d")
        except ValueError:
            print("Due date must be in YYYY-MM-DD format.")
            exit(1)

    add_task(args.name, args.description, args.due_date)
