import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function MemosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Credit Memos</h2>
        <p className="text-muted-foreground">Review and export AI-generated credit memos.</p>
      </div>

      <Card className="bg-bg-surface border-border-subtle border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">No memos generated</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Memos will appear here once you upload an application document.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
