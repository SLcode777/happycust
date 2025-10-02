"use client";

import { Button } from "@/components/ui/button";
import { Bug, Lightbulb, MessageCircle, Star, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface FeedbackMenuProps {
  onSelect: (view: "feedback" | "review" | "issue" | "feature") => void;
  onClose: () => void;
}

export function FeedbackMenu({ onSelect, onClose }: FeedbackMenuProps) {
  const t = useTranslations("widget.menu");

  const menuItems = [
    {
      id: "feedback" as const,
      label: t("shareFeedback"),
      icon: Star,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      id: "review" as const,
      label: t("leaveReview"),
      icon: MessageCircle,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "issue" as const,
      label: t("reportIssue"),
      icon: Bug,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      id: "feature" as const,
      label: t("requestFeature"),
      icon: Lightbulb,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="relative">
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={onClose}
          className="rounded-full py-2 opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      <div className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="flex w-full gap-4 h-12 justify-start rounded-lg border p-4 transition-colors hover:bg-accent"
              variant={"outline"}
            >
              <div className={`rounded-lg p-2 ${item.bgColor}`}>
                <Icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <span className="font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
