-- Initial published content. Everything below is editable afterwards from the
-- admin panel. Safe to re-run: existing slugs are left untouched, and tables
-- without a unique slug are only filled while still empty.

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

-- Home page capabilities ("What We Build"). Editable afterwards from the admin panel.
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

-- "How We Work": the seven-stage delivery process. Position is the visible step number.
insert into public.process_steps (slug, title, short_description, description, icon, deliverables, duration, sort_order, status)
values
  ('discover', 'Discover',
   'We understand the problem, the users, the business requirements and the objectives behind the project.',
   'Every engagement starts with questions, not assumptions. We map the workflow that exists today, agree on what success looks like, and write down the constraints: budget, timeline, compliance and the people who will actually use the thing.',
   'compass', array['Discovery workshop', 'Problem statement', 'Success criteria'], '1 week', 10, 'published'),
  ('define', 'Define',
   'We turn the findings into a sharp scope: what is in, what is out, and what ships first.',
   'Scope is where projects succeed or drift. We prioritise the outcome that proves the idea, cut everything that does not serve it, and agree on a definition of done before a single line of code is written.',
   'search', array['Scoped requirements', 'Release plan', 'Risks and assumptions'], '1 week', 20, 'published'),
  ('architect', 'Architect',
   'We design the system: data model, services, integrations, infrastructure and security boundaries.',
   'We choose the simplest architecture that meets today''s requirements without painting tomorrow''s into a corner. Data modelling, API contracts, authentication, hosting and cost are decided here and written down as a decision record.',
   'layers', array['Architecture diagram', 'Data model', 'Decision record'], '1–2 weeks', 30, 'published'),
  ('design', 'Design',
   'We shape user flows, interfaces and a design system that the product can grow into.',
   'Design is how the architecture becomes something a person can use. Flows are drawn, key screens are designed at every breakpoint, and the component library is agreed so engineering can build without guessing.',
   'pen-tool', array['User flows', 'Interface designs', 'Component library'], '2 weeks', 40, 'published'),
  ('build', 'Build',
   'We develop the product in short cycles, with working software to review every week.',
   'Small, reviewable increments keep everyone aligned. You see running software weekly, feedback lands while it is cheap to act on, and the codebase stays tested, documented and ready for the next change.',
   'hammer', array['Working increments', 'Automated tests', 'Technical documentation'], '4–12 weeks', 50, 'published'),
  ('validate', 'Validate',
   'We test functionality, performance, accessibility and security before anything ships.',
   'Before launch the product is exercised against the real requirements: functional and regression testing, performance profiling, accessibility checks, security review and a pass over the failure paths nobody thinks about until they happen.',
   'check', array['Test report', 'Security review', 'Performance baseline'], '1–2 weeks', 60, 'published'),
  ('launch-evolve', 'Launch & Evolve',
   'We deploy to production, watch it closely, and keep improving it from real usage.',
   'Launch is a milestone, not the finish line. We ship behind feature flags, monitor errors and performance, watch how people actually use the product, and turn that evidence into the next round of improvements.',
   'rocket', array['Production deployment', 'Monitoring and alerts', 'Improvement backlog'], 'Ongoing', 70, 'published')
on conflict (slug) do nothing;

-- Technology ecosystem. Listing a technology here is what makes it appear on the
-- site: the app never claims a capability that has not been added and published.
insert into public.technologies (slug, name, category, website, sort_order, status)
values
  ('next-js', 'Next.js', 'frontend', 'https://nextjs.org', 10, 'published'),
  ('react', 'React', 'frontend', 'https://react.dev', 20, 'published'),
  ('typescript', 'TypeScript', 'frontend', 'https://www.typescriptlang.org', 30, 'published'),
  ('node-js', 'Node.js', 'backend', 'https://nodejs.org', 40, 'published'),
  ('python', 'Python', 'backend', 'https://www.python.org', 50, 'published'),
  ('fastapi', 'FastAPI', 'backend', 'https://fastapi.tiangolo.com', 60, 'published'),
  ('postgresql', 'PostgreSQL', 'database', 'https://www.postgresql.org', 70, 'published'),
  ('supabase', 'Supabase', 'database', 'https://supabase.com', 80, 'published'),
  ('docker', 'Docker', 'devops', 'https://www.docker.com', 90, 'published'),
  ('aws', 'AWS', 'cloud', 'https://aws.amazon.com', 100, 'published'),
  ('cloudflare', 'Cloudflare', 'cloud', 'https://www.cloudflare.com', 110, 'published'),
  ('linux', 'Linux', 'devops', 'https://www.kernel.org', 120, 'published'),
  ('tensorflow', 'TensorFlow', 'ai', 'https://www.tensorflow.org', 130, 'published'),
  ('pytorch', 'PyTorch', 'ai', 'https://pytorch.org', 140, 'published'),
  ('openai-apis', 'OpenAI APIs', 'ai', 'https://platform.openai.com', 150, 'published'),
  ('solana', 'Solana', 'web3', 'https://solana.com', 160, 'published')
on conflict (slug) do nothing;

-- Editable navigation. The site falls back to its built-in route list when this
-- table is empty, so a fresh install still has a working header and footer.
insert into public.navigation_items (label, href, location, sort_order, status)
select v.label, v.href, v.location::public.nav_location, v.sort_order, 'published'
from (values
  ('Solutions', '/services', 'header', 10),
  ('Innovation', '/innovation', 'header', 20),
  ('Projects', '/projects', 'header', 30),
  ('About', '/about', 'header', 40),
  ('Blog', '/blog', 'header', 50),
  ('Contact', '/contact', 'header', 60),
  ('Services', '/services', 'footer', 10),
  ('Projects', '/projects', 'footer', 20),
  ('Innovation Lab', '/innovation', 'footer', 30),
  ('About', '/about', 'footer', 40),
  ('Blog', '/blog', 'footer', 50),
  ('Contact', '/contact', 'footer', 60)
) as v(label, href, location, sort_order)
where not exists (select 1 from public.navigation_items);

-- Frequently asked questions for the general pages.
insert into public.faq_items (question, answer, page, sort_order, status)
select v.question, v.answer, v.page::public.faq_page, v.sort_order, 'published'
from (values
  ('How does a project start?',
   'With a conversation. Send the form on the contact page with as much or as little detail as you have, and we reply within two working days to book a short call. If there is a fit, we run a paid discovery phase before any commitment to a full build.',
   'contact', 10),
  ('How long does a typical project take?',
   'A focused website or internal tool usually takes four to eight weeks. Larger platforms run in phases over three to six months, with working software to review from the first week either way.',
   'contact', 20),
  ('How do you price work?',
   'Discovery and design phases are fixed price. Build phases are quoted once the scope is agreed, and delivered either as a fixed-scope project or as a monthly retainer for ongoing product work.',
   'contact', 30),
  ('Do you work with existing codebases?',
   'Yes. Most engagements start inside something that already exists: an audit, a stabilisation plan and then incremental delivery rather than a rewrite for its own sake.',
   'general', 40),
  ('Who owns the code and the infrastructure?',
   'You do. Repositories, cloud accounts and domains are created in your name from day one, and everything is handed over with documentation at the end of the engagement.',
   'general', 50)
) as v(question, answer, page, sort_order)
where not exists (select 1 from public.faq_items);
