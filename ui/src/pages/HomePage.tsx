import { useQuery } from "@tanstack/react-query";

const API_URL = "http://127.0.01:8000";

function HomePage() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch(API_URL).then((res) =>
        res.json(),
      ),
  })

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page</p>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}

export default HomePage;
