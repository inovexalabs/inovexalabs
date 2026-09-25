import { TAGS, cachedRead } from "@/lib/cache";
import { getPublicClient } from "@/lib/supabase/public";
import { reportQueryError } from "@/lib/supabase/config";

/**
 * Legal documents live in `site_settings` so they are editable from the admin
 * panel without a redeploy. The bundled text below is the default, written to
 * describe how this specific site actually behaves.
 *
 * A note worth keeping: this is a good-faith description of real data
 * practices, not a substitute for review by a qualified advisor.
 */

export interface LegalDoc {
  title: string;
  updated: string;
  body: string;
}

const PRIVACY = `## What we collect

We keep this site deliberately light on data collection. There are three ways information reaches us.

**When you submit a project inquiry.** We store the name, email address, optional company, optional phone number, project type, budget range, timeline, your description, and how you heard about us — because that is what you typed into the form. We also store a one-way hash of your IP address and your browser's user-agent string, which we use solely to detect and block automated spam. We do not store the raw IP address.

**When you browse.** The site is served statically wherever possible and does not run third-party advertising or tracking scripts. Our hosting provider may keep standard server logs for security and abuse prevention.

**When you email us.** We keep the correspondence so we can answer you properly.

## Why we hold it

We use inquiry details for one purpose: to read, evaluate and respond to your message, and to keep a record of work we have been asked about. We do not sell data, we do not share it with advertisers, and we do not add you to a marketing list.

## How long we keep it

Project inquiries are retained while they are relevant to a potential or ongoing engagement. You can ask us to delete your inquiry at any time and we will do so, unless we are required to retain it for legal or accounting reasons.

## Where it is stored

Content and inquiries are stored in a PostgreSQL database hosted by Supabase. Media files are stored in Supabase Storage. The site is served from Vercel's edge network. Access to inquiry records is restricted to authenticated administrators through database-level row security policies — the public key used by this website has no read access to that table at all.

## Your rights

You can ask us to show you what we hold about you, correct it, or delete it. Email us and we will respond. If you are in a jurisdiction with a statutory data-protection regime, we will honour the rights that regime grants you.

## Cookies

See the Cookie Policy for what this site stores in your browser.

## Changes

If we change how we handle data, we will update this page and its revision date.`;

const TERMS = `## Using this site

This website is operated by Inovexa Labs. By using it you accept these terms. If you do not accept them, please do not use the site.

## Information on this site

Descriptions of services, products, experiments and timelines are provided for information. They are not an offer, a quotation, or a guarantee of a particular outcome, delivery date or price.

Where we publish status information about our own products — for example "in development" or "live" — that status is accurate at the time it was last updated and may change. Where we publish metrics, they are counted from our own records; where we do not have verified data, we omit the figure rather than estimate it.

## No guaranteed results

We do not promise search rankings, revenue, user numbers or any other outcome. Anything on this site that could be read that way is a description of intent, not a commitment.

## Intellectual property

The design, text, code and branding of this site belong to Inovexa Labs unless stated otherwise. Product names and descriptions of our own products are ours. You may read, quote briefly with attribution, and link to this site. You may not reproduce it wholesale or present it as your own.

Client names and logos appear only where we have permission. They remain the property of their respective owners.

## Engagements

Any work we do for you is governed by a separate written agreement that covers scope, intellectual property, confidentiality, payment and liability. Nothing on this website forms part of that agreement.

## Third-party links

We link to external sites where they are relevant. We are not responsible for their content or their practices.

## Availability

We aim to keep this site available and accurate but we do not guarantee uninterrupted access. We may change or remove content at any time.

## Liability

To the extent permitted by law, Inovexa Labs is not liable for indirect or consequential loss arising from use of this website. Nothing here limits liability that cannot lawfully be limited.

## Governing law

These terms are governed by the laws of Nepal, and disputes are subject to the exclusive jurisdiction of its courts.

## Contact

Questions about these terms can be sent to the email address on our contact page.`;

const COOKIES = `## The short version

This website does not use advertising cookies, tracking pixels, or third-party analytics that profile you across sites.

## What is stored in your browser

**Authentication cookies (administrators only).** If a member of our team signs in to the administration panel, Supabase sets session cookies so they stay signed in and so the database can recognise them as an authenticated administrator. These cookies are only set for people who sign in, and they are removed when the session ends or is signed out.

**Nothing else by default.** The public site does not set marketing or analytics cookies.

## Browser storage

We may use browser storage for interface preferences that never leave your device. This is not used to identify you.

## If we add analytics later

If we introduce analytics to understand which content is useful, we will describe it here, name the provider, and explain how to opt out. Any such change will be reflected on this page.

## Blocking cookies

You can block or delete cookies in your browser settings. Because this site does not rely on cookies for public functionality, blocking them will not break normal browsing.

## Contact

Questions about cookies can be sent to the email address on our contact page.`;

const FALLBACK: Record<string, LegalDoc> = {
  privacy: { title: "Privacy Policy", updated: "2026-01-01", body: PRIVACY },
  terms: { title: "Terms of Service", updated: "2026-01-01", body: TERMS },
  cookies: { title: "Cookie Policy", updated: "2026-01-01", body: COOKIES },
};

export function getLegalDoc(key: "privacy" | "terms" | "cookies") {
  return cachedRead(
    async (): Promise<LegalDoc> => {
      const db = getPublicClient();
      if (!db) return FALLBACK[key]!;

      const { data, error } = await db
        .from("site_settings")
        .select("value")
        .eq("key", `legal.${key}`)
        .maybeSingle();

      if (error) {
        reportQueryError(`getLegalDoc:${key}`, error);
        return FALLBACK[key]!;
      }

      const value = data?.value as Partial<LegalDoc> | null | undefined;
      if (value?.body) {
        return {
          title: value.title ?? FALLBACK[key]!.title,
          updated: value.updated ?? FALLBACK[key]!.updated,
          body: value.body,
        };
      }
      return FALLBACK[key]!;
    },
    ["legal-doc", key],
    [TAGS.settings],
  )();
}
