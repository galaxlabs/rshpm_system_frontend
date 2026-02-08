import React from "react";
import { Link } from "react-router-dom";
import { DOCTYPES } from "@/modules/rshpm/doctypeRegistry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, CalendarDays, TrendingUp } from "lucide-react";

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  // Dummy KPIs for now (later we’ll load from Frappe)
  const stats = [
    { title: "Properties", value: "12", hint: "Total properties/units", icon: Building2 },
    { title: "Clients", value: "38", hint: "Active clients", icon: Users },
    { title: "Bookings", value: "7", hint: "This month", icon: CalendarDays },
    { title: "Collection", value: "PKR 0", hint: "Billing module next", icon: TrendingUp },
  ];

  const quick = DOCTYPES.filter((d) =>
    ["Property", "Client", "Booking"].includes(d.doctype)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <Badge variant="secondary">Admin</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of Property, Client, and Booking. Payments/Invoices will be added next.
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/rshpm/Booking/new">New Booking</Link>
          </Button>
          <Button asChild>
            <Link to="/rshpm/Property/new">New Property</Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} hint={s.hint} icon={s.icon} />
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Jump into your master data quickly.
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {quick.map((d) => (
              <Link
                key={d.doctype}
                to={`/rshpm/${encodeURIComponent(d.doctype)}`}
                className="rounded-xl border border-border bg-card p-4 hover:bg-muted/40 transition"
              >
                <div className="font-semibold">{d.label}</div>
                <div className="text-sm text-muted-foreground mt-1">Open list</div>
              </Link>
            ))}
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            Tip: Next we’ll add Billing (Invoices/Payments) and real KPIs here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
