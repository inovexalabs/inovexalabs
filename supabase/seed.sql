-- Inovexa Labs seed data.
--
-- Rerunnable: rows are matched on their slug (or a fixed id for FAQs and
-- navigation), so running this file again updates the seeded content instead
-- of duplicating it. Re-running resets the seeded text fields to the values
-- below; images, galleries, metrics and links added in the admin panel are
-- never overwritten.
--
-- Trust rule: nothing here invents clients, testimonials, ratings, metrics,
-- project URLs or company statistics. Fields without verified information are
-- left NULL or empty, ready to be filled in from the admin panel.

begin;

-- ---------------------------------------------------------------------------
-- Services and homepage capabilities (unchanged; service page content comes
-- from migration 20261004122100). Existing rows are left untouched.
-- ---------------------------------------------------------------------------

insert into public.services (slug, title, summary, icon, sort_order, status)
values
  ('custom-software', 'Custom Software',
   'Bespoke platforms and internal tools engineered around how your business actually runs.',
   'code', 10, 'published'),
  ('web-development', 'Web Development',
   'Fast, accessible websites and web apps built on modern, maintainable stacks.',
   'globe', 20, 'published'),
  ('mobile-development', 'Mobile Development',
   'iOS and Android apps taken from first prototype to app store release.',
   'smartphone', 30, 'published'),
  ('ai-machine-learning', 'AI & Machine Learning',
   'Practical AI features, data pipelines and models that make it to production.',
   'brain', 40, 'published'),
  ('cybersecurity', 'Cybersecurity',
   'Security reviews, hardening and monitoring that keep your systems and data protected.',
   'shield', 50, 'published'),
  ('automation', 'Automation',
   'Workflows and integrations that take repetitive work off your team.',
   'workflow', 60, 'published'),
  ('cloud-infrastructure', 'Cloud & Infrastructure',
   'Scalable cloud architecture, CI/CD and infrastructure as code you can rely on.',
   'cloud', 70, 'published')
on conflict (slug) do nothing;

-- Homepage capabilities ("What We Build"). Editable afterwards from the admin panel.
insert into public.capabilities (slug, title, description, visual, sort_order, status)
values
  ('digital-products', 'Digital Products',
   'Web platforms, mobile apps and internal tools, designed and engineered end to end: from the first prototype to a product people rely on every day.',
   'interface', 10, 'published'),
  ('intelligent-systems', 'Intelligent Systems',
   'AI features, machine learning models and automation that run inside real products, trained on your data and measured in production.',
   'neural', 20, 'published'),
  ('secure-infrastructure', 'Secure Infrastructure',
   'Cloud architecture, hardened environments and security reviews that keep your systems fast, available and protected as they grow.',
   'shield', 30, 'published'),
  ('experimental-technology', 'Experimental Technology',
   'Prototypes and research from our innovation lab, from AI agents to Web3, that test new ideas in working code before they become products.',
   'orbit', 40, 'published')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Site settings: the singleton row is created by its migration, so it is
-- updated here. Contact details, social links, analytics and branding images
-- are not part of this spec and are left as they are.
-- ---------------------------------------------------------------------------

update public.site_settings set
  site_name = 'Inovexa Labs',
  studio_statement = 'Inovexa Labs is a software development and technology innovation studio building custom digital products, AI-powered systems, secure infrastructure, and experimental technologies for startups, businesses, and ambitious teams.',
  hero_headline = 'We Build Software.
We Explore What Comes Next.',
  hero_subheadline = 'Inovexa Labs designs and builds custom software, AI-powered applications, secure digital infrastructure, and experimental technology. From early-stage ideas to production-ready products, we turn complex problems into useful technology.',
  hero_primary_cta_label = 'Start a Project',
  hero_primary_cta_href = '/contact',
  hero_secondary_cta_label = 'Explore Our Work',
  hero_secondary_cta_href = '/projects',
  final_cta_title = 'Have an idea worth building?',
  final_cta_description = 'Tell us what you''re trying to solve. We''ll help turn the idea into a practical, scalable technology product.',
  final_cta_label = 'Let''s Build Together',
  final_cta_href = '/contact',
  footer_text = 'Inovexa Labs builds custom software, AI systems, secure infrastructure, and experimental technology for businesses, startups, and the next generation of digital products.',
  seo_title = 'Inovexa Labs | Software Development & Technology Innovation',
  seo_description = 'Inovexa Labs builds custom software, AI-powered applications, secure infrastructure, automation systems, and experimental technology for businesses and startups.'
where id = true;

-- ---------------------------------------------------------------------------
-- Projects. Client names, URLs, metrics, gallery images and cover images are
-- intentionally empty: add them in the admin panel once they are verified.
-- ---------------------------------------------------------------------------

insert into public.projects (slug, title, category, industry, short_description, description, challenge, solution, implementation, results, technologies, featured, sort_order, status)
values
  (
    'restra',
    'Restra — Restaurant Management System',
    'SaaS',
    'Restaurant Technology',
    'An all-in-one restaurant management system for POS, billing, QR ordering, inventory, staff management, order tracking, and analytics.',
    'Restra is a restaurant management platform designed to bring everyday restaurant operations into one connected system. It combines point-of-sale and billing workflows with QR ordering, menu and inventory management, staff management, order tracking, and business analytics.

The platform is designed for restaurants, cafes, hotels, and growing hospitality businesses that want to reduce operational complexity and manage their business from a centralized digital system.

Restra focuses on practical restaurant workflows rather than unnecessary complexity, helping teams manage orders, staff, inventory, billing, and reporting from a single platform.',
    'Restaurant operations often rely on disconnected tools, manual processes, and paper-based workflows. This can make order management, inventory tracking, staff coordination, billing, and reporting difficult to manage as a business grows.',
    'Restra brings core restaurant operations into one digital platform, connecting ordering, billing, inventory, staff management, order status tracking, and reporting into a unified workflow.',
    'Restra is designed around modular restaurant workflows including POS and billing, QR-based ordering, menu management, inventory management, staff and role management, order lifecycle tracking, and analytics.',
    'The product provides a centralized operational platform designed to give restaurant teams better visibility into daily activity and reduce dependence on disconnected workflows.',
    array['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Cloudflare', 'Vercel', 'PWA']::text[],
    true,
    10,
    'published'
  ),
  (
    'pahiran',
    'Pahiran — Modern E-commerce Platform',
    'E-commerce',
    'Retail & Fashion',
    'A modern e-commerce platform for showcasing products, managing inventory, and connecting customers directly with a retail business.',
    'Pahiran is a modern online shopping platform designed to help a retail business present products through a fast, responsive storefront.

The platform combines product discovery, category browsing, product details, cart functionality, and a streamlined customer checkout experience designed around direct communication with the store.',
    'Traditional social-media-first retail can make product discovery and organized browsing difficult for customers.',
    'Pahiran provides a dedicated digital storefront where products can be organized into categories, discovered through search, added to a cart, and submitted to the store through a simple purchasing workflow.',
    null,
    null,
    array['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Cloud Storage']::text[],
    true,
    20,
    'published'
  ),
  (
    'inovexa-labs-platform',
    'Inovexa Labs — Technology Studio Platform',
    'Web',
    'Technology',
    'The digital platform for Inovexa Labs, combining technology services, products, research experiments, engineering capabilities, and technical insights.',
    'The Inovexa Labs website is designed as more than a conventional agency website. It acts as the public-facing platform for the studio''s software development services, technology products, experimental research, engineering capabilities, and technical content.

The platform uses a dynamic content architecture so projects, experiments, technologies, articles, team information, testimonials, and frequently asked questions can be managed without rebuilding the website.',
    null,
    null,
    null,
    null,
    array['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion', 'Vercel', 'Cloudflare']::text[],
    true,
    30,
    'published'
  )
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  industry = excluded.industry,
  short_description = excluded.short_description,
  description = excluded.description,
  challenge = excluded.challenge,
  solution = excluded.solution,
  implementation = excluded.implementation,
  results = excluded.results,
  technologies = excluded.technologies,
  featured = excluded.featured,
  sort_order = excluded.sort_order,
  status = excluded.status;

-- ---------------------------------------------------------------------------
-- Innovation Lab. All three are internal research; stage 'research' is the
-- experiment's life cycle, separate from the publish status.
-- ---------------------------------------------------------------------------

insert into public.innovation_projects (slug, title, category, stage, description, long_description, problem, experiment, learnings, future_direction, technologies, featured, sort_order, status)
values
  (
    'trenchguard',
    'TrenchGuard — AI-Powered Smart Contract Security Research',
    'cybersecurity'::public.innovation_category,
    'research'::public.lab_stage,
    'An experimental security research platform exploring autonomous AI agents for identifying vulnerabilities in blockchain smart contracts.',
    'TrenchGuard is an experimental cybersecurity research concept exploring how autonomous AI agents could assist with smart contract security testing.

The project investigates automated vulnerability discovery, adversarial testing, intelligent analysis, and security verification within blockchain environments.

Rather than presenting the system as a finished commercial security product, the project is part of Inovexa Labs'' exploration into the intersection of artificial intelligence, cybersecurity, and Web3 infrastructure.',
    'Smart contract security analysis can require significant expertise, manual investigation, and repetitive testing. As decentralized applications become more complex, security researchers need better ways to automate portions of vulnerability discovery and analysis.',
    'Investigate how AI agents can combine code analysis, adversarial testing, and structured reasoning to assist security researchers.',
    'Automated security systems need strong isolation, deterministic testing environments, clear vulnerability validation, and human review before findings can be trusted.',
    'Explore autonomous security agents capable of analyzing smart contract behavior, generating test cases, identifying suspicious execution paths, and producing structured security findings.',
    array['AI Agents', 'Python', 'Solidity', 'Web3', 'Smart Contracts', 'Security Testing', 'LLM']::text[],
    true,
    10,
    'published'
  ),
  (
    'autonomous-ai-agent-systems',
    'Autonomous AI Agent Systems',
    'ai'::public.innovation_category,
    'research'::public.lab_stage,
    'Research into AI agents that can reason through tasks, use tools, interact with software systems, and execute structured workflows.',
    '',
    'Conventional software follows predefined instructions, while modern AI systems can reason about changing inputs. Combining these capabilities creates new possibilities for software automation.',
    null,
    null,
    'Explore reliable agent architectures for research, automation, software engineering, cybersecurity analysis, and operational workflows.',
    array['Artificial Intelligence', 'LLM', 'AI Agents', 'Python', 'APIs', 'Automation']::text[],
    false,
    20,
    'published'
  ),
  (
    'automated-api-security-research',
    'Automated API Security Research',
    'cybersecurity'::public.innovation_category,
    'research'::public.lab_stage,
    'Experimental research into automating API discovery, testing, vulnerability analysis, and security reporting.',
    '',
    'Modern applications increasingly depend on APIs, creating a large attack surface that can be difficult to test comprehensively.',
    null,
    null,
    'Build intelligent workflows that can assist security researchers with API reconnaissance, test generation, vulnerability analysis, and structured reporting.',
    array['API Security', 'Python', 'HTTP', 'Web Security', 'Automation', 'Burp Suite']::text[],
    false,
    30,
    'published'
  )
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  stage = excluded.stage,
  description = excluded.description,
  long_description = excluded.long_description,
  problem = excluded.problem,
  experiment = excluded.experiment,
  learnings = excluded.learnings,
  future_direction = excluded.future_direction,
  technologies = excluded.technologies,
  featured = excluded.featured,
  sort_order = excluded.sort_order,
  status = excluded.status;

-- ---------------------------------------------------------------------------
-- How We Work: seven stages. Durations are not part of the spec, so they are
-- left NULL; deliverables are only listed where the spec provides them.
-- ---------------------------------------------------------------------------

insert into public.process_steps (slug, title, short_description, description, icon, deliverables, duration, sort_order, status)
values
  ('discover', 'Discover',
   'Understand the problem, users, business goals, technical constraints, and success criteria before writing code.',
   'Every project starts with the problem, not the technology. We learn how the work is done today, who the product is for, what the business needs it to achieve and which constraints, such as budget, timeline, compliance and existing systems, shape the solution. The result is a shared definition of success before any code is written.',
   'compass', array['Requirements', 'User Goals', 'Technical Scope', 'Project Plan']::text[], null, 10, 'published'),
  ('research', 'Research',
   'Validate assumptions, investigate technical approaches, analyze competitors where relevant, and identify the most practical solution.',
   'Assumptions are tested before they become expensive. We compare technical approaches, check what existing services and APIs already solve, look at comparable products where relevant and identify the simplest approach that meets the goals, including what should not be built yet.',
   'search', '{}'::text[], null, 20, 'published'),
  ('architect', 'Architect',
   'Design the system architecture, database structure, APIs, integrations, security model, and technical foundation.',
   'The technical foundation is designed deliberately: the data model, API contracts, integrations, authentication and authorization, hosting and the security boundaries between components. Decisions made here are costly to reverse, so they are made explicitly and documented.',
   'layers', '{}'::text[], null, 30, 'published'),
  ('design', 'Design',
   'Turn requirements into clear user experiences and interfaces designed around usability, accessibility, responsiveness, and the product''s goals.',
   'User flows and interfaces turn requirements into something people can use without friction. Screens are designed for every device size, accessibility is considered from the start, and a consistent component system lets the product grow without losing coherence.',
   'pen-tool', '{}'::text[], null, 40, 'published'),
  ('build', 'Build',
   'Develop the product using a modular, maintainable architecture with testing and iterative development throughout the process.',
   'The product is developed in small, reviewable increments so working software is visible early and feedback arrives while changes are still cheap. Code is modular, reviewed and tested as it is written, so the codebase stays maintainable as the product evolves.',
   'hammer', '{}'::text[], null, 50, 'published'),
  ('test-and-secure', 'Test & Secure',
   'Validate functionality, performance, responsiveness, security, integrations, and edge cases before release.',
   'Before release, the product is checked against its real requirements: functional and regression testing, performance, behaviour across devices and browsers, integrations with other systems, security controls and the edge cases that only appear with real data.',
   'check', '{}'::text[], null, 60, 'published'),
  ('launch-and-improve', 'Launch & Improve',
   'Deploy the product, monitor its behavior, collect feedback, and continuously improve the system based on real-world usage.',
   'Launch is the beginning of the product''s life, not the end of the project. The system is deployed, monitored for errors and performance, and improved continuously based on feedback and how people actually use it.',
   'rocket', '{}'::text[], null, 70, 'published')
on conflict (slug) do update set
  title = excluded.title,
  short_description = excluded.short_description,
  description = excluded.description,
  icon = excluded.icon,
  deliverables = excluded.deliverables,
  sort_order = excluded.sort_order,
  status = excluded.status;

-- Stages from the previous seed that the new process replaces. Archived, not
-- deleted, so any admin edits can still be recovered.
update public.process_steps set status = 'archived'
where slug in ('define', 'validate', 'launch-evolve') and status <> 'archived';

-- ---------------------------------------------------------------------------
-- Technologies. Listing a technology here is what makes it appear on the
-- site. Logos are uploaded from the admin panel.
-- ---------------------------------------------------------------------------

insert into public.technologies (slug, name, category, description, website, sort_order, status)
values
  ('next-js', 'Next.js', 'frontend'::public.tech_category,
   'React framework for production web applications',
   'https://nextjs.org', 10, 'published'),
  ('react', 'React', 'frontend'::public.tech_category,
   'Component-based library for building user interfaces',
   'https://react.dev', 20, 'published'),
  ('typescript', 'TypeScript', 'frontend'::public.tech_category,
   'Typed JavaScript for maintainable application development',
   'https://www.typescriptlang.org', 30, 'published'),
  ('node-js', 'Node.js', 'backend'::public.tech_category,
   'JavaScript runtime for server-side applications',
   'https://nodejs.org', 40, 'published'),
  ('python', 'Python', 'backend'::public.tech_category,
   'General-purpose language for automation, AI and backend systems',
   'https://www.python.org', 50, 'published'),
  ('fastapi', 'FastAPI', 'backend'::public.tech_category,
   'High-performance Python framework for APIs',
   'https://fastapi.tiangolo.com', 60, 'published'),
  ('postgresql', 'PostgreSQL', 'database'::public.tech_category,
   'Reliable relational database for production applications',
   'https://www.postgresql.org', 70, 'published'),
  ('supabase', 'Supabase', 'database'::public.tech_category,
   'Backend platform providing database, authentication and storage',
   'https://supabase.com', 80, 'published'),
  ('openai', 'OpenAI', 'ai'::public.tech_category,
   'AI models and APIs for intelligent applications',
   'https://platform.openai.com', 90, 'published'),
  ('docker', 'Docker', 'devops'::public.tech_category,
   'Container platform for consistent application environments',
   'https://www.docker.com', 100, 'published'),
  ('cloudflare', 'Cloudflare', 'cloud'::public.tech_category,
   'Edge infrastructure, DNS, security and performance services',
   'https://www.cloudflare.com', 110, 'published'),
  ('vercel', 'Vercel', 'cloud'::public.tech_category,
   'Deployment platform for modern web applications',
   'https://vercel.com', 120, 'published'),
  ('solana', 'Solana', 'web3'::public.tech_category,
   'High-performance blockchain platform',
   'https://solana.com', 130, 'published'),
  ('linux', 'Linux', 'devops'::public.tech_category,
   'Open-source operating system used across development and infrastructure',
   'https://www.kernel.org', 140, 'published')
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  website = excluded.website,
  sort_order = excluded.sort_order,
  status = excluded.status;

-- Technologies from the previous seed that are not part of the current stack.
update public.technologies set status = 'archived'
where slug in ('aws', 'tensorflow', 'pytorch', 'openai-apis') and status <> 'archived';

-- ---------------------------------------------------------------------------
-- FAQs (general page). Fixed ids make the rows rerunnable.
-- ---------------------------------------------------------------------------

insert into public.faq_items (id, question, answer, page, sort_order, status)
values
  ('00000000-0000-4000-8000-0000000f0001',
   'What does Inovexa Labs do?',
   'Inovexa Labs is a software development and technology innovation studio. We build custom web applications, mobile applications, AI-powered systems, automation solutions, secure digital infrastructure, and technology products for businesses, startups, and organizations.',
   'general', 10, 'published'),
  ('00000000-0000-4000-8000-0000000f0002',
   'Is Inovexa Labs a software development company?',
   'Yes. Inovexa Labs provides custom software development services alongside AI engineering, automation, cybersecurity, cloud development, and technology research.',
   'general', 20, 'published'),
  ('00000000-0000-4000-8000-0000000f0003',
   'Does Inovexa Labs work with startups?',
   'Yes. We work with early-stage startups and established businesses to turn software ideas into functional digital products. Depending on the project, we can help with product architecture, development, deployment, and ongoing improvement.',
   'general', 30, 'published'),
  ('00000000-0000-4000-8000-0000000f0004',
   'What technologies does Inovexa Labs use?',
   'Our technology stack includes modern frontend and backend frameworks, cloud platforms, databases, AI technologies, cybersecurity tools, DevOps infrastructure, and Web3 technologies. The exact stack depends on the requirements of each project.',
   'general', 40, 'published'),
  ('00000000-0000-4000-8000-0000000f0005',
   'Can Inovexa Labs build an MVP?',
   'Yes. We can help transform an early product concept into a focused minimum viable product with the core functionality needed to validate the idea and gather real user feedback.',
   'general', 50, 'published'),
  ('00000000-0000-4000-8000-0000000f0006',
   'Does Inovexa Labs provide AI development services?',
   'Yes. AI development is one of our technology areas, including AI-powered applications, intelligent automation, AI agents, data-driven systems, and integrations with modern AI models and APIs.',
   'general', 60, 'published')
on conflict (id) do update set
  question = excluded.question,
  answer = excluded.answer,
  page = excluded.page,
  sort_order = excluded.sort_order,
  status = excluded.status;

-- Questions from the previous seed whose answers made claims this spec does not support.
update public.faq_items set status = 'archived'
where question in (
  'How does a project start?',
  'How long does a typical project take?',
  'How do you price work?',
  'Do you work with existing codebases?',
  'Who owns the code and the infrastructure?'
) and status <> 'archived';

-- ---------------------------------------------------------------------------
-- Navigation. The footer reads these rows. Privacy Policy and Terms are not
-- added: the footer's legal row already links to them.
-- ---------------------------------------------------------------------------

insert into public.navigation_items (id, label, href, location, sort_order, status)
values
  ('00000000-0000-4000-8000-0000000a0001', 'Home', '/', 'header'::public.nav_location, 10, 'published'),
  ('00000000-0000-4000-8000-0000000a0002', 'Services', '/services', 'header'::public.nav_location, 20, 'published'),
  ('00000000-0000-4000-8000-0000000a0003', 'Projects', '/projects', 'header'::public.nav_location, 30, 'published'),
  ('00000000-0000-4000-8000-0000000a0004', 'Innovation', '/innovation', 'header'::public.nav_location, 40, 'published'),
  ('00000000-0000-4000-8000-0000000a0005', 'About', '/about', 'header'::public.nav_location, 50, 'published'),
  ('00000000-0000-4000-8000-0000000a0006', 'Blog', '/blog', 'header'::public.nav_location, 60, 'published'),
  ('00000000-0000-4000-8000-0000000a0007', 'Contact', '/contact', 'header'::public.nav_location, 70, 'published'),
  ('00000000-0000-4000-8000-0000000b0001', 'Services', '/services', 'footer'::public.nav_location, 10, 'published'),
  ('00000000-0000-4000-8000-0000000b0002', 'Projects', '/projects', 'footer'::public.nav_location, 20, 'published'),
  ('00000000-0000-4000-8000-0000000b0003', 'Innovation Lab', '/innovation', 'footer'::public.nav_location, 30, 'published'),
  ('00000000-0000-4000-8000-0000000b0004', 'Blog', '/blog', 'footer'::public.nav_location, 40, 'published'),
  ('00000000-0000-4000-8000-0000000b0005', 'About', '/about', 'footer'::public.nav_location, 50, 'published'),
  ('00000000-0000-4000-8000-0000000b0006', 'Contact', '/contact', 'footer'::public.nav_location, 60, 'published')
on conflict (id) do update set
  label = excluded.label,
  href = excluded.href,
  location = excluded.location,
  sort_order = excluded.sort_order,
  status = excluded.status;

-- Earlier copies of the same links (created by the previous seed with random
-- ids) and the footer Team link, which the new footer drops.
update public.navigation_items n set status = 'archived'
where n.status <> 'archived'
  and n.id not in ('00000000-0000-4000-8000-0000000a0001', '00000000-0000-4000-8000-0000000a0002', '00000000-0000-4000-8000-0000000a0003', '00000000-0000-4000-8000-0000000a0004', '00000000-0000-4000-8000-0000000a0005', '00000000-0000-4000-8000-0000000a0006', '00000000-0000-4000-8000-0000000a0007', '00000000-0000-4000-8000-0000000b0001', '00000000-0000-4000-8000-0000000b0002', '00000000-0000-4000-8000-0000000b0003', '00000000-0000-4000-8000-0000000b0004', '00000000-0000-4000-8000-0000000b0005', '00000000-0000-4000-8000-0000000b0006')
  and (
    exists (
      select 1 from public.navigation_items s
      where s.id in ('00000000-0000-4000-8000-0000000a0001', '00000000-0000-4000-8000-0000000a0002', '00000000-0000-4000-8000-0000000a0003', '00000000-0000-4000-8000-0000000a0004', '00000000-0000-4000-8000-0000000a0005', '00000000-0000-4000-8000-0000000a0006', '00000000-0000-4000-8000-0000000a0007', '00000000-0000-4000-8000-0000000b0001', '00000000-0000-4000-8000-0000000b0002', '00000000-0000-4000-8000-0000000b0003', '00000000-0000-4000-8000-0000000b0004', '00000000-0000-4000-8000-0000000b0005', '00000000-0000-4000-8000-0000000b0006')
        and s.href = n.href and s.location = n.location
    )
    or (n.href = '/team' and n.location = 'footer')
  );

-- ---------------------------------------------------------------------------
-- Blog. Content uses the site's article format (## headings, lists, quotes,
-- code fences, **bold**, *italic*, `code`, [links](/path)); no HTML. Author is
-- left NULL so the company name is shown. A rerun keeps the original
-- published_at date.
-- ---------------------------------------------------------------------------

-- Custom Software Development: A Complete Guide for Businesses (~1204 words)
insert into public.blog_posts (slug, title, excerpt, content, category, tags, reading_time, featured, status, published_at, seo_title, seo_description)
values (
  'custom-software-development-guide',
  'Custom Software Development: A Complete Guide for Businesses',
  'What custom software development involves, when it beats off-the-shelf tools, how the process works from discovery to launch, and how to choose the right development partner.',
  'Off-the-shelf software is built for the average business. Custom software is built for yours. This guide explains what custom software development actually involves, when it is worth the investment, what the process looks like from idea to launch, and how to choose a team to build it with.

## What is custom software development?

Custom software development is the process of designing, building, deploying and maintaining software for a specific organisation, workflow or product, rather than buying a general-purpose tool and adapting your business to fit it.

The result can take many forms:

- An internal tool that replaces spreadsheets and manual handoffs
- A customer-facing web application or SaaS product
- A mobile app that extends an existing service
- An integration layer that connects systems which were never designed to talk to each other
- An AI-powered feature, such as document processing or intelligent search, built into an existing product

What these have in common is that the requirements come from the business, not from a vendor''s feature list.

## Custom software vs off-the-shelf tools

Off-the-shelf software is usually the right starting point. It is cheaper upfront, available immediately and maintained by someone else. The trade-off is that you accept the vendor''s assumptions about how your work should be done.

Custom software starts to make sense when one or more of these is true:

- **Your workflow is a competitive advantage.** If the way you operate is what makes you different, forcing it into a generic tool erodes that difference.
- **You are paying for workarounds.** Teams copying data between three tools, maintaining fragile spreadsheets or paying for many seats of software they barely use are already paying for customisation, just inefficiently.
- **Integration is the real problem.** Many businesses have good individual tools that do not share data. A custom integration layer can be more valuable than replacing any single tool.
- **You are building a product.** If the software is what you sell, you need to own it.
- **Compliance or data ownership matters.** Some industries need control over where data lives, who can access it and how it is audited.

A useful rule: buy for the parts of your business that work like everyone else''s, and build for the parts that do not.

## The custom software development process

Every team describes its process differently, but sound projects move through the same core stages.

### 1. Discovery

Discovery answers the questions that decide everything else: what problem are we solving, for whom, and how will we know it worked? It covers the current workflow, the users, business goals, technical constraints, budget and timeline. The output is a shared understanding of the problem and clear success criteria, before any code is written.

### 2. Research and scoping

Assumptions get tested here. Is there an existing service or API that solves part of the problem? Which technical approach is most practical? What is the smallest version of the product that proves the idea? Good scoping is mostly about deciding what *not* to build yet.

### 3. Architecture

Architecture is where the system''s foundation is designed: the data model, APIs, integrations, authentication, hosting and security boundaries. Decisions made here are expensive to reverse later, so they should be deliberate and written down.

### 4. Design

User flows and interfaces turn requirements into something people can actually use. Good design reduces training time and support load, and it catches usability problems while they are still cheap to fix.

### 5. Build

Development works best in short, reviewable increments. Working software should be visible early and often, so feedback arrives while changes are still cheap. Automated tests, code review and documentation belong in this phase, not after it.

### 6. Testing and security

Before release, the product is checked against its real requirements: functional and regression testing, performance, responsiveness across devices, integrations, security and the edge cases that only appear with real data.

### 7. Launch and improvement

Launch is the start of the product''s life, not the end of the project. Monitoring, error tracking and real usage data show what to improve next.

You can see how we structure these stages on our [About page](/about), and how they apply to specific engagements on our [services page](/services).

## What affects timeline and cost?

The main drivers are scope, complexity, integrations, design depth, compliance requirements and the size of the team. A focused internal tool and a multi-tenant SaaS platform are different projects even if both are described as "an app". We cover this in detail in [How Much Does Custom Software Development Cost?](/blog/custom-software-development-cost)

## Choosing the right technology stack

The best stack is usually the boring one that fits the problem and the team who will maintain it. Questions worth asking:

- Is the technology mature, well-documented and actively maintained?
- Can you hire people who know it, or is the project tied to one vendor?
- Does it fit the type of product? Content-heavy sites, real-time systems, data pipelines and mobile apps have different needs.
- What will hosting and operations cost at your expected scale?

For many modern web products, a TypeScript-based frontend such as Next.js, a relational database such as PostgreSQL and managed cloud infrastructure are a sensible default. Specialised needs, such as heavy data processing or machine learning, may justify Python services alongside it.

## Ownership, documentation and maintenance

Before signing any agreement, make sure the answers to these questions are clear:

- **Who owns the source code?** You should, and it should live in a repository you control.
- **Who owns the infrastructure?** Cloud accounts, domains and third-party services should be registered to your organisation.
- **What documentation will you receive?** At minimum: how to run the project, how it is deployed and how its main parts fit together.
- **What happens after launch?** Software needs security updates, dependency upgrades and bug fixes. Agree on how that work is handled.

## How to choose a custom software development company

Whether you are comparing a software development company in Nepal or a team anywhere else, the same questions separate strong partners from weak ones:

- Do they ask about your business problem before talking about technology?
- Can they show real work, explain the decisions behind it and describe what they would do differently?
- Do they explain trade-offs honestly, including when you should *not* build something custom?
- How do they handle testing, security and code review?
- How often will you see working software?
- Who will actually do the work, and will you speak to them directly?

Be cautious of any team that promises a fixed price for a vague scope, or that cannot explain how they test their work.

## Conclusion

Custom software is an investment in making your business work the way it should, rather than the way a generic tool assumes it does. It pays off when the problem is specific, the workflow matters and the team building it follows a disciplined process from discovery to launch.

If you are weighing up a custom build, [tell us what you are trying to solve](/contact). We will help you decide whether custom software is the right answer, and what the smallest useful first version looks like.',
  'Software Development',
  array['Custom Software', 'Software Development', 'Business Software', 'Development Process']::text[],
  5,
  true,
  'published',
  '2026-09-01 09:00:00+05:45'::timestamptz,
  'Custom Software Development: A Complete Guide for Businesses',
  'Learn when custom software makes sense, how the development process works from discovery to launch, and how to choose a software development partner.'
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  category = excluded.category,
  tags = excluded.tags,
  reading_time = excluded.reading_time,
  featured = excluded.featured,
  status = excluded.status,
  published_at = coalesce(public.blog_posts.published_at, excluded.published_at),
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

-- How Much Does Custom Software Development Cost? (~919 words)
insert into public.blog_posts (slug, title, excerpt, content, category, tags, reading_time, featured, status, published_at, seo_title, seo_description)
values (
  'custom-software-development-cost',
  'How Much Does Custom Software Development Cost?',
  'The factors that drive custom software development cost, common pricing models, the costs people forget, and practical ways to get more from your budget.',
  '"How much will it cost?" is usually the first question about a software project, and the honest answer is "it depends". That answer is only useful if you know what it depends on. This article breaks down the factors that drive custom software development cost, the common pricing models, and practical ways to spend your budget well.

## Why software cost is hard to estimate

Software is not manufactured; it is designed and built once. Two projects described in the same sentence, for example "a booking app", can differ in cost many times over depending on what sits underneath: user roles, payments, integrations, offline support, reporting, security requirements and the level of polish expected.

Early estimates are therefore ranges, not quotes. A range narrows as the scope becomes clearer, which is why a short discovery phase before committing to a full build is often the best money spent on a project.

## The main factors that drive cost

### Scope and number of features

The more screens, workflows and user roles a product has, the more it costs to design, build and test. Scope is the single biggest lever you control.

### Complexity of business logic

A form that saves data is simple. A pricing engine with discounts, taxes, currencies and approval rules is not. Complexity often hides in the rules, not the screens.

### Integrations

Connecting to payment gateways, accounting systems, ERPs, government services or legacy databases adds work for authentication, data mapping, error handling and testing. Poorly documented third-party APIs add uncertainty.

### Platforms

A responsive web application is one codebase. Native iOS and Android apps, an admin dashboard and a public website are additional surfaces to design, build and maintain. Cross-platform frameworks can reduce, but not remove, that cost.

### Design depth

Using a well-built component library is faster than designing a fully custom visual identity and interaction system. Both are valid; they cost differently.

### Security and compliance

Handling payments, health data, financial records or personal data at scale requires stronger access control, audit logging, encryption and review. This is non-negotiable work, and it belongs in the estimate from the start.

### Data migration

Moving years of data from spreadsheets or an old system is frequently underestimated. Cleaning and validating data can be a project of its own.

### Team composition and location

Rates vary by region, seniority and engagement model. A smaller senior team often costs less overall than a larger junior team because it makes fewer expensive mistakes. Location affects hourly rates, but communication quality and engineering discipline affect total cost more.

## Common pricing models

### Fixed price

A fixed scope for a fixed fee. It works well for small, well-defined pieces of work such as a discovery phase or a clearly specified feature. For large projects it tends to produce either padded estimates or change-request disputes, because scope inevitably shifts.

### Time and materials

You pay for the time spent. It is flexible and transparent, and it suits products where requirements will evolve. It needs trust, regular demos and clear reporting so you always know where the budget is going.

### Dedicated team or retainer

A team works on your product for an agreed monthly capacity. It suits long-running products with an ongoing roadmap rather than one-off projects.

Many projects combine models, for example a fixed-price discovery phase followed by an iterative build.

## Costs people forget

- **Hosting and infrastructure:** servers, databases, storage, CDN and backups
- **Third-party services:** email delivery, SMS, maps, payments, AI model APIs and monitoring tools, often billed per use
- **Maintenance:** security patches, dependency upgrades, operating system and browser changes
- **Support and small improvements** once real users arrive
- **App store accounts and reviews** for mobile apps

A product that costs nothing to run after launch does not exist. Budget for its life, not just its build.

## How to reduce cost without cutting quality

1. **Start with a minimum viable product.** Build the smallest version that solves the core problem for real users, then let usage decide what comes next.
2. **Write down what is out of scope.** It is as important as what is in.
3. **Use proven building blocks.** Managed authentication, databases, payments and hosting are cheaper and safer than building them from scratch.
4. **Make decisions quickly.** Waiting on feedback is a hidden cost on any time-based engagement.
5. **Do not skip testing or security.** Bugs and breaches found after launch cost far more than the time it takes to prevent them.

## Questions to ask before you accept an estimate

- What assumptions is this estimate based on?
- What is explicitly excluded?
- How are changes to scope handled and priced?
- What does the estimate include for testing, deployment and documentation?
- What will it cost per month to run once it is live?

A good team will answer these clearly. A vague answer is a warning sign, regardless of how attractive the number is.

## Conclusion

The cost of custom software is driven by scope, complexity, integrations, platforms, security requirements and team composition. You get the most from your budget by defining a focused first version, choosing a pricing model that fits how certain your requirements are, and planning for the cost of running the product after launch.

If you are new to custom builds, start with our [complete guide to custom software development](/blog/custom-software-development-guide). If you have a project in mind, [share what you are planning](/contact) and we can help you scope a realistic first version.',
  'Software Development',
  array['Software Cost', 'Custom Software', 'Pricing Models', 'MVP']::text[],
  4,
  false,
  'published',
  '2026-09-04 09:00:00+05:45'::timestamptz,
  'How Much Does Custom Software Development Cost?',
  'The real factors behind custom software development cost: scope, complexity, integrations, pricing models and ongoing costs, plus ways to spend your budget well.'
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  category = excluded.category,
  tags = excluded.tags,
  reading_time = excluded.reading_time,
  featured = excluded.featured,
  status = excluded.status,
  published_at = coalesce(public.blog_posts.published_at, excluded.published_at),
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

-- Web Application vs Website: What Does Your Business Actually Need? (~832 words)
insert into public.blog_posts (slug, title, excerpt, content, category, tags, reading_time, featured, status, published_at, seo_title, seo_description)
values (
  'web-application-vs-website',
  'Web Application vs Website: What Does Your Business Actually Need?',
  'Websites inform; web applications do work for their users. Learn the key differences, see real examples and use a simple checklist to decide what your business needs.',
  '"We need a website" and "we need a web app" are often used interchangeably, but they describe different products with different costs, timelines and maintenance needs. Choosing the wrong one means either overbuilding something simple or underbuilding something your business depends on. Here is how to tell which one you actually need.

## What is a website?

A website primarily **presents information**. Visitors read, browse and contact you. Typical examples include:

- A company or portfolio site
- A restaurant site with a menu, location and opening hours
- A blog or documentation site
- A landing page for a campaign or product launch

Most of the content is the same for every visitor. Interaction is usually limited to navigation, contact forms and perhaps a newsletter sign-up. The main goals are clarity, speed, search visibility and trust.

## What is a web application?

A web application lets users **do things**. It runs in the browser, but it behaves like software: users sign in, create and change data, and see information specific to them. Examples include:

- Online banking and booking systems
- Project management tools and CRMs
- Point-of-sale and inventory systems
- Admin dashboards and internal tools
- SaaS products of every kind

A web application needs a backend: a database, business logic, authentication, permissions and usually integrations with other systems.

## The key differences

### Interaction

A website is mostly read. A web application is mostly used. If users need to log in and perform tasks, you are building an application.

### Data

A website''s content is typically managed by your team through a CMS. A web application stores data created by its users, often sensitive, and must keep it consistent, private and backed up.

### Authentication and permissions

Websites rarely need accounts. Web applications almost always do, along with roles that decide who can see and change what.

### Complexity and cost

A well-built website is a contained project. A web application involves architecture, security, testing and ongoing maintenance on a different scale.

### Maintenance

Websites need content updates and periodic technical upkeep. Web applications need continuous care: security patches, bug fixes, performance work and new features as users'' needs change.

## The space in between

Many modern products sit between the two. An e-commerce storefront presents products like a website but also has search, a cart and a checkout flow. A marketing site might include a customer portal. A company site might have a CMS-backed admin panel.

[Pahiran](/projects/pahiran), for example, is an e-commerce platform that combines a browsable storefront with category browsing, search, a cart and a purchasing workflow. [Restra](/projects/restra), a restaurant management system, is firmly an application: it handles POS and billing, orders, inventory, staff and analytics for teams who use it all day.

## Real examples

- **A clinic** that wants to show its services and doctors needs a website. If patients should book, reschedule and see their history online, it needs a web application, or at least a booking module.
- **A restaurant** that wants to show its menu needs a website. If it wants QR ordering, kitchen order tracking and inventory, it needs an application.
- **A consultancy** needs a website to win clients. If it wants clients to upload documents and track progress, that is an application feature.

## How to decide

Ask these questions:

1. Do users need to sign in?
2. Will users create, edit or submit data beyond a contact form?
3. Should different users see different information?
4. Does it need to connect to other business systems?
5. Will your team use it to run daily operations?

If you answered "no" to all of them, you need a website. If you answered "yes" to two or more, you are describing a web application, and it should be planned as one from the start.

## Can a website grow into a web application?

Yes, if it is built on a foundation that allows it. Modern frameworks such as Next.js can serve fast, search-friendly pages and full application features from the same codebase. Starting with a solid website and adding application features later is a perfectly good strategy, as long as the first version is not built on a tool that cannot grow.

## SEO and performance considerations

Websites live and die by search visibility, so server-rendered pages, fast loading, structured data and clear content structure matter. Many web applications sit behind a login, so SEO matters less there than responsiveness and reliability. Hybrid products need both: public pages built for search, and an application built for speed and correctness.

## Conclusion

A website informs; a web application does work for its users. The right choice depends on whether people need to sign in, manage data and complete tasks, not on how "advanced" the project sounds.

Explore our [web development services](/services/web-development) to see how we approach both, or read our [guide to custom software development](/blog/custom-software-development-guide) if you are planning a larger application. When you are ready, [tell us about your project](/contact).',
  'Software Development',
  array['Web Applications', 'Web Development', 'Websites', 'Business Software']::text[],
  4,
  false,
  'published',
  '2026-09-08 09:00:00+05:45'::timestamptz,
  'Web Application vs Website: What Does Your Business Need?',
  'The differences between a website and a web application, with real examples and a simple checklist to decide which one your business actually needs.'
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  category = excluded.category,
  tags = excluded.tags,
  reading_time = excluded.reading_time,
  featured = excluded.featured,
  status = excluded.status,
  published_at = coalesce(public.blog_posts.published_at, excluded.published_at),
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

-- What Are AI Agents and How Do They Work? (~905 words)
insert into public.blog_posts (slug, title, excerpt, content, category, tags, reading_time, featured, status, published_at, seo_title, seo_description)
values (
  'what-are-ai-agents',
  'What Are AI Agents and How Do They Work?',
  'AI agents combine a language model with tools and a feedback loop to complete multi-step tasks. Here is how they work, where they help and what makes them hard to build well.',
  'An AI agent is software that uses a language model to decide what to do next, takes actions through tools, observes the result and repeats until a goal is met. That loop, rather than any single model, is what separates an agent from a chatbot. This article explains how AI agents work, where they are useful today, and what it takes to build one that can be trusted.

## Chatbot, workflow or agent?

These terms are often blurred, so it helps to separate them:

- **A chatbot** answers messages. It produces text and stops.
- **An AI workflow** uses a model inside a fixed sequence of steps defined by a developer, for example "extract fields from this invoice, then validate them, then save them".
- **An AI agent** decides the sequence itself. Given a goal and a set of tools, it plans, acts, checks the outcome and adapts.

Most production systems sit somewhere on this spectrum. Many problems are better solved with a predictable workflow than a fully autonomous agent, and recognising that early saves a lot of effort.

## How an AI agent works

Most agents are built from the same components.

### The model

A large language model (LLM) provides reasoning: interpreting the goal, choosing which tool to call and deciding whether the task is complete.

### Tools

Tools are functions the agent can call, such as searching a database, reading a file, calling an API, running code or sending a message. Modern models support structured tool calling: the model returns the name of a tool and arguments in a defined format, the application runs the tool, and the result is sent back to the model.

Standards such as the Model Context Protocol (MCP) make it easier to connect agents to tools and data sources in a consistent way.

### The loop

The core of an agent is a loop:

```
goal -> think -> choose tool -> act -> observe result -> repeat or finish
```

This is often called the ReAct pattern, short for *reasoning and acting*. Each observation feeds back into the next decision, which lets the agent recover from errors and adjust its plan.

### Memory and context

Agents need context: the conversation so far, results of previous steps and relevant knowledge. Short-term memory lives in the model''s context window. Long-term memory is usually stored externally, for example in a database or a vector index, and retrieved when needed.

### Guardrails

Guardrails constrain what the agent can do: which tools it may call, with which permissions, how many steps it can take, how much it can spend, and which actions require human approval.

## Where AI agents are useful

Agents work best on tasks that are multi-step, require judgement between steps and can be verified. Examples include:

- **Research and analysis:** gathering information from several sources and producing a structured summary
- **Software engineering:** reading a codebase, making a change, running tests and iterating on failures
- **Customer operations:** looking up an order, checking a policy and drafting a response for a human to approve
- **Security analysis:** triaging alerts, enriching them with context and suggesting next steps for an analyst
- **Internal operations:** reconciling records across systems and flagging mismatches

## The hard parts

### Reliability

A model that is right most of the time can still fail in a long chain of steps, because small error rates compound. Good agents are designed to verify their own work, for example by running tests or validating output against a schema.

### Evaluation

You cannot improve what you do not measure. Production agents need test sets of realistic tasks, automated checks and review of real runs to see where they fail.

### Security

Agents that read untrusted content are exposed to **prompt injection**, where instructions hidden in a web page, email or document try to hijack the agent. Defences include least-privilege tool permissions, separating trusted instructions from untrusted data, and requiring confirmation for sensitive actions such as payments or deletions.

### Cost and latency

Every loop iteration is a model call. Long tasks can become slow and expensive, so step limits, caching and choosing the right model for each step matter.

### Human oversight

For consequential actions, the safest pattern is often "agent proposes, human approves". Autonomy can be increased gradually as the system proves itself.

## How to start building an AI agent

1. **Pick a narrow, valuable task** with a clear definition of success.
2. **Check whether a fixed workflow is enough.** If the steps are always the same, you may not need an agent.
3. **Define a small set of well-described tools** with strict input validation.
4. **Build evaluation first:** a set of real examples with known good outcomes.
5. **Add guardrails and logging** before giving the agent access to anything important.
6. **Ship with a human in the loop**, then expand autonomy based on evidence.

## Conclusion

AI agents combine a language model''s reasoning with tools and a feedback loop, which lets them complete multi-step tasks rather than just answer questions. They are powerful when the task is well-scoped, the tools are safe and the results can be verified, and risky when any of those are missing.

Agent architectures are an active research area in our [Innovation Lab](/innovation/autonomous-ai-agent-systems). If you are exploring how agents could fit into your product, see our [AI and machine learning services](/services/ai-machine-learning), read about [AI automation for businesses](/blog/ai-automation-for-businesses), or [get in touch](/contact).',
  'AI',
  array['AI Agents', 'LLM', 'AI Automation', 'AI Development']::text[],
  4,
  true,
  'published',
  '2026-09-11 09:00:00+05:45'::timestamptz,
  'What Are AI Agents and How Do They Work?',
  'How AI agents work: models, tools, the reasoning loop, memory and guardrails, plus real use cases and the challenges of building reliable agents.'
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  category = excluded.category,
  tags = excluded.tags,
  reading_time = excluded.reading_time,
  featured = excluded.featured,
  status = excluded.status,
  published_at = coalesce(public.blog_posts.published_at, excluded.published_at),
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

-- How Businesses Can Use AI Automation (~767 words)
insert into public.blog_posts (slug, title, excerpt, content, category, tags, reading_time, featured, status, published_at, seo_title, seo_description)
values (
  'ai-automation-for-businesses',
  'How Businesses Can Use AI Automation',
  'Where AI automation genuinely helps, where simple rules are better, and a step-by-step approach to introducing it safely and measuring the results.',
  'Automation has always been about taking repetitive work off people''s desks. What AI changes is the kind of work that can be automated. Traditional automation handles structured, predictable tasks. AI automation can handle tasks that involve reading, writing, classifying and summarising messy, unstructured information. This guide covers where AI automation helps, where it does not, and how to introduce it safely.

## Traditional automation vs AI automation

**Rule-based automation** follows explicit instructions: when a form is submitted, create a record, send an email and notify a channel. It is fast, cheap and predictable, but it breaks when the input does not match the rules.

**AI automation** uses machine learning models, increasingly large language models, to handle inputs that do not fit neat rules: an email written in free text, a scanned invoice in an unfamiliar layout, or a customer question phrased a hundred different ways.

The most effective systems combine both: deterministic rules for the predictable parts, and AI only where judgement or language understanding is needed.

## Practical use cases

### Document processing

Extracting fields from invoices, receipts, contracts, forms and ID documents, then validating them and entering them into accounting or ERP systems. Combining a model''s extraction with rule-based validation, such as checking that totals add up, makes the result far more reliable.

### Email and ticket triage

Classifying incoming messages by topic, urgency and language, routing them to the right team and drafting a first response for a person to review.

### Customer support

Answering common questions from your own documentation, looking up order status through internal tools and handing over to a human with full context when the question needs one.

### Internal knowledge search

Letting staff ask questions in plain language and get answers grounded in company documents, policies and wikis. This pattern is called retrieval-augmented generation (RAG): relevant documents are retrieved first, and the model answers using only that material.

### Sales and lead qualification

Summarising enquiries, enriching them with public company information and prioritising follow-up.

### Reporting and summarisation

Turning meeting notes, call transcripts, logs or weekly data into concise summaries and action items.

## Where AI automation is the wrong tool

- **When rules are enough.** If the logic can be written as clear conditions, use rules. They are cheaper, faster and easier to test.
- **When errors are unacceptable and cannot be checked.** Models make mistakes. If a mistake would be costly and there is no way to validate the output, keep a human in the loop.
- **When the data is not available.** AI cannot automate a process whose information lives only in people''s heads.
- **When the process itself is broken.** Automating a bad process just produces bad results faster.

## How to introduce AI automation

### 1. Map the process

Write down every step, who does it, how long it takes and where errors happen. The best candidates are high-volume, repetitive and currently slow.

### 2. Define success in numbers

Time saved per task, error rate, response time or throughput. Measure the current baseline before changing anything.

### 3. Start with "AI assists, human decides"

Let the system draft, extract or classify while a person reviews. This delivers value immediately and builds the evaluation data you need to trust it with more.

### 4. Build evaluation in

Keep a set of real examples with correct answers and test every change against them. Track accuracy over time in production.

### 5. Handle data responsibly

Know which data is sent to which model provider, under what terms, and whether personal or confidential information should be masked or kept on infrastructure you control.

### 6. Expand gradually

Once accuracy is proven, let low-risk cases flow automatically and route uncertain ones to people.

## Common risks and how to manage them

- **Hallucination:** ground answers in your own data, require citations and validate structured output.
- **Prompt injection:** treat content from emails, documents and websites as untrusted, and limit what automated actions can do.
- **Cost creep:** monitor usage, cache repeated work and use smaller models where they perform well enough.
- **Silent failure:** log inputs, outputs and decisions so problems can be found and fixed.

## Conclusion

AI automation is most valuable when it targets specific, measurable bottlenecks, works alongside deterministic rules and keeps people in control of consequential decisions. Start small, measure honestly and expand where the results justify it.

To go deeper, read [What Are AI Agents and How Do They Work?](/blog/what-are-ai-agents) and [AI Application Development: From Idea to Production](/blog/ai-application-development). For help identifying where automation fits in your business, explore our [automation services](/services/automation) or [contact us](/contact).',
  'AI',
  array['AI Automation', 'Business Automation', 'RAG', 'Document Processing']::text[],
  3,
  false,
  'published',
  '2026-09-15 09:00:00+05:45'::timestamptz,
  'How Businesses Can Use AI Automation',
  'Practical AI automation use cases, when rule-based automation is the better choice, and a safe, measurable way to introduce AI into business processes.'
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  category = excluded.category,
  tags = excluded.tags,
  reading_time = excluded.reading_time,
  featured = excluded.featured,
  status = excluded.status,
  published_at = coalesce(public.blog_posts.published_at, excluded.published_at),
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

-- AI Application Development: From Idea to Production (~847 words)
insert into public.blog_posts (slug, title, excerpt, content, category, tags, reading_time, featured, status, published_at, seo_title, seo_description)
values (
  'ai-application-development',
  'AI Application Development: From Idea to Production',
  'The stages of building an AI application that works in production: framing the problem, choosing the approach, evaluation, architecture, security and monitoring.',
  'Building an impressive AI demo takes an afternoon. Building an AI application that works reliably for real users, at a sustainable cost, takes engineering discipline. This article walks through the stages of AI application development, from framing the problem to running the system in production.

## Start with the problem, not the model

The most common mistake in AI projects is starting with "we should use AI" instead of "this task is slow, expensive or error-prone". A good AI use case has:

- A clear task, such as classifying, extracting, summarising, answering, generating or recommending
- A measurable outcome, such as time saved, accuracy or conversion
- Access to the data the task depends on
- A tolerance for errors that matches what the model can achieve, or a way to catch errors

If you cannot describe what a correct output looks like, you cannot build, test or improve the system.

## Choose the right approach

Not every AI feature needs the same technique. In rough order of effort:

### Prompting a hosted model

Many tasks can be solved by giving a capable model clear instructions and examples. This is the fastest way to validate an idea, and often good enough for production.

### Retrieval-augmented generation (RAG)

When answers must be based on your own data, such as policies, product documentation or records, retrieve the relevant content first and give it to the model as context. RAG keeps answers current without retraining and makes it possible to cite sources.

### Tool use and agents

When the application must take actions, such as querying systems, creating records or running calculations, give the model well-defined tools. For multi-step tasks, an agent loop may be appropriate. See [What Are AI Agents and How Do They Work?](/blog/what-are-ai-agents)

### Fine-tuning

Fine-tuning adapts a model to a specific format, style or narrow task. It is useful when prompting is not consistent enough, but it requires good training data and adds operational complexity.

### Classical machine learning

For structured, tabular problems such as forecasting, fraud scoring or churn prediction, traditional models are often cheaper, faster and easier to explain than language models.

## Build an evaluation set early

Before optimising anything, collect a set of realistic inputs with expected outputs, including difficult and edge cases. Use it to:

- Compare prompts, models and retrieval strategies objectively
- Catch regressions whenever something changes
- Decide when the system is good enough to ship

Evaluation can combine exact checks (did the extracted date match?), rule-based checks (is the output valid JSON?) and human or model-assisted grading for open-ended answers.

## Prototype quickly, then harden

A prototype should answer one question: does this approach work well enough on real data? Once it does, the work shifts to engineering:

- **Structured output:** validate model responses against a schema rather than parsing free text
- **Error handling:** timeouts, retries and fallbacks when a provider is slow or unavailable
- **Caching:** avoid paying twice for identical requests
- **Model routing:** use smaller, cheaper models for simple steps and larger ones only where needed

## Architecture of a production AI application

A typical AI application includes:

- A **frontend** where users interact, often with streaming responses for perceived speed
- An **application backend** that owns business logic, permissions and data access
- A **model layer** that wraps provider APIs, manages prompts and enforces limits
- A **retrieval layer**, if needed, with document processing, embeddings and a vector or hybrid search index
- **Observability:** logs of inputs, outputs, latency, cost and user feedback

The model should never be the only thing standing between a user and sensitive data. Authorisation belongs in the backend, not in a prompt.

## Security and privacy

- **Prompt injection:** treat user input and retrieved documents as untrusted, and never let them override system instructions or grant extra permissions.
- **Data exposure:** retrieval must respect the user''s access rights, so people can only get answers from documents they are allowed to see.
- **Sensitive data:** understand what is sent to third-party model providers, and mask or minimise personal information.
- **Output handling:** escape or validate generated content before rendering it or passing it to other systems.

For broader guidance, see [Web Application Security: Essential Security Practices](/blog/web-application-security-practices).

## Deploy, monitor and improve

Once live, an AI application needs ongoing attention:

- Monitor quality with sampled reviews and user feedback
- Track cost per request and per user
- Watch latency, especially at peak times
- Re-run your evaluation set whenever you change prompts, models or data sources
- Plan for model updates, since provider models change and are eventually retired

## Conclusion

Successful AI application development is less about the model and more about everything around it: a well-defined problem, the simplest effective approach, rigorous evaluation, sound architecture and careful security. Teams that treat AI as engineering, not magic, are the ones whose products reach production and stay there.

If you have an AI product idea, explore our [AI and machine learning services](/services/ai-machine-learning), see what we are researching in the [Innovation Lab](/innovation), or [talk to us about your idea](/contact).',
  'AI',
  array['AI Development', 'LLM', 'RAG', 'AI Product Development']::text[],
  4,
  false,
  'published',
  '2026-09-18 09:00:00+05:45'::timestamptz,
  'AI Application Development: From Idea to Production',
  'How to take an AI application from idea to production: problem framing, prompting vs RAG vs fine-tuning, evaluation, architecture, security and monitoring.'
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  category = excluded.category,
  tags = excluded.tags,
  reading_time = excluded.reading_time,
  featured = excluded.featured,
  status = excluded.status,
  published_at = coalesce(public.blog_posts.published_at, excluded.published_at),
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

-- API Security: Common Vulnerabilities and How to Protect Your APIs (~874 words)
insert into public.blog_posts (slug, title, excerpt, content, category, tags, reading_time, featured, status, published_at, seo_title, seo_description)
values (
  'api-security-vulnerabilities',
  'API Security: Common Vulnerabilities and How to Protect Your APIs',
  'The most common API vulnerabilities, from broken object level authorization to unrestricted resource consumption, and the practical controls that prevent them.',
  'APIs are the backbone of modern software. Mobile apps, single-page web apps, partner integrations and internal microservices all talk through them. That also makes APIs one of the largest attack surfaces most organisations have. This article covers the most common API vulnerabilities, how attackers exploit them and the practical controls that prevent them.

## Why API security is different

Traditional web security focused on pages rendered by the server. APIs expose data and actions directly, often with less visible structure:

- Every endpoint is a potential entry point, including old versions nobody remembers
- Clients, including attackers, can call any endpoint with any parameters, in any order
- Business logic that was once hidden in the server''s page flow is now exposed as individual operations

The OWASP API Security Top 10 is a widely used reference for the risks that matter most. The vulnerabilities below map closely to it.

## Common API vulnerabilities

### Broken object level authorization (BOLA)

The most common and damaging API flaw. The API checks that a user is logged in, but not that they are allowed to access the specific object they requested.

```
GET /api/invoices/10234   -> your invoice
GET /api/invoices/10235   -> someone else''s invoice
```

**Prevention:** check ownership or permission on every request that references an object ID, on the server, for every endpoint. Unpredictable IDs such as UUIDs help, but they are not a substitute for authorisation checks.

### Broken authentication

Weak token handling, missing expiry, credentials accepted without rate limits, or tokens that are not properly validated.

**Prevention:** use proven authentication standards and libraries, validate token signatures and expiry, rate-limit login and password-reset endpoints, and support multi-factor authentication for sensitive accounts.

### Broken object property level authorization

The API returns more fields than the client needs, such as internal flags or other users'' data, or accepts fields it should not, letting users set values like `role` or `is_verified` (often called *mass assignment*).

**Prevention:** define explicit response schemas, and allow-list the fields each operation may read and write.

### Broken function level authorization

Regular users can call administrative functions because the endpoint exists and only the user interface hides it.

**Prevention:** enforce role checks on the server for every privileged operation, and deny by default.

### Unrestricted resource consumption

No limits on request rates, page sizes, upload sizes or expensive operations, which leads to denial of service or runaway infrastructure and third-party costs.

**Prevention:** rate limiting, pagination with maximum page sizes, request size limits, timeouts and quotas on costly operations such as SMS, email or AI model calls.

### Unrestricted access to sensitive business flows

Attackers automate legitimate flows at scale: buying limited stock, creating accounts or abusing referral rewards.

**Prevention:** identify flows that would hurt the business if automated, and add friction such as velocity limits, device fingerprinting or verification steps.

### Server-side request forgery (SSRF)

The API fetches a URL supplied by the user, and an attacker points it at internal services or cloud metadata endpoints.

**Prevention:** validate and allow-list destinations, block internal address ranges and isolate services that must fetch external content.

### Security misconfiguration

Verbose error messages, permissive CORS, missing TLS, default credentials or debug endpoints left enabled.

**Prevention:** secure defaults, configuration reviews, automated checks in your deployment pipeline and generic error messages for clients.

### Improper inventory management

Old API versions, forgotten test environments and undocumented endpoints keep running without the protections applied to current ones.

**Prevention:** maintain an up-to-date inventory and specification of every API and version, and retire old ones deliberately.

### Unsafe consumption of third-party APIs

Developers trust data from partner APIs more than user input, so a compromised or malicious upstream service can inject harmful data.

**Prevention:** validate and sanitise all external data, use TLS, and set timeouts and limits on third-party calls.

## Building secure APIs: a practical checklist

1. Authenticate every request, and authorise every object and function, server-side
2. Validate all input against a strict schema: types, lengths, formats and allowed values
3. Return only the fields the client needs
4. Rate-limit and paginate everything
5. Use TLS everywhere and secure headers where relevant
6. Log authentication events, authorisation failures and unusual patterns
7. Keep dependencies patched
8. Maintain an API inventory and specification, for example OpenAPI
9. Never put secrets in client applications or public repositories

## Testing API security

Security testing should combine several approaches:

- **Automated scanning** in CI to catch common misconfigurations and known vulnerable dependencies
- **Specification-driven testing** that exercises every documented endpoint, including with invalid and unexpected input
- **Authorisation testing** with multiple user accounts and roles, trying to access each other''s data
- **Manual testing** with tools such as Burp Suite to explore business logic flaws that scanners cannot understand

Automating parts of this process, from API discovery to test generation and reporting, is the focus of our [automated API security research](/innovation/automated-api-security-research).

## Conclusion

Most serious API breaches are not exotic. They come from missing authorisation checks, overly generous responses, absent rate limits and forgotten endpoints. Building these controls into the design, and testing for them continuously, prevents the majority of real-world API attacks.

For related reading, see [Web Application Security: Essential Security Practices](/blog/web-application-security-practices). To review the security of your APIs, explore our [cybersecurity services](/services/cybersecurity) or [contact us](/contact).',
  'Cybersecurity',
  array['API Security', 'OWASP', 'Security Testing', 'Web Security']::text[],
  4,
  true,
  'published',
  '2026-09-22 09:00:00+05:45'::timestamptz,
  'API Security: Common Vulnerabilities and How to Protect APIs',
  'Learn the most common API security vulnerabilities, including BOLA, broken authentication and SSRF, and the practical controls that protect your APIs.'
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  category = excluded.category,
  tags = excluded.tags,
  reading_time = excluded.reading_time,
  featured = excluded.featured,
  status = excluded.status,
  published_at = coalesce(public.blog_posts.published_at, excluded.published_at),
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

-- What Is a SOC and How Does Security Monitoring Work? (~864 words)
insert into public.blog_posts (slug, title, excerpt, content, category, tags, reading_time, featured, status, published_at, seo_title, seo_description)
values (
  'what-is-a-soc',
  'What Is a SOC and How Does Security Monitoring Work?',
  'How a security operations center works: the roles, the tools such as SIEM, EDR and SOAR, the detection and response process, and how to get started with monitoring.',
  'A security operations center (SOC) is the team, processes and technology an organisation uses to monitor its systems, detect threats and respond to security incidents. Whether it is a dedicated room full of analysts or a small team supported by an external provider, the goal is the same: notice attacks early and contain them before they cause serious damage.

## What does a SOC do?

A SOC''s work falls into a few continuous activities:

- **Monitoring:** collecting and watching security-relevant data from across the organisation
- **Detection:** identifying activity that indicates an attack or policy violation
- **Triage and investigation:** deciding which alerts are real, how serious they are and what happened
- **Response:** containing threats, removing attackers and restoring systems
- **Improvement:** learning from incidents and tuning detection to catch similar activity sooner

## People: SOC roles

Many SOCs organise analysts in tiers:

- **Tier 1 analysts** monitor alerts, perform initial triage and escalate genuine incidents
- **Tier 2 analysts** investigate escalated incidents in depth and coordinate response
- **Tier 3 analysts and threat hunters** proactively search for threats that evaded automated detection and handle the most complex incidents
- **Detection engineers** write and tune the rules and analytics that generate alerts
- **SOC managers** run the operation, define processes and report on risk

In smaller organisations, one person may cover several of these roles.

## Technology: the SOC toolset

### SIEM

A security information and event management (SIEM) platform collects logs and events from servers, applications, cloud services, network devices and identity systems. It normalises the data, correlates events across sources and raises alerts when activity matches detection rules. It is also where analysts search historical data during investigations.

### EDR and XDR

Endpoint detection and response (EDR) tools monitor laptops and servers for malicious behaviour and can isolate a compromised machine. Extended detection and response (XDR) combines endpoint data with other sources such as email, identity and cloud.

### SOAR

Security orchestration, automation and response (SOAR) tools automate repetitive steps, such as enriching an alert with threat intelligence, disabling a compromised account or opening a ticket, so analysts can focus on decisions.

### Threat intelligence

Information about known malicious domains, IP addresses, file hashes and attacker techniques helps the SOC recognise threats faster.

## Process: how security monitoring works

### Log collection

Detection is only as good as the data behind it. Valuable sources include identity providers and authentication logs, endpoint telemetry, cloud audit logs, firewall and DNS logs, email security events and application logs.

### Detection rules

Detections range from simple signatures (a known malicious file hash) to behavioural rules (a user logging in from two countries within minutes) and anomaly detection. Many teams map their detections to MITRE ATT&CK, a public framework of attacker tactics and techniques, to find gaps in coverage.

### Alert triage

Each alert is assessed: is it a true positive, a false positive or benign but unusual activity? Too many low-quality alerts cause **alert fatigue**, where real threats get lost in the noise. Continuous tuning is essential.

### Incident response

Confirmed incidents follow a defined lifecycle. The classic model from NIST''s incident handling guidance (SP 800-61) is:

1. **Preparation:** playbooks, tools, contacts and training in place before anything happens
2. **Detection and analysis:** confirming the incident and understanding its scope
3. **Containment, eradication and recovery:** stopping the spread, removing the attacker and restoring normal operation
4. **Post-incident activity:** a review of what happened and what should change

## Measuring a SOC

Common metrics include:

- **Mean time to detect (MTTD):** how long attackers are active before being noticed
- **Mean time to respond (MTTR):** how long it takes to contain an incident once detected
- **False positive rate:** the share of alerts that turn out to be harmless
- **Detection coverage:** which attacker techniques the SOC can actually see

## In-house SOC, MSSP or MDR?

- **An in-house SOC** gives the most control and context, but requires significant investment in people and tooling, especially for 24/7 coverage.
- **A managed security service provider (MSSP)** monitors your environment and escalates alerts to your team.
- **Managed detection and response (MDR)** providers go further, investigating and actively responding to threats on your behalf.

Many organisations use a hybrid: an internal team that owns context and decisions, supported by an external provider for round-the-clock monitoring.

## Getting started with security monitoring

You do not need a full SOC on day one. A sensible progression is:

1. Centralise logs from identity, cloud and critical systems
2. Enable alerts for high-value signals, such as impossible travel, privilege changes and disabled security tools
3. Write simple response playbooks for the most likely incidents
4. Assign clear ownership for reviewing and acting on alerts
5. Expand coverage and automation as the programme matures

## Conclusion

A SOC combines people, process and technology to turn raw security data into timely action. Its effectiveness depends less on the number of tools and more on good data, well-tuned detections, clear processes and analysts with the context to make fast decisions.

Monitoring is only one layer of defence. Read about [web application security practices](/blog/web-application-security-practices) and [API security](/blog/api-security-vulnerabilities), or explore our [cybersecurity services](/services/cybersecurity) and [get in touch](/contact).',
  'Cybersecurity',
  array['SOC', 'SIEM', 'Security Monitoring', 'Incident Response']::text[],
  4,
  false,
  'published',
  '2026-09-25 09:00:00+05:45'::timestamptz,
  'What Is a SOC and How Does Security Monitoring Work?',
  'What a security operations center does, the roles and tools involved (SIEM, EDR, SOAR), how detection and incident response work, and how to get started.'
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  category = excluded.category,
  tags = excluded.tags,
  reading_time = excluded.reading_time,
  featured = excluded.featured,
  status = excluded.status,
  published_at = coalesce(public.blog_posts.published_at, excluded.published_at),
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

-- Web Application Security: Essential Security Practices (~824 words)
insert into public.blog_posts (slug, title, excerpt, content, category, tags, reading_time, featured, status, published_at, seo_title, seo_description)
values (
  'web-application-security-practices',
  'Web Application Security: Essential Security Practices',
  'The essential practices for securing a web application: secure design, access control, authentication, input handling, security headers, dependencies and monitoring.',
  'Web applications handle logins, payments, personal data and business-critical workflows, and they are reachable by anyone on the internet. Securing them is not a single task at the end of a project but a set of practices built into design, development and operations. This article covers the essential practices every web application should follow.

## Start with secure design

Many serious vulnerabilities are design flaws, not coding mistakes. Before building, ask:

- What data does the application hold, and how sensitive is it?
- Who are the users, and what should each role be able to do?
- What would an attacker want, and how might they try to get it?

This lightweight threat modelling shapes decisions about authentication, data storage and access control early, when they are cheapest to get right.

## Access control

Broken access control is consistently ranked among the most critical web application risks in the OWASP Top 10.

- **Enforce authorisation on the server for every request.** Hiding a button in the interface is not access control.
- **Deny by default.** Users get only the permissions they explicitly need.
- **Check object ownership**, not just whether the user is logged in.
- **Use database-level protections where available.** Row-level security in PostgreSQL, for example, can enforce access rules even if application code makes a mistake.

## Authentication and sessions

- Use well-tested authentication libraries or providers rather than building your own
- Hash passwords with a slow, modern algorithm such as Argon2id or bcrypt; never store them in plain text or with fast hashes
- Offer multi-factor authentication, and require it for administrative accounts
- Rate-limit login, registration and password-reset endpoints
- Store session tokens in cookies marked `HttpOnly`, `Secure` and `SameSite`
- Expire sessions and invalidate them on logout and password change

## Input validation and injection

Injection flaws occur when untrusted input is interpreted as code or commands.

- **SQL injection:** always use parameterised queries or a query builder; never concatenate user input into SQL
- **Command injection:** avoid passing user input to shell commands
- **Validation:** check type, length, format and allowed values on the server, using a schema

Client-side validation improves usability, but it is never a security control.

## Cross-site scripting (XSS)

XSS lets attackers run scripts in other users'' browsers.

- Rely on frameworks that escape output by default, and avoid bypassing that escaping
- Never render untrusted HTML; if rich text is required, sanitise it with a proven library or use a restricted markup format
- Add a Content Security Policy (CSP) to limit where scripts can load from

## Cross-site request forgery (CSRF)

CSRF tricks a logged-in user''s browser into making unwanted requests. `SameSite` cookies prevent most cases; for sensitive operations, add CSRF tokens or verify the request origin.

## Security headers

A few HTTP headers provide significant protection:

- `Strict-Transport-Security` to enforce HTTPS
- `Content-Security-Policy` to restrict scripts, styles and frames
- `X-Content-Type-Options: nosniff` to prevent MIME-type confusion
- `Referrer-Policy` to limit leaked URLs
- `frame-ancestors` in the CSP to prevent clickjacking

## Protecting data

- Use HTTPS everywhere
- Encrypt sensitive data at rest where appropriate
- Collect only the data you need, and delete it when it is no longer required
- Keep secrets such as API keys and database credentials out of source code and client-side bundles, using environment variables or a secrets manager
- Restrict who and what can access production databases

## Dependencies and the supply chain

Modern applications include hundreds of third-party packages, any of which may contain vulnerabilities.

- Keep dependencies updated and remove unused ones
- Use automated tools to flag known vulnerabilities
- Pin versions with a lockfile and review significant upgrades
- Be cautious about adding small, unmaintained packages for trivial functionality

## Logging, monitoring and response

You cannot respond to attacks you cannot see.

- Log authentication events, permission failures, administrative actions and errors
- Never log passwords, tokens or full payment details
- Alert on suspicious patterns such as repeated failed logins or unusual data exports
- Have a plan for what happens when something goes wrong

Read [What Is a SOC and How Does Security Monitoring Work?](/blog/what-is-a-soc) for how monitoring works at scale.

## Secure development practices

- Code review with security in mind
- Automated tests for authorisation rules, not just features
- Static analysis and dependency scanning in the CI pipeline
- Separate development, staging and production environments
- Regular security testing, including manual testing of business logic before major releases

## Conclusion

Web application security comes from many consistent practices rather than one tool: secure design, strict server-side access control, sound authentication, careful input handling, protective headers, managed dependencies and good monitoring. Building these in from the start costs far less than retrofitting them after an incident.

APIs deserve particular attention; see [API Security: Common Vulnerabilities and How to Protect Your APIs](/blog/api-security-vulnerabilities). For a review of your application, explore our [cybersecurity services](/services/cybersecurity) or [contact us](/contact).',
  'Cybersecurity',
  array['Web Security', 'Application Security', 'OWASP', 'Secure Development']::text[],
  4,
  false,
  'published',
  '2026-09-29 09:00:00+05:45'::timestamptz,
  'Web Application Security: Essential Security Practices',
  'Essential web application security practices: access control, authentication, injection and XSS prevention, security headers, dependency management and monitoring.'
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  category = excluded.category,
  tags = excluded.tags,
  reading_time = excluded.reading_time,
  featured = excluded.featured,
  status = excluded.status,
  published_at = coalesce(public.blog_posts.published_at, excluded.published_at),
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

-- What Is Solana and How Does It Work? (~849 words)
insert into public.blog_posts (slug, title, excerpt, content, category, tags, reading_time, featured, status, published_at, seo_title, seo_description)
values (
  'what-is-solana',
  'What Is Solana and How Does It Work?',
  'A clear explanation of how Solana works: Proof of History, Tower BFT, parallel execution with Sealevel, the account model, and the trade-offs developers should know.',
  'Solana is a public, permissionless blockchain designed for high throughput and low transaction fees. Where many blockchains process transactions one after another, Solana''s architecture is built around parallel execution and a shared notion of time, which lets it confirm transactions quickly and cheaply. This article explains how Solana works, what makes it different and what developers should know before building on it.

## Solana at a glance

- **Consensus:** proof of stake, with validators staking SOL to participate in producing and voting on blocks
- **Native token:** SOL, used for transaction fees and staking; the smallest unit is a *lamport* (one billionth of a SOL)
- **Smart contracts:** called *programs*, typically written in Rust
- **Design goal:** scale by making a single chain fast, rather than relying primarily on separate layer-2 networks

## How Solana works

### Proof of History: a clock for the network

Distributed systems struggle to agree on the order and timing of events. Solana addresses this with **Proof of History (PoH)**, a sequence of SHA-256 hashes where each hash takes the previous output as input. Because the sequence must be computed one step at a time, it acts as a verifiable record that time has passed between events. Transactions and events are inserted into this sequence, giving the network an agreed ordering without validators constantly messaging each other about time.

PoH is not a consensus mechanism by itself. It is a clock that makes consensus more efficient.

### Tower BFT and proof of stake

Validators vote on the state of the ledger using **Tower BFT**, a variant of practical Byzantine fault tolerance that uses the PoH clock to reduce communication overhead. Votes are weighted by stake, and validators are rewarded for honest participation.

### Leaders and slots

Time is divided into short **slots**, and a schedule decides which validator is the **leader** for each one. The leader orders incoming transactions and produces blocks. Because the schedule is known in advance, transactions can be forwarded directly to upcoming leaders instead of waiting in a global mempool; this is known as **Gulf Stream**.

### Sealevel: parallel execution

Every Solana transaction declares in advance which accounts it will read and which it will write. The runtime, **Sealevel**, uses this information to run non-overlapping transactions in parallel across CPU cores. This is a major difference from execution models that process every transaction sequentially.

### Turbine: block propagation

Blocks are split into small pieces and spread through the validator network in a tree structure called **Turbine**, which reduces the bandwidth each validator needs.

## The account model

Solana separates code from state:

- **Programs** are stateless executable code
- **Accounts** hold data and SOL, and each account has an **owner** program that is allowed to modify its data
- Accounts must hold a minimum balance to be *rent-exempt*, which pays for the storage they occupy on validators
- **Program derived addresses (PDAs)** are addresses controlled by a program rather than a private key, commonly used to store program state

Programs can call other programs through **cross-program invocations (CPIs)**, which is how protocols compose with each other.

## Building on Solana

Typical tools in a Solana developer''s stack include:

- **Rust** for on-chain programs, often with the **Anchor** framework, which generates boilerplate, validates accounts and produces a client interface definition
- **Client libraries** for JavaScript/TypeScript and other languages to build transactions from web and mobile apps
- **Local validators and devnet** for testing before deploying to mainnet
- **Wallets** that let users sign transactions

Because Solana programs must explicitly validate every account passed to them, a large class of security bugs comes from missing checks. We cover these in [Smart Contract Security: Common Vulnerabilities](/blog/smart-contract-security-vulnerabilities).

## Strengths

- **Low fees and fast confirmation**, which make applications like payments, trading and games practical on-chain
- **A single, composable state**, so applications can interact without bridging between separate networks
- **A large developer ecosystem** with mature tooling

## Trade-offs

- **Hardware requirements:** running a validator demands powerful hardware and bandwidth, which raises questions about how many independent operators can participate
- **Reliability history:** the network experienced several significant outages in its earlier years; improvements to the networking stack, fee markets and additional validator clients have been aimed at strengthening resilience
- **Programming model:** explicit account handling is powerful but less familiar than the contract-centric model used on Ethereum, and mistakes can be costly

## Common use cases

- Payments and stablecoin transfers
- Decentralised exchanges and other DeFi protocols
- NFTs and digital collectibles
- Consumer applications and games that need cheap, frequent transactions
- Tokenisation and on-chain infrastructure experiments

## Conclusion

Solana combines Proof of History, stake-weighted consensus and parallel transaction execution to achieve high throughput at low cost on a single chain. Its account model and explicit data access are the keys to its performance, and the main things developers must understand to build securely on it.

Web3 security is an active area of research in our [Innovation Lab](/innovation), including [TrenchGuard](/innovation/trenchguard), our research into AI-assisted smart contract security. Continue with [Zero-Knowledge Proofs Explained Simply](/blog/zero-knowledge-proofs-explained), or [contact us](/contact) to discuss a Web3 idea.',
  'Web3',
  array['Solana', 'Blockchain', 'Web3', 'Proof of History']::text[],
  4,
  false,
  'published',
  '2026-10-01 09:00:00+05:45'::timestamptz,
  'What Is Solana and How Does It Work?',
  'How the Solana blockchain works: Proof of History, Tower BFT, Sealevel parallel execution and the account model, plus its strengths and trade-offs.'
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  category = excluded.category,
  tags = excluded.tags,
  reading_time = excluded.reading_time,
  featured = excluded.featured,
  status = excluded.status,
  published_at = coalesce(public.blog_posts.published_at, excluded.published_at),
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

-- Smart Contract Security: Common Vulnerabilities (~911 words)
insert into public.blog_posts (slug, title, excerpt, content, category, tags, reading_time, featured, status, published_at, seo_title, seo_description)
values (
  'smart-contract-security-vulnerabilities',
  'Smart Contract Security: Common Vulnerabilities',
  'The most common smart contract vulnerabilities on EVM chains and Solana, from reentrancy and oracle manipulation to missing signer checks, and how to prevent them.',
  'Smart contracts hold and move real value, their code is usually public, and once deployed they are difficult or impossible to change. That combination makes security mistakes unusually expensive: a single bug can be exploited within minutes, and stolen funds are rarely recovered. This article covers the most common smart contract vulnerabilities on EVM chains and Solana, and the practices that prevent them.

## Why smart contract security is different

- **Code is law, including bugs.** The contract does exactly what its code says, not what its authors intended.
- **Everything is public.** Attackers can read the code and simulate attacks before executing them.
- **Immutability.** Fixing a bug may require a migration or an upgrade mechanism, which itself introduces risk.
- **Composability.** Contracts interact with other contracts, so assumptions about external behaviour can be broken by a third party.

## Common vulnerabilities on EVM chains

### Reentrancy

A contract sends funds or calls an external contract before updating its own state. The external contract calls back into the original function and repeats the withdrawal before the balance is reduced. The 2016 attack on The DAO is the best-known example.

**Prevention:** follow the *checks-effects-interactions* pattern (validate, update state, then make external calls) and use reentrancy guards where appropriate.

### Access control flaws

Sensitive functions, such as minting, pausing, upgrading or withdrawing, are missing permission checks or are protected by the wrong check. A classic mistake is authorising with `tx.origin` instead of `msg.sender`.

**Prevention:** explicit, well-tested role checks on every privileged function, and minimal privileged roles, ideally held by multisig wallets.

### Integer overflow and underflow

Arithmetic that wraps around can turn a small balance into a huge one. Solidity 0.8 and later revert on overflow by default, but `unchecked` blocks, older compilers and other languages still require care.

### Oracle and price manipulation

Protocols that read asset prices from a single on-chain source, such as one liquidity pool, can be manipulated within a single transaction, often using flash loans that borrow large amounts without collateral for the duration of the transaction.

**Prevention:** use robust oracles, time-weighted averages and sanity limits, and never trust a spot price that can be moved in one transaction.

### Front-running and MEV

Pending transactions are visible before they are confirmed, so others can insert their own transactions before or after them to profit. This is known as maximal extractable value (MEV).

**Prevention:** slippage limits, commit-reveal schemes and designs that do not leak profitable information before execution.

### Unchecked external calls and delegatecall

Ignoring the return value of a low-level call can leave a contract believing a transfer succeeded when it failed. `delegatecall` executes another contract''s code in the caller''s storage context, so pointing it at untrusted code is dangerous.

### Upgradeability mistakes

Proxy patterns allow contracts to be upgraded, but uninitialised implementation contracts, storage layout collisions between versions and poorly protected upgrade functions have all led to major losses.

### Signature replay

A signed message accepted more than once, or on more than one chain, lets an attacker repeat an authorised action.

**Prevention:** include nonces, expiry times, the contract address and the chain ID in what is signed.

## Common vulnerabilities on Solana

Solana''s account model, explained in [What Is Solana and How Does It Work?](/blog/what-is-solana), introduces its own class of bugs. Programs receive accounts as inputs and must validate them explicitly:

- **Missing signer checks:** an instruction acts on behalf of a user without verifying that the user signed the transaction
- **Missing owner checks:** a program trusts account data without confirming the account is owned by the expected program, allowing attackers to pass in forged accounts
- **Account confusion:** an account of one type is accepted where another type was expected
- **Arbitrary cross-program invocation:** a program calls whichever program ID is passed in, letting attackers substitute a malicious one
- **PDA validation errors:** derived addresses are not checked against the expected seeds

Frameworks such as Anchor generate many of these checks automatically when account constraints are declared correctly.

## How to secure smart contracts

1. **Keep contracts simple.** Every additional feature is additional attack surface.
2. **Use audited libraries** for standard functionality such as tokens and access control.
3. **Test thoroughly**, including unit tests, integration tests against forked mainnet state, and property-based fuzzing with tools such as Foundry or Echidna.
4. **Run static analysis** with tools such as Slither to catch known patterns.
5. **Consider formal verification** for high-value logic.
6. **Get independent audits** before launch, and treat the audit as one layer, not a guarantee.
7. **Plan for incidents:** pause mechanisms, monitoring of on-chain activity and a clear response plan.
8. **Run a bug bounty** so researchers have an incentive to report rather than exploit.

## The role of automation and AI

Manual review remains essential, but automated tools can scale parts of the work: generating test cases, exploring unusual execution paths and flagging suspicious patterns for human review. Any automated finding still needs validation in a controlled environment before it can be trusted.

This is the focus of [TrenchGuard](/innovation/trenchguard), our research project exploring how AI agents could assist with smart contract security testing.

## Conclusion

Most smart contract exploits come from a familiar set of mistakes: reentrancy, missing access control, manipulable prices, unvalidated accounts and unsafe upgrades. Simple designs, thorough testing, independent review and a plan for when things go wrong are the best defences.

For broader application security, see [Web Application Security: Essential Security Practices](/blog/web-application-security-practices), or explore our [cybersecurity services](/services/cybersecurity).',
  'Web3',
  array['Smart Contracts', 'Web3 Security', 'Solidity', 'Solana']::text[],
  4,
  false,
  'published',
  '2026-10-03 09:00:00+05:45'::timestamptz,
  'Smart Contract Security: Common Vulnerabilities',
  'Common smart contract vulnerabilities on EVM chains and Solana, including reentrancy, access control flaws and oracle manipulation, and how to prevent them.'
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  category = excluded.category,
  tags = excluded.tags,
  reading_time = excluded.reading_time,
  featured = excluded.featured,
  status = excluded.status,
  published_at = coalesce(public.blog_posts.published_at, excluded.published_at),
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

-- Zero-Knowledge Proofs Explained Simply (~856 words)
insert into public.blog_posts (slug, title, excerpt, content, category, tags, reading_time, featured, status, published_at, seo_title, seo_description)
values (
  'zero-knowledge-proofs-explained',
  'Zero-Knowledge Proofs Explained Simply',
  'What zero-knowledge proofs are, how proving something without revealing it actually works, the difference between SNARKs and STARKs, and where they are used today.',
  'A zero-knowledge proof lets one party prove that a statement is true without revealing anything beyond the fact that it is true. You can prove you know a password without sending it, prove you are over 18 without revealing your birth date, or prove a batch of transactions was processed correctly without anyone re-executing them. This article explains zero-knowledge proofs in plain language, how they work and where they are used.

## The core idea

Every zero-knowledge proof involves two parties:

- **The prover**, who knows something and wants to prove it
- **The verifier**, who wants to be convinced without learning the secret

A valid zero-knowledge proof system has three properties:

1. **Completeness:** if the statement is true and the prover is honest, the verifier will be convinced.
2. **Soundness:** if the statement is false, a cheating prover cannot convince the verifier, except with negligible probability.
3. **Zero knowledge:** the verifier learns nothing except that the statement is true.

## A simple analogy: the cave

Imagine a circular cave with one entrance that splits into two paths, A and B, which meet at a locked door deep inside. Peggy claims she knows the password that opens the door. Victor wants proof but should not learn the password.

1. Victor waits outside while Peggy walks down one path, A or B, at random.
2. Victor comes to the entrance and shouts which path he wants Peggy to return by.
3. If Peggy knows the password, she can always return by the requested path, opening the door if needed.

If she does not know it, she has a 50% chance of guessing correctly each round. After 20 rounds, the chance of cheating successfully is less than one in a million. Victor becomes convinced, yet he never sees the password.

## Interactive and non-interactive proofs

The cave example is **interactive**: the verifier sends challenges and the prover responds. That is impractical for blockchains, where a proof must be verified by anyone at any time.

**Non-interactive proofs** solve this. Techniques such as the Fiat-Shamir heuristic replace the verifier''s random challenges with the output of a cryptographic hash function, so the prover can generate a single proof that anyone can check later.

## zk-SNARKs and zk-STARKs

The two best-known families of practical zero-knowledge proofs are:

### zk-SNARKs

*Succinct non-interactive arguments of knowledge.* Proofs are very small and fast to verify, which makes them attractive on blockchains where verification costs fees. Some SNARK constructions, such as Groth16, require a **trusted setup** ceremony for each circuit; others, such as PLONK, use a universal setup that can be reused.

### zk-STARKs

*Scalable transparent arguments of knowledge.* STARKs need no trusted setup and rely on hash functions, which are believed to resist attacks by future quantum computers. The trade-off is larger proofs, which are more expensive to store and verify.

## How a computation becomes a proof

To prove something with zero-knowledge, the statement is expressed as a **circuit**: a set of mathematical constraints that are satisfied only if the computation was performed correctly. The prover runs the computation, produces a *witness* (including the secret inputs) and generates a proof that the constraints are satisfied.

Developers rarely write constraints by hand. Languages and frameworks such as Circom, Noir and Cairo let them describe the computation at a higher level and compile it into a circuit.

Generating proofs is computationally expensive, much more so than running the original computation, while verification is cheap. That asymmetry is exactly what makes them useful.

## Real-world applications

### Blockchain scaling: zk-rollups

A zk-rollup processes many transactions off the main chain and posts a single proof that they were executed correctly. The main chain verifies the proof instead of re-executing every transaction, which increases capacity while inheriting the main chain''s security. Several Ethereum layer-2 networks, including zkSync, Starknet and Scroll, use this approach.

### Private transactions

Zcash uses zero-knowledge proofs so transactions can be validated without revealing sender, receiver or amount.

### Identity and credentials

Zero-knowledge proofs can show that someone holds a valid credential, such as being over a certain age, residing in a country or being a verified customer, without revealing the underlying document.

### Verifiable computation

A service can prove it ran a specific computation correctly, for example a machine learning model on given inputs, without the verifier repeating the work.

## Limitations

- **Proof generation is expensive** in time and computing resources, although hardware acceleration and better proving systems keep improving it
- **Circuits are hard to get right.** Bugs in constraints can make a system unsound, letting false statements pass verification
- **Trusted setups**, where required, depend on participants discarding secret parameters
- **Tooling is maturing**, but still demands specialist knowledge

## Conclusion

Zero-knowledge proofs separate *proving* something from *revealing* it. That makes them one of the most important building blocks in modern cryptography, powering blockchain scaling, private transactions and privacy-preserving identity. They remain complex to build safely, but their applications are expanding well beyond Web3.

For more on blockchain technology, read [What Is Solana and How Does It Work?](/blog/what-is-solana) and [Smart Contract Security: Common Vulnerabilities](/blog/smart-contract-security-vulnerabilities), or explore the research in our [Innovation Lab](/innovation).',
  'Web3',
  array['Zero-Knowledge Proofs', 'Cryptography', 'zk-Rollups', 'Web3']::text[],
  4,
  false,
  'published',
  '2026-10-05 09:00:00+05:45'::timestamptz,
  'Zero-Knowledge Proofs Explained Simply',
  'A plain-language explanation of zero-knowledge proofs: how they work, zk-SNARKs vs zk-STARKs, and real uses in blockchain scaling, privacy and identity.'
)
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  category = excluded.category,
  tags = excluded.tags,
  reading_time = excluded.reading_time,
  featured = excluded.featured,
  status = excluded.status,
  published_at = coalesce(public.blog_posts.published_at, excluded.published_at),
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

commit;
