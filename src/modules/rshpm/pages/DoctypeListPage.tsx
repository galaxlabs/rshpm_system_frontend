// src/modules/rshpm/pages/DoctypeListPage.tsx
import { useParams } from "react-router-dom";
import ResourceListPage from "@/components/ResourceListPage";

export default function DoctypeListPage() {
  const { doctype } = useParams();
  if (!doctype) return null;

  // Decide base path convention here:
  // Example routes: /rshpm/:doctype
  return <ResourceListPage doctype={doctype} basePath={`/rshpm/${doctype}`} />;
}
