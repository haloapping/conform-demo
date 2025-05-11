import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Form Demo using Conform" },
  ];
}

export default function Dashboard() {
  return <h1>Dashboard</h1>;
}
