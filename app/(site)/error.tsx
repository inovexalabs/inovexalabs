"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Section } from "@/components/layout/section";
import { Button, ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ROUTES } from "@/lib/constants/routes";

interface SiteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SiteError({ error, reset }: SiteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section underHeader spacing="lg" container="narrow" labelledBy="error-title">
      <SectionHeading
        id="error-title"
        level={1}
        size="lg"
        title="This page didn't load"
        description="Something went wrong on our side. Try again, or head back to the home page."
      />
      <div className="mt-10 flex flex-wrap gap-3">
        <Button onClick={reset} size="lg">
          <RotateCcw aria-hidden="true" />
          Try again
        </Button>
        <ButtonLink href={ROUTES.home} variant="outline" size="lg">
          Go to the home page
        </ButtonLink>
      </div>
      {error.digest ? <p className="mt-8 text-sm text-fg-muted">Reference: {error.digest}</p> : null}
    </Section>
  );
}
