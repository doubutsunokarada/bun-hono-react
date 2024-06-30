import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";

import { useQuery } from "@tanstack/react-query";

async function getTotalSpent() {
  const result = await api.expenses["total-spent"].$get();
  if (!result.ok) throw new Error("Failed to fetch total spent");
  return await result.json();
}

function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total amount you've spent</CardDescription>
      </CardHeader>
      <CardContent>{isPending ? "Loading..." : data.total}</CardContent>
    </Card>
  );
}

export default App;
