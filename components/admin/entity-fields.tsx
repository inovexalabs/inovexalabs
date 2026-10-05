"use client";

import { useRef } from "react";
import { get, useFormContext, type FieldPath } from "react-hook-form";
import { FormSection } from "@/components/admin/forms/form-section";
import { GalleryField, type GalleryItem } from "@/components/admin/gallery-field";
import { ItemListField } from "@/components/admin/forms/item-list-field";
import { TagListField } from "@/components/admin/forms/tag-list-field";
import { fieldA11y, FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ENTITY_FORMS, type AdminEntityKey } from "@/lib/admin/entity-forms";
import { INNOVATION_CATEGORIES, INNOVATION_CATEGORY_KEYS, LAB_STAGE_KEYS, LAB_STAGES } from "@/lib/constants/innovation";
import { PROCESS_ICON_KEYS, PROCESS_ICON_LABELS } from "@/lib/constants/process-icons";
import { TECH_CATEGORIES, TECH_CATEGORY_KEYS } from "@/lib/constants/tech";
import { FAQ_PAGES, FAQ_PAGE_KEYS } from "@/lib/constants/faqs";
import { slugify } from "@/lib/utils/slugify";
import { PROJECT_LIST_LIMITS } from "@/lib/validations/project";
import { TEAM_LIMITS } from "@/lib/validations/team";

/**
 * Form state is loosely typed here on purpose: the concrete shape is enforced
 * by the entity's Zod schema at submit time, and react-hook-form's path types
 * need an `any` value type to accept string field names.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormValues = Record<string, any>;

interface EntityFieldsProps {
  entity: AdminEntityKey;
  mode: "create" | "edit";
}

/**
 * Entity-specific fields for the generic admin form. Rendered inside
 * ContentFormShell, so everything here reads and writes the same form state.
 */
export function EntityFields({ entity, mode }: EntityFieldsProps) {
  const form = useFormContext<FormValues>();
  const { register, setValue, watch, formState } = form;
  const err = (path: string) => get(formState.errors, `${path}.message`) as string | undefined;

  const isSubmitted = formState.isSubmitted;
  const titleName = titleFieldFor(entity);
  // On edit the slug is treated as manual from the start: changing it breaks links.
  const slugEdited = useRef(mode === "edit");
  const usesSlug = "slug" in watch();

  const autoSlug = titleName
    ? register(titleName, {
        onChange: (event: { target: { value: string } }) => {
          if (!usesSlug || slugEdited.current) return;
          const slugField = "slug" as FieldPath<FormValues>;
          setValue(slugField, slugify(event.target.value), { shouldValidate: isSubmitted });
        },
      })
    : undefined;
  const slugField = register("slug", { onChange: () => (slugEdited.current = true) });

  return (
    <>
      {/* Basics */}
      <FormSection id="basics" title="Basics" description="How this record is named and summarised across the site.">
        {entity === "testimonials" ? (
          <>
            <FormField id="name" label="Name" error={err("name")}>
              <Input {...fieldA11y("name", { error: err("name") })} {...register("name")} autoComplete="off" />
            </FormField>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="role" label="Role" optional error={err("role")}>
                <Input {...fieldA11y("role", { error: err("role") })} {...register("role")} />
              </FormField>
              <FormField id="company" label="Company" optional error={err("company")}>
                <Input {...fieldA11y("company", { error: err("company") })} {...register("company")} />
              </FormField>
            </div>
          </>
        ) : entity === "faqs" ? (
          <FormField id="question" label="Question" error={err("question")}>
            <Input {...fieldA11y("question", { error: err("question") })} {...register("question")} />
          </FormField>
        ) : entity === "navigation" ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="label" label="Label" hint="Keep it short: 32 characters or fewer." error={err("label")}>
              <Input {...fieldA11y("label", { hint: true, error: err("label") })} {...register("label")} />
            </FormField>
            <FormField id="href" label="Link" hint="A path like /contact, or a full https:// address." error={err("href")}>
              <Input
                {...fieldA11y("href", { hint: true, error: err("href") })}
                {...register("href")}
                spellCheck={false}
              />
            </FormField>
          </div>
        ) : (
          <>
            <FormField id={titleName} label={entity === "technologies" ? "Name" : "Title"} error={err(titleName)}>
              <Input {...fieldA11y(titleName, { error: err(titleName) })} {...autoSlug} autoComplete="off" />
            </FormField>
            <FormField
              id="slug"
              label="Slug"
              hint="Part of the page address. Filled in from the title."
              error={err("slug")}
            >
              <Input
                {...fieldA11y("slug", { hint: true, error: err("slug") })}
                {...slugField}
                autoComplete="off"
                spellCheck={false}
              />
            </FormField>
          </>
        )}
      </FormSection>

      {entity === "projects" ? renderProjectFields(err) : null}
      {entity === "innovation" ? renderInnovationFields(err) : null}
      {entity === "blog" ? renderBlogFields(err) : null}
      {entity === "testimonials" ? renderTestimonialFields(err) : null}
      {entity === "team" ? renderTeamFields(err) : null}
      {entity === "technologies" ? renderTechnologyFields(err) : null}
      {entity === "process" ? renderProcessFields(err) : null}
      {entity === "faqs" ? renderFaqFields(err) : null}
      {entity === "navigation" ? renderNavigationFields(err) : null}
    </>
  );

  // --- per-entity sections ---
  // Plain render helpers, called as functions rather than used as <Components />.
  // Declared inside EntityFields, a component would be a new type on every
  // render (and watch() re-renders on each keystroke), so React would remount
  // its inputs: focus jumped out of fields and list editors lost their state.

  function renderProjectFields(fieldError: (path: string) => string | undefined) {
    const gallery = (watch("gallery") ?? []) as GalleryItem[];

    return (
      <>
        <FormSection id="gallery" title="Gallery" description="Images shown in the gallery section of the case study.">
          <GalleryField
            value={gallery}
            onChange={(next) => setValue("gallery", typeof next === "function" ? next(gallery) : next, { shouldDirty: true })}
            folder={ENTITY_FORMS[entity].image?.folder ?? "projects"}
            error={fieldError("gallery")}
          />
        </FormSection>

        <FormSection id="technologies" title="Technologies" description="Languages, frameworks and platforms used.">
          <TagListField<FormValues>
            name="technologies"
            label="Technologies"
            max={PROJECT_LIST_LIMITS.technologies}
            maxLength={40}
            placeholder="e.g. TypeScript"
          />
        </FormSection>

        <FormSection id="story" title="The story" description="Challenge, solution and implementation — leave a blank line between paragraphs.">
          <FormField id="challenge" label="Challenge" optional error={fieldError("challenge")}>
            <Textarea rows={5} {...fieldA11y("challenge", { error: fieldError("challenge") })} {...register("challenge")} />
          </FormField>
          <FormField id="solution" label="Solution" optional error={fieldError("solution")}>
            <Textarea rows={5} {...fieldA11y("solution", { error: fieldError("solution") })} {...register("solution")} />
          </FormField>
          <FormField id="implementation" label="Implementation" optional error={fieldError("implementation")}>
            <Textarea rows={5} {...fieldA11y("implementation", { error: fieldError("implementation") })} {...register("implementation")} />
          </FormField>
          <FormField id="results" label="Results (prose)" optional hint="Only describe outcomes you can stand behind." error={fieldError("results")}>
            <Textarea rows={4} {...fieldA11y("results", { hint: true, error: fieldError("results") })} {...register("results")} />
          </FormField>
        </FormSection>

        <FormSection id="metrics" title="Measured results" description="Figures shown as metric cards. Leave empty when there is nothing measured — nothing is ever invented.">
          <ItemListField<FormValues>
            name="metrics"
            itemLabel="Result"
            max={PROJECT_LIST_LIMITS.metrics}
            fields={[
              { key: "metric", label: "Metric", placeholder: "e.g. 40%" },
              { key: "label", label: "Label", placeholder: "e.g. faster workflow" },
              { key: "description", label: "Description", multiline: true },
            ]}
            emptyText="No measured results yet. The results section stays hidden on the page."
          />
        </FormSection>

        <FormSection id="details" title="Details" description="Client, industry and links.">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="client_name" label="Client" optional error={fieldError("client_name")}>
              <Input {...fieldA11y("client_name", { error: fieldError("client_name") })} {...register("client_name")} />
            </FormField>
            <FormField id="industry" label="Industry" optional error={fieldError("industry")}>
              <Input {...fieldA11y("industry", { error: fieldError("industry") })} {...register("industry")} />
            </FormField>
            <FormField id="category" label="Category" hint="Used for filtering, e.g. “Web” or “AI”." error={fieldError("category")}>
              <Input {...fieldA11y("category", { hint: true, error: fieldError("category") })} {...register("category")} />
            </FormField>
            <FormField id="project_url" label="Project link" optional error={fieldError("project_url")}>
              <Input
                {...fieldA11y("project_url", { error: fieldError("project_url") })}
                {...register("project_url")}
                placeholder="https://"
                spellCheck={false}
              />
            </FormField>
            <FormField id="github_url" label="Repository link" optional error={fieldError("github_url")}>
              <Input
                {...fieldA11y("github_url", { error: fieldError("github_url") })}
                {...register("github_url")}
                placeholder="https://"
                spellCheck={false}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection id="overview" title="Overview" description="The full case-study introduction. Leave a blank line between paragraphs.">
          <FormField id="description" label="Full description" optional error={fieldError("description")}>
            <Textarea rows={8} {...fieldA11y("description", { error: fieldError("description") })} {...register("description")} />
          </FormField>
          <FormField
            id="short_description"
            label="Short description"
            hint="Shown on cards and at the top of the page."
            error={fieldError("short_description")}
          >
            <Textarea
              rows={3}
              {...fieldA11y("short_description", { hint: true, error: fieldError("short_description") })}
              {...register("short_description")}
            />
          </FormField>
        </FormSection>
      </>
    );
  }

  function renderInnovationFields(fieldError: (path: string) => string | undefined) {
    return (
      <>
        <FormSection id="classification" title="Classification" description="Where this experiment sits in the Lab.">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="category" label="Category" error={fieldError("category")}>
              <Select {...fieldA11y("category", { error: fieldError("category") })} {...register("category")}>
                {INNOVATION_CATEGORY_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {INNOVATION_CATEGORIES[key]}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField id="stage" label="Stage" hint="The experiment's life cycle — separate from publish status." error={fieldError("stage")}>
              <Select {...fieldA11y("stage", { hint: true, error: fieldError("stage") })} {...register("stage")}>
                {LAB_STAGE_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {LAB_STAGES[key].label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
          <FormField id="description" label="Short description" error={fieldError("description")}>
            <Textarea rows={3} {...fieldA11y("description", { error: fieldError("description") })} {...register("description")} />
          </FormField>
          <FormField id="long_description" label="Full description" optional hint="Leave a blank line between paragraphs." error={fieldError("long_description")}>
            <Textarea rows={7} {...fieldA11y("long_description", { hint: true, error: fieldError("long_description") })} {...register("long_description")} />
          </FormField>
        </FormSection>

        <FormSection id="narrative" title="The write-up" description="Problem, experiment, learnings and where it goes next. Each section hides when empty.">
          <FormField id="problem" label="Problem" optional error={fieldError("problem")}>
            <Textarea rows={4} {...fieldA11y("problem", { error: fieldError("problem") })} {...register("problem")} />
          </FormField>
          <FormField id="experiment" label="Experiment" optional error={fieldError("experiment")}>
            <Textarea rows={4} {...fieldA11y("experiment", { error: fieldError("experiment") })} {...register("experiment")} />
          </FormField>
          <FormField id="learnings" label="What we learned" optional error={fieldError("learnings")}>
            <Textarea rows={4} {...fieldA11y("learnings", { error: fieldError("learnings") })} {...register("learnings")} />
          </FormField>
          <FormField id="future_direction" label="Future direction" optional error={fieldError("future_direction")}>
            <Textarea rows={4} {...fieldA11y("future_direction", { error: fieldError("future_direction") })} {...register("future_direction")} />
          </FormField>
        </FormSection>

        <FormSection id="technologies" title="Technologies">
          <TagListField<FormValues>
            name="technologies"
            label="Technologies"
            max={16}
            maxLength={40}
            placeholder="e.g. Python"
          />
        </FormSection>

        <FormSection id="links" title="Links">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="demo_url" label="Demo link" optional error={fieldError("demo_url")}>
              <Input
                {...fieldA11y("demo_url", { error: fieldError("demo_url") })}
                {...register("demo_url")}
                placeholder="https://"
                spellCheck={false}
              />
            </FormField>
            <FormField id="github_url" label="Repository link" optional error={fieldError("github_url")}>
              <Input
                {...fieldA11y("github_url", { error: fieldError("github_url") })}
                {...register("github_url")}
                placeholder="https://"
                spellCheck={false}
              />
            </FormField>
          </div>
        </FormSection>
      </>
    );
  }

  function renderBlogFields(fieldError: (path: string) => string | undefined) {
    const content = (watch("content") as string | undefined) ?? "";

    return (
      <>
        <FormSection
          id="writing"
          title="Writing"
          description="Use ## for section headings (they become the table of contents), - for bullets, **bold** and `code`. Raw HTML is never rendered."
        >
          <FormField id="excerpt" label="Excerpt" hint="Shown on cards and in search results." error={fieldError("excerpt")}>
            <Textarea rows={3} {...fieldA11y("excerpt", { hint: true, error: fieldError("excerpt") })} {...register("excerpt")} />
          </FormField>
          <FormField
            id="content"
            label="Content"
            hint="Minimum 100 characters."
            error={fieldError("content")}
            count={{ length: content.length, max: 120000 }}
          >
            <Textarea
              rows={20}
              className="font-mono text-sm"
              {...fieldA11y("content", { hint: true, error: fieldError("content") })}
              {...register("content")}
            />
          </FormField>
        </FormSection>

        <FormSection id="classification" title="Classification">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="category" label="Category" hint="Used for filtering, e.g. “Engineering”." error={fieldError("category")}>
              <Input {...fieldA11y("category", { hint: true, error: fieldError("category") })} {...register("category")} />
            </FormField>
            <FormField id="author_name" label="Author" optional error={fieldError("author_name")}>
              <Input {...fieldA11y("author_name", { error: fieldError("author_name") })} {...register("author_name")} />
            </FormField>
          </div>
          <TagListField<FormValues> name="tags" label="Tags" max={8} maxLength={30} placeholder="e.g. security" />
          <FormField id="canonical_url" label="Canonical URL" optional hint="Only if this post was published elsewhere first." error={fieldError("canonical_url")}>
            <Input
              {...fieldA11y("canonical_url", { hint: true, error: fieldError("canonical_url") })}
              {...register("canonical_url")}
              placeholder="https://"
              spellCheck={false}
            />
          </FormField>
        </FormSection>
      </>
    );
  }

  function renderTestimonialFields(fieldError: (path: string) => string | undefined) {
    return (
      <FormSection id="quote" title="Quote" description="Only publish quotes you have permission to use.">
        <FormField id="testimonial" label="Testimonial" error={fieldError("testimonial")}>
          <Textarea rows={6} {...fieldA11y("testimonial", { error: fieldError("testimonial") })} {...register("testimonial")} />
        </FormField>
        <FormField id="rating" label="Rating" hint="1 to 5 stars." error={fieldError("rating")}>
          <Select {...fieldA11y("rating", { hint: true, error: fieldError("rating") })} {...register("rating", { setValueAs: (value) => Number(value) })}>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} / 5
              </option>
            ))}
          </Select>
        </FormField>
      </FormSection>
    );
  }

  function renderTeamFields(fieldError: (path: string) => string | undefined) {
    return (
      <>
        <FormSection id="profile" title="Profile">
          <FormField id="role" label="Role" error={fieldError("role")}>
            <Input {...fieldA11y("role", { error: fieldError("role") })} {...register("role")} />
          </FormField>
          <FormField id="bio" label="Bio" optional error={fieldError("bio")}>
            <Textarea rows={4} {...fieldA11y("bio", { error: fieldError("bio") })} {...register("bio")} />
          </FormField>
        </FormSection>

        <FormSection id="skills" title="Skills">
          <TagListField<FormValues> name="skills" label="Skills" max={TEAM_LIMITS.skills} maxLength={30} placeholder="e.g. Systems design" />
        </FormSection>

        <FormSection id="social" title="Profile links" description="Links use full https:// addresses.">
          <ItemListField<FormValues>
            name="social_links"
            itemLabel="Link"
            max={TEAM_LIMITS.socialLinks}
            fields={[
              { key: "label", label: "Label", placeholder: "GitHub" },
              { key: "url", label: "URL", placeholder: "https://" },
            ]}
            emptyText="No profile links yet."
          />
        </FormSection>
      </>
    );
  }

  function renderTechnologyFields(fieldError: (path: string) => string | undefined) {
    return (
      <FormSection id="technology" title="Technology">
        <FormField id="category" label="Category" error={fieldError("category")}>
          <Select {...fieldA11y("category", { error: fieldError("category") })} {...register("category")}>
            {TECH_CATEGORY_KEYS.map((key) => (
              <option key={key} value={key}>
                {TECH_CATEGORIES[key]}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField id="description" label="Description" optional hint="One line, shown on hover in the stack section." error={fieldError("description")}>
          <Input {...fieldA11y("description", { hint: true, error: fieldError("description") })} {...register("description")} />
        </FormField>
        <FormField id="website" label="Website" optional error={fieldError("website")}>
          <Input
            {...fieldA11y("website", { error: fieldError("website") })}
            {...register("website")}
            placeholder="https://"
            spellCheck={false}
          />
        </FormField>
      </FormSection>
    );
  }

  function renderProcessFields(fieldError: (path: string) => string | undefined) {
    return (
      <>
        <FormSection id="step" title="Step" description="The visible step number comes from the order in the list.">
          <FormField id="icon" label="Icon" error={fieldError("icon")}>
            <Select {...fieldA11y("icon", { error: fieldError("icon") })} {...register("icon")}>
              {PROCESS_ICON_KEYS.map((key) => (
                <option key={key} value={key}>
                  {PROCESS_ICON_LABELS[key]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField id="short_description" label="Short description" hint="One or two sentences under the step." error={fieldError("short_description")}>
            <Textarea rows={3} {...fieldA11y("short_description", { hint: true, error: fieldError("short_description") })} {...register("short_description")} />
          </FormField>
          <FormField id="description" label="Detailed description" error={fieldError("description")}>
            <Textarea rows={6} {...fieldA11y("description", { error: fieldError("description") })} {...register("description")} />
          </FormField>
          <FormField id="duration" label="Duration" optional hint="e.g. 1–2 weeks or Ongoing." error={fieldError("duration")}>
            <Input {...fieldA11y("duration", { hint: true, error: fieldError("duration") })} {...register("duration")} />
          </FormField>
        </FormSection>

        <FormSection id="deliverables" title="Deliverables" description="What the client walks away with at this step.">
          <TagListField<FormValues>
            name="deliverables"
            label="Deliverables"
            max={8}
            maxLength={60}
            placeholder="e.g. Architecture diagram"
          />
        </FormSection>
      </>
    );
  }

  function renderFaqFields(fieldError: (path: string) => string | undefined) {
    return (
      <FormSection id="faq" title="Question and answer" description="Where it appears decides which page shows it.">
        <FormField id="answer" label="Answer" error={fieldError("answer")}>
          <Textarea rows={6} {...fieldA11y("answer", { error: fieldError("answer") })} {...register("answer")} />
        </FormField>
        <FormField id="page" label="Appears on" error={fieldError("page")}>
          <Select {...fieldA11y("page", { error: fieldError("page") })} {...register("page")}>
            {FAQ_PAGE_KEYS.map((key) => (
              <option key={key} value={key}>
                {FAQ_PAGES[key]}
              </option>
            ))}
          </Select>
        </FormField>
      </FormSection>
    );
  }

  function renderNavigationFields(fieldError: (path: string) => string | undefined) {
    return (
      <FormSection id="location" title="Location" description="Header links appear in the main menu; footer links in the Company column.">
        <FormField id="location" label="Location" error={fieldError("location")}>
          <Select {...fieldA11y("location", { error: fieldError("location") })} {...register("location")}>
            <option value="header">Header</option>
            <option value="footer">Footer</option>
          </Select>
        </FormField>
      </FormSection>
    );
  }
}

/** Primary text field per entity (drives the automatic slug). */
function titleFieldFor(entity: AdminEntityKey): string {
  switch (entity) {
    case "team":
    case "technologies":
      return "name";
    case "faqs":
      return "question";
    case "navigation":
      return "label";
    default:
      return "title";
  }
}
