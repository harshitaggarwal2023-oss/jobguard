import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobGuard — ML-Powered Fake Job Detector",
  description:
    "Verify any job posting instantly with our RandomForest model trained on 17,880 real labeled samples. 5,193 signals analyzed in under 2 seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-inter antialiased">
        <Providers>
          <div className="aurora-background" />
          <div className="relative z-10 min-h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
