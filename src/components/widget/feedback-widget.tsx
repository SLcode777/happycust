"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
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

  // Send height updates to parent window when in embedded mode
  useEffect(() => {
    if (!embedded) return;

    const sendHeight = () => {
      // Fixed height for menu, dynamic for forms
      let height;
      if (currentView === "menu") {
        height = 380; // Fixed height for menu
      } else {
        const container = document.getElementById("widget-container");
        if (container) {
          height = Math.max(container.offsetHeight + 20, 400);
        } else {
          height = 500;
        }
      }
      window.parent.postMessage({ type: "happycust-resize", height }, "*");
    };

    // Send height multiple times to ensure it's captured
    const timers = [
      setTimeout(sendHeight, 0),
      setTimeout(sendHeight, 50),
      setTimeout(sendHeight, 150),
      setTimeout(sendHeight, 300),
    ];

    // Also use ResizeObserver for dynamic changes (only for forms, not menu)
    if (currentView !== "menu") {
      const container = document.getElementById("widget-container");
      if (container) {
        const observer = new ResizeObserver(() => {
          sendHeight();
        });
        observer.observe(container);

        return () => {
          observer.disconnect();
          timers.forEach((t) => clearTimeout(t));
        };
      }
    }

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [embedded, currentView]);

  if (embedded) {
    return (
      <div id="widget-container" className="w-full bg-white">
        <WidgetProvider config={{ projectId, hideBranding }}>
          <div className="px-4 pt-4">
            {currentView === "menu" && (
              <FeedbackMenu
                onSelect={setCurrentView}
                onClose={handleClose}
                embedded={true}
              />
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
            <Link
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="block pt-6"
            >
              <div className="text-center text-xs text-muted-foreground">
                {t("poweredBy")}
              </div>
            </Link>
          )}
        </WidgetProvider>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 shadow-lg bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black border-2"
        size="lg"
      >
        <MessageSquare className="mr-2 h-5 w-5" />
        {t("trigger")}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop optionnel - retiré pour ne pas assombrir */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Popover */}
          <div className="fixed bottom-20 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white border rounded-lg shadow-xl p-6">
            <WidgetProvider config={{ projectId, hideBranding }}>
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>

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
                <Link
                  href="http://localhost:3000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block pt-6"
                >
                  <div className="text-center text-xs text-muted-foreground">
                    {t("poweredBy")}
                  </div>
                </Link>
              )}
            </WidgetProvider>
          </div>
        </>
      )}
    </>
  );
}
