// import { useQuery } from "@tanstack/react-query";

export default function useSuggestedTodos() {
  const data = [];

  const tasks = [
    "Do the laundry",
    "Walk the dog",
    "Buy groceries",
    "Cook dinner",
    "Clean the house",
    "Mow the lawn",
    "Take out the trash",
    "Read a book",
    "Work out",
    "Call a friend",
    "Study for exam",
    "Pay bills",
    "Fix the sink",
    "Wash the car",
    "Plan a vacation",
    "Write a blog post",
    "Visit the doctor",
    "Buy a gift for friend",
    "Watch a movie",
    "Learn a new recipe",
    "Practice guitar",
    "Go for a run",
    "Clean the garage",
    "Plant a tree",
    "Write a letter",
    "Prepare a presentation",
    "Go grocery shopping",
    "Repair the bike",
    "Bake cookies",
    "Attend a webinar",
    "Finish the book",
    "Update resume",
    "Paint the room",
    "Call parents",
    "Organize photos",
    "Try a new restaurant",
    "Visit a museum",
    "Go hiking",
    "Plan a party",
    "Learn a new language",
    "Donate old clothes",
  ];

  for (let i = 1; i <= 1000; i++) {
    const title = tasks[i % tasks.length];
    data.push({ id: i, title, completed: false });
  }
  return {
    isPending: false,
    error: null,
    data,
  };
}
