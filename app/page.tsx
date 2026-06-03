import { Metadata } from "next";

import { RakanDashboard } from "@/components/rakan-dashboard";

export const metadata: Metadata = {
  title: "Rakan",
  description: "An application by Nathan Baylon",
};

export default function HomePage() {
  return <RakanDashboard />;
}
