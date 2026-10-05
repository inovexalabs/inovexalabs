-- Starting content for the seven service pages, plus a footer link to /team.
--
-- The services were created with a title and summary only, so every detail
-- section on /services/[slug] stayed hidden. Each update below only applies
-- while that service is still untouched (empty overview and features), so
-- anything already written in /admin/services is never overwritten.
-- Everything here is editable afterwards from the admin panel. Safe to re-run.

update public.services set
  overview = $$Off-the-shelf tools stop fitting once your process becomes the thing that sets you apart. We design and build software around the way your team actually works: internal platforms, customer portals, back-office systems and the integrations that hold them together.

Every build starts with a short discovery phase, ships in reviewable increments, and ends with code, documentation and infrastructure that you own outright.$$,
  problems = $$[
    {"title": "Spreadsheets running the business", "description": "Critical workflows live in shared spreadsheets and email threads, so errors are common and nobody has the full picture."},
    {"title": "Tools that don't talk to each other", "description": "Data is re-typed between systems, reports disagree, and every new tool adds another manual step."},
    {"title": "Legacy software holding you back", "description": "An ageing system is expensive to change, hard to hire for, and risky to touch."}
  ]$$::jsonb,
  features = $$[
    {"title": "Internal platforms", "description": "Admin panels, operations dashboards and workflow tools shaped around your processes."},
    {"title": "Customer portals", "description": "Secure self-service areas where customers can track orders, manage accounts and get answers."},
    {"title": "Integrations and APIs", "description": "Reliable connections between your CRM, accounting, payments and the rest of your stack."},
    {"title": "Legacy modernisation", "description": "Incremental rewrites that replace old systems piece by piece without stopping the business."}
  ]$$::jsonb,
  technologies = array['TypeScript', 'Next.js', 'Node.js', 'Python', 'PostgreSQL', 'Supabase', 'Docker'],
  process = $$[
    {"title": "Discovery", "description": "We map the current workflow, the people involved and what success looks like before writing code."},
    {"title": "Scope and architecture", "description": "We agree what ships first, how the system is structured and what it will cost to run."},
    {"title": "Build in increments", "description": "You review working software every week and steer priorities as the product takes shape."},
    {"title": "Launch and handover", "description": "We deploy, document and train your team, then stay on for support and improvements."}
  ]$$::jsonb,
  outcomes = $$[
    {"title": "Less manual work", "description": "Repetitive steps are automated so your team spends time on decisions, not data entry."},
    {"title": "One source of truth", "description": "Everyone works from the same up-to-date data instead of conflicting copies."},
    {"title": "Software you own", "description": "Full access to the code, infrastructure and documentation, with no lock-in."}
  ]$$::jsonb,
  faqs = $$[
    {"question": "Who owns the code?", "answer": "You do. The repository, infrastructure accounts and documentation are yours from the first commit."},
    {"question": "Can you work with our existing system?", "answer": "Yes. We often extend or integrate with existing software, and can replace it gradually when that makes more sense than a rewrite."},
    {"question": "How long does a typical project take?", "answer": "A focused first release usually takes 6–12 weeks. We agree the scope and timeline during discovery, before the build starts."}
  ]$$::jsonb
where slug = 'custom-software' and overview = '' and features = '[]'::jsonb;

update public.services set
  overview = $$Your website is often the first conversation a customer has with you. We build fast, accessible websites and web applications that load quickly on any device, rank well in search, and are easy for your team to update.

From marketing sites to full web apps with accounts, payments and dashboards, we use modern, well-supported frameworks so the result is maintainable long after launch.$$,
  problems = $$[
    {"title": "A slow, outdated site", "description": "Pages load slowly, look dated on mobile and quietly lose visitors before they ever get in touch."},
    {"title": "Every change needs a developer", "description": "Simple content updates wait in a queue because the site was never built to be edited."},
    {"title": "Poor search visibility", "description": "Technical issues and thin structure keep the site from ranking for the searches that matter."}
  ]$$::jsonb,
  features = $$[
    {"title": "Marketing websites", "description": "Fast, search-friendly sites with a content management system your team can use."},
    {"title": "Web applications", "description": "Dashboards, booking systems and SaaS products with accounts, roles and payments."},
    {"title": "Accessibility and performance", "description": "Sites built to accessibility guidelines and tuned for Core Web Vitals."},
    {"title": "E-commerce", "description": "Online stores and checkout flows integrated with your payment and inventory systems."}
  ]$$::jsonb,
  technologies = array['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Supabase', 'Vercel'],
  process = $$[
    {"title": "Discovery", "description": "We learn who the site is for, what it needs to achieve and how it will be measured."},
    {"title": "Design", "description": "Wireframes and visual design reviewed with you before anything is built."},
    {"title": "Build", "description": "Development in short cycles with a live preview you can review at every step."},
    {"title": "Launch", "description": "Testing, redirects, analytics and a smooth go-live, followed by support."}
  ]$$::jsonb,
  outcomes = $$[
    {"title": "Faster pages", "description": "Lightweight, optimised pages that keep visitors engaged on every device."},
    {"title": "Easier updates", "description": "Your team edits content directly, without waiting for a developer."},
    {"title": "Built to be found", "description": "Clean structure, metadata and performance that support search visibility."}
  ]$$::jsonb,
  faqs = $$[
    {"question": "Will I be able to edit the site myself?", "answer": "Yes. We set up a content management system and show your team how to update pages, posts and images."},
    {"question": "Do you redesign existing sites?", "answer": "Yes. We can redesign and rebuild an existing site while keeping your search rankings intact with proper redirects."},
    {"question": "Is hosting included?", "answer": "We set up hosting on a reliable platform in your name and can manage it for you, or hand it over to your team."}
  ]$$::jsonb
where slug = 'web-development' and overview = '' and features = '[]'::jsonb;

update public.services set
  overview = $$We design and build mobile apps for iOS and Android, from the first clickable prototype through to app store release and beyond.

We focus on the parts that decide whether an app gets used: a smooth first experience, reliable offline behaviour, sensible notifications and a backend that scales with your users.$$,
  problems = $$[
    {"title": "An idea without a clear first version", "description": "It is hard to know which features belong in a first release and which can wait."},
    {"title": "Two platforms, double the cost", "description": "Building separate iOS and Android apps doubles the work and slows every change."},
    {"title": "Apps that people stop using", "description": "Clunky onboarding and unreliable performance mean users uninstall after a day."}
  ]$$::jsonb,
  features = $$[
    {"title": "Cross-platform apps", "description": "One codebase for iOS and Android, with native performance where it matters."},
    {"title": "Prototypes and MVPs", "description": "Clickable prototypes and focused first releases to test your idea with real users."},
    {"title": "Backend and APIs", "description": "Accounts, data sync, push notifications and payments behind the app."},
    {"title": "App store release", "description": "Store listings, review guidelines and release management handled for you."}
  ]$$::jsonb,
  technologies = array['React Native', 'Expo', 'TypeScript', 'Swift', 'Kotlin', 'Supabase', 'Firebase'],
  process = $$[
    {"title": "Prototype", "description": "A clickable prototype to validate the core flow before committing to a build."},
    {"title": "MVP build", "description": "The smallest version that delivers real value, built and tested on real devices."},
    {"title": "Release", "description": "App store submission, analytics and crash reporting from day one."},
    {"title": "Iterate", "description": "Improvements driven by usage data and user feedback."}
  ]$$::jsonb,
  outcomes = $$[
    {"title": "Faster to market", "description": "A focused first release gets your app in front of users sooner."},
    {"title": "One codebase", "description": "Shared code across platforms keeps development and maintenance costs down."},
    {"title": "Measurable usage", "description": "Analytics show how people use the app, so every update is informed."}
  ]$$::jsonb,
  faqs = $$[
    {"question": "Native or cross-platform?", "answer": "For most apps we recommend a cross-platform approach, which shares one codebase across iOS and Android. We use native code when a feature genuinely needs it."},
    {"question": "Do you handle app store submission?", "answer": "Yes. We prepare the listings, handle review requirements and manage releases in your developer accounts."},
    {"question": "Can you take over an existing app?", "answer": "Yes. We start with a short review of the codebase, then agree a plan to stabilise and improve it."}
  ]$$::jsonb
where slug = 'mobile-development' and overview = '' and features = '[]'::jsonb;

update public.services set
  overview = $$AI is useful when it solves a specific problem with data you already have. We help you find those problems, then build AI features, data pipelines and models that run reliably in production — not just in a demo.

We are careful about cost, privacy and accuracy, and we measure results against a clear baseline so you can see whether the system is actually helping.$$,
  problems = $$[
    {"title": "Unclear where AI fits", "description": "There is pressure to use AI, but no clear view of which problems it would genuinely solve."},
    {"title": "Data scattered everywhere", "description": "Useful data sits in different systems and formats, so it cannot be used for analysis or models."},
    {"title": "Prototypes that never ship", "description": "Promising experiments stall because nobody planned for production, cost or monitoring."}
  ]$$::jsonb,
  features = $$[
    {"title": "AI-powered features", "description": "Search, summarisation, classification and assistants built into your product."},
    {"title": "Document and data extraction", "description": "Turn invoices, forms and emails into structured data automatically."},
    {"title": "Data pipelines", "description": "Reliable pipelines that collect, clean and prepare data for reporting and models."},
    {"title": "Custom models", "description": "Training and fine-tuning when an off-the-shelf model is not good enough."}
  ]$$::jsonb,
  technologies = array['Python', 'PyTorch', 'TensorFlow', 'OpenAI APIs', 'LangChain', 'PostgreSQL', 'pgvector'],
  process = $$[
    {"title": "Use-case discovery", "description": "We identify the problems where AI can make a measurable difference."},
    {"title": "Data review", "description": "We assess the data available, its quality and any privacy constraints."},
    {"title": "Prototype and evaluate", "description": "A working prototype tested against real examples and a clear baseline."},
    {"title": "Productionise", "description": "Deployment with monitoring, cost controls and a way to improve over time."}
  ]$$::jsonb,
  outcomes = $$[
    {"title": "Time saved", "description": "Repetitive reading, sorting and data entry handled automatically."},
    {"title": "Better decisions", "description": "Clean, connected data that supports reporting and forecasting."},
    {"title": "Controlled costs", "description": "Systems designed to stay accurate and affordable as usage grows."}
  ]$$::jsonb,
  faqs = $$[
    {"question": "Is our data used to train public models?", "answer": "No. We use providers and settings that keep your data private, and can run models on your own infrastructure when required."},
    {"question": "How do you measure accuracy?", "answer": "We build an evaluation set from real examples before launch and track performance against it over time."},
    {"question": "Do we need a lot of data?", "answer": "Not always. Many useful features work with existing models and a modest amount of your own data."}
  ]$$::jsonb
where slug = 'ai-machine-learning' and overview = '' and features = '[]'::jsonb;

update public.services set
  overview = $$Security problems are cheapest to fix before they reach production. We review applications and infrastructure, fix what we find, and put monitoring in place so issues are caught early.

Our work is practical: clear findings ranked by risk, fixes your team can apply, and secure defaults built into the way you ship software.$$,
  problems = $$[
    {"title": "Unknown exposure", "description": "You are not sure which systems, accounts or data are exposed, or how an attacker would get in."},
    {"title": "Compliance pressure", "description": "Customers and regulators ask security questions you cannot answer with confidence."},
    {"title": "No early warning", "description": "Without monitoring, incidents are discovered late — often by someone outside the company."}
  ]$$::jsonb,
  features = $$[
    {"title": "Security reviews", "description": "Application and infrastructure reviews with findings ranked by real-world risk."},
    {"title": "Hardening", "description": "Secure configuration of cloud accounts, servers, databases and access controls."},
    {"title": "Secure development", "description": "Code review, dependency scanning and secure defaults in your delivery pipeline."},
    {"title": "Monitoring and response", "description": "Logging, alerting and a clear plan for what to do when something goes wrong."}
  ]$$::jsonb,
  technologies = array['OWASP', 'Cloudflare', 'AWS', 'Linux', 'Docker', 'GitHub Actions'],
  process = $$[
    {"title": "Scope", "description": "We agree which systems are reviewed and how testing is carried out safely."},
    {"title": "Assess", "description": "We review configuration, code and access, and test for common weaknesses."},
    {"title": "Report", "description": "A clear report with findings ranked by risk and practical fixes for each."},
    {"title": "Remediate", "description": "We help apply the fixes and re-test to confirm they work."}
  ]$$::jsonb,
  outcomes = $$[
    {"title": "Reduced risk", "description": "The most likely attack paths are closed before they can be used."},
    {"title": "Clear answers", "description": "Confidence when customers, partners or auditors ask about security."},
    {"title": "Earlier detection", "description": "Monitoring that surfaces suspicious activity while it can still be contained."}
  ]$$::jsonb,
  faqs = $$[
    {"question": "Will testing disrupt our systems?", "answer": "No. We agree the scope and timing in advance and test in a way that avoids disrupting live services."},
    {"question": "Do you fix the issues or just report them?", "answer": "Both. Every finding comes with a practical fix, and we can apply the fixes with your team."},
    {"question": "How often should we review security?", "answer": "At least once a year, and whenever you make a significant change such as a new product, integration or cloud migration."}
  ]$$::jsonb
where slug = 'cybersecurity' and overview = '' and features = '[]'::jsonb;

update public.services set
  overview = $$Most teams lose hours every week to copying data between tools, chasing approvals and sending the same updates by hand. We find those repetitive steps and automate them with reliable workflows and integrations.

Automations are documented, monitored and easy to adjust, so they keep working as your processes change.$$,
  problems = $$[
    {"title": "Hours lost to copy and paste", "description": "The same data is entered into several tools by hand, which is slow and error-prone."},
    {"title": "Processes that depend on memory", "description": "Approvals, follow-ups and reminders only happen if someone remembers to do them."},
    {"title": "Fragile automations", "description": "Existing scripts and zaps break silently, and nobody knows until something goes wrong."}
  ]$$::jsonb,
  features = $$[
    {"title": "Workflow automation", "description": "Approvals, notifications and hand-offs that run on their own, with a clear audit trail."},
    {"title": "System integrations", "description": "Connections between your CRM, finance, support and internal tools."},
    {"title": "Document automation", "description": "Quotes, invoices, contracts and reports generated from your data."},
    {"title": "Scheduled jobs and reporting", "description": "Regular syncs, clean-ups and reports delivered without anyone pressing a button."}
  ]$$::jsonb,
  technologies = array['Node.js', 'Python', 'n8n', 'Zapier', 'Make', 'REST APIs', 'Webhooks'],
  process = $$[
    {"title": "Map the workflow", "description": "We document how the process works today and where time is lost."},
    {"title": "Prioritise", "description": "We pick the automations with the biggest time savings and lowest risk."},
    {"title": "Build and test", "description": "Automations built with error handling and tested on real cases."},
    {"title": "Monitor", "description": "Alerts and logs so failures are visible and quick to fix."}
  ]$$::jsonb,
  outcomes = $$[
    {"title": "Hours back each week", "description": "Repetitive work handled automatically, so your team focuses on higher-value tasks."},
    {"title": "Fewer errors", "description": "Data moves between systems consistently, without manual re-typing."},
    {"title": "Processes that scale", "description": "Workflows keep up as volume grows, without adding headcount."}
  ]$$::jsonb,
  faqs = $$[
    {"question": "Do you use no-code tools or custom code?", "answer": "Whichever fits. No-code tools are great for simple flows; custom code is better for complex, high-volume or sensitive processes."},
    {"question": "What happens when an automation fails?", "answer": "We build in error handling and alerts, so failures are reported immediately with enough detail to fix them."},
    {"question": "Can our team change the automations later?", "answer": "Yes. We document each workflow and can set them up so your team can adjust common settings without a developer."}
  ]$$::jsonb
where slug = 'automation' and overview = '' and features = '[]'::jsonb;

update public.services set
  overview = $$Reliable software needs reliable infrastructure. We design cloud environments that are secure by default, cost-efficient and defined as code, so they can be reproduced, reviewed and changed safely.

Whether you are moving to the cloud, tidying up an environment that grew without a plan, or setting up deployment pipelines, we leave you with infrastructure your team understands.$$,
  problems = $$[
    {"title": "Rising cloud bills", "description": "Costs grow every month, and nobody is sure which resources are still needed."},
    {"title": "Risky deployments", "description": "Releases are manual and nerve-racking, so they happen less often than they should."},
    {"title": "Infrastructure nobody understands", "description": "The environment was set up by hand, and changing it feels dangerous."}
  ]$$::jsonb,
  features = $$[
    {"title": "Cloud architecture", "description": "Environments designed for reliability, security and sensible cost on AWS and other providers."},
    {"title": "Infrastructure as code", "description": "Every resource defined in version-controlled code that can be reviewed and reproduced."},
    {"title": "CI/CD pipelines", "description": "Automated testing and deployment so releases are routine, not risky."},
    {"title": "Cloud migration", "description": "Moving applications and data to the cloud with minimal downtime."}
  ]$$::jsonb,
  technologies = array['AWS', 'Cloudflare', 'Docker', 'Terraform', 'Kubernetes', 'GitHub Actions', 'Linux'],
  process = $$[
    {"title": "Assess", "description": "We review your current setup, costs, risks and deployment process."},
    {"title": "Design", "description": "A target architecture with a clear migration or improvement plan."},
    {"title": "Implement", "description": "Infrastructure as code and pipelines rolled out in safe, reversible steps."},
    {"title": "Hand over", "description": "Documentation, runbooks and training so your team can run it confidently."}
  ]$$::jsonb,
  outcomes = $$[
    {"title": "Predictable costs", "description": "Right-sized resources and visibility into where the money goes."},
    {"title": "Confident releases", "description": "Automated pipelines make deploying a routine, low-risk task."},
    {"title": "Reproducible environments", "description": "Infrastructure that can be rebuilt from code at any time."}
  ]$$::jsonb,
  faqs = $$[
    {"question": "Which cloud providers do you work with?", "answer": "Mostly AWS and Cloudflare, plus platforms such as Vercel and Supabase. We recommend what fits your needs and budget."},
    {"question": "Will a migration cause downtime?", "answer": "We plan migrations to keep downtime to a minimum, often with none at all, and always with a rollback plan."},
    {"question": "Can you reduce our current cloud costs?", "answer": "Usually, yes. A cost review often finds unused resources, oversized servers and pricing options that lower the bill."}
  ]$$::jsonb
where slug = 'cloud-infrastructure' and overview = '' and features = '[]'::jsonb;

-- Footer link to the new /team page (header stays as it is).
insert into public.navigation_items (label, href, location, sort_order, status)
select 'Team', '/team', 'footer', 45, 'published'
where not exists (
  select 1 from public.navigation_items where href = '/team' and location = 'footer'
);
