// src/modules/rshpm/pages/DoctypeListPage.tsx
import { useParams } from "react-router-dom";
import ResourceListPage from "@/components/ResourceListPage";
import { resolveDoctypeName } from "@/modules/rshpm/doctypeRegistry";

export default function DoctypeListPage() {
  const { doctype } = useParams();
  if (!doctype) return null;
  const canonicalDoctype = resolveDoctypeName(doctype);

  // Decide base path convention here:
  // Example routes: /rshpm/:doctype
  return <ResourceListPage doctype={canonicalDoctype} basePath={`/rshpm/${encodeURIComponent(canonicalDoctype)}`} />;
}
