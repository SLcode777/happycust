"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { FeedbackMenu } from "./feedback-menu";
import { LeaveReviewForm } from "./leave-review-form";
import { ReportIssueForm } from "./report-issue-form";
import { RequestFeatureForm } from "./request-feature-form";
import { ShareFeedbackForm } from "./share-feedback-form";
import { WidgetProvider } from "./widget-context";

type ViewType = "menu" | "feedback" | "review" | "issue" | "feature";

interface FeedbackWidgetProps {
  projectId: string;
  embedded?: boolean;
}

export function FeedbackWidget({
  projectId,
  embedded = false,
}: FeedbackWidgetProps) {
  const t = useTranslations("widget");
  const [isOpen, setIsOpen] = useState(embedded);
  const [currentView, setCurrentView] = useState<ViewType>("menu");
  const [hideBranding, setHideBranding] = useState(false);

  // Fetch project settings
  useEffect(() => {
    const fetchProjectSettings = async () => {
      try {
        const response = await fetch(`/api/widget/project?apiKey=${projectId}`);
        const data = await response.json();
        if (data.success) {
          setHideBranding(data.data.hideBranding);
        }
      } catch (error) {
        console.error("Error fetching project settings:", error);
      }
    };

    fetchProjectSettings();
  }, [projectId]);

  const handleClose = () => {
    if (embedded) {
      // Send message to parent window to close
      window.parent.postMessage({ type: "happycust-close" }, "*");
    } else {
      setIsOpen(false);
      // Reset to menu after closing
      setTimeout(() => setCurrentView("menu"), 200);
    }
  };

  const handleBack = () => {
    setCurrentView("menu");
  };

  if (embedded) {
    return (
      <div className="w-full h-screen bg-white flex flex-col">
        <WidgetProvider config={{ projectId, hideBranding }}>
          <div className="flex-1 overflow-auto p-4">
            {currentView === "menu" && (
              <FeedbackMenu onSelect={setCurrentView} onClose={handleClose} />
            )}
            {currentView === "feedback" && (
              <ShareFeedbackForm onBack={handleBack} onClose={handleClose} />
            )}
            {currentView === "review" && (
              <LeaveReviewForm onBack={handleBack} onClose={handleClose} />
            )}
            {currentView === "issue" && (
              <ReportIssueForm onBack={handleBack} onClose={handleClose} />
            )}
            {currentView === "feature" && (
              <RequestFeatureForm onBack={handleBack} onClose={handleClose} />
            )}
          </div>

          {!hideBranding && (
            <div className="py-3 text-center text-xs text-muted-foreground border-t bg-gray-50">
              {t("poweredBy")}
            </div>
          )}
        </WidgetProvider>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        size="lg"
      >
        <MessageSquare className="mr-2 h-5 w-5" />
        {t("trigger")}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <WidgetProvider config={{ projectId, hideBranding }}>
            {currentView === "menu" && (
              <FeedbackMenu onSelect={setCurrentView} onClose={handleClose} />
            )}
            {currentView === "feedback" && (
              <ShareFeedbackForm onBack={handleBack} onClose={handleClose} />
            )}
            {currentView === "review" && (
              <LeaveReviewForm onBack={handleBack} onClose={handleClose} />
            )}
            {currentView === "issue" && (
              <ReportIssueForm onBack={handleBack} onClose={handleClose} />
            )}
            {currentView === "feature" && (
              <RequestFeatureForm onBack={handleBack} onClose={handleClose} />
            )}

            {!hideBranding && (
              <div className="mt-4 text-center text-xs text-muted-foreground">
                {t("poweredBy")}
              </div>
            )}
          </WidgetProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
