import { TopicPerformance } from "@/types/dashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface TopicPerformanceTableProps {
  title: string;
  description: string;
  topics: TopicPerformance[];
  loading?: boolean;
}

export function TopicPerformanceTable({
  title,
  description,
  topics,
  loading,
}: TopicPerformanceTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          No topic data available yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic</TableHead>
              <TableHead className="text-right">Accuracy</TableHead>
              <TableHead className="text-right">Attempted</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic, i) => {
              const acc = Math.round(topic.accuracy);
              let status: "Strong" | "Good" | "Needs Practice" = "Needs Practice";
              let badgeVariant: "default" | "secondary" | "destructive" = "destructive";

              if (acc >= 80) {
                status = "Strong";
                badgeVariant = "default";
              } else if (acc >= 60) {
                status = "Good";
                badgeVariant = "secondary";
              }

              return (
                <TableRow key={i}>
                  <TableCell className="font-medium truncate max-w-[120px]" title={topic.topic}>
                    {topic.topic}
                  </TableCell>
                  <TableCell className="text-right">{acc}%</TableCell>
                  <TableCell className="text-right">{topic.attempts}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={badgeVariant}>{status}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
