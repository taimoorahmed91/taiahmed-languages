import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadPDFButtonProps {
  /** Used as the PDF filename shown in the browser print dialog, e.g. "Lesson 1 – Hello" */
  title: string;
}

export function DownloadPDFButton({ title }: DownloadPDFButtonProps) {
  const handleDownload = () => {
    const prev = document.title;
    document.title = title;
    window.print();
    // Restore after the print dialog is closed (synchronous in most browsers)
    requestAnimationFrame(() => {
      document.title = prev;
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      className="no-print gap-1.5 shrink-0"
    >
      <Download className="w-4 h-4" />
      Download PDF
    </Button>
  );
}
