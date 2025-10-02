import { FeedbackWidget } from "@/components/widget/feedback-widget";
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: { locale: string };
};

export default function Home({ params: { locale } }: Props) {
  setRequestLocale(locale);

  // TODO: Replace with actual projectId from database
  const projectId = "demo-project-123";

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">HappyCust</h1>
        <p className="mt-4 text-gray-600">Customer Feedback Widget</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Click the button in the bottom right to test the widget
        </p>
      </main>

      <FeedbackWidget projectId={projectId} />
    </>
  );
}
