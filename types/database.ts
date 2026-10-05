/**
 * Supabase schema types. Mirrors supabase/migrations exactly.
 * Regenerate after every migration with:
 *   npx supabase gen types typescript --project-id <ref> --schema public > types/database.ts
 * (or `--local` against a local stack). The helper exports below match the
 * generator's output, so imports keep working after regeneration.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          role: Database["public"]["Enums"]["admin_role"];
          created_at: string;
        };
        Insert: {
          user_id: string;
          role?: Database["public"]["Enums"]["admin_role"];
          created_at?: string;
        };
        Update: {
          user_id?: string;
          role?: Database["public"]["Enums"]["admin_role"];
          created_at?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          cover_image_path: string | null;
          cover_image_alt: string | null;
          category: string;
          tags: string[];
          author_name: string | null;
          reading_time: number;
          featured: boolean;
          status: Database["public"]["Enums"]["content_status"];
          published_at: string | null;
          seo_title: string | null;
          seo_description: string | null;
          canonical_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt: string;
          content?: string;
          cover_image_path?: string | null;
          cover_image_alt?: string | null;
          category?: string;
          tags?: string[];
          author_name?: string | null;
          reading_time?: number;
          featured?: boolean;
          status?: Database["public"]["Enums"]["content_status"];
          published_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          canonical_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          cover_image_path?: string | null;
          cover_image_alt?: string | null;
          category?: string;
          tags?: string[];
          author_name?: string | null;
          reading_time?: number;
          featured?: boolean;
          status?: Database["public"]["Enums"]["content_status"];
          published_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          canonical_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      capabilities: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          visual: string;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          visual?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          visual?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: string;
          path: string;
          referrer: string | null;
          property: string | null;
          visitor_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          path: string;
          referrer?: string | null;
          property?: string | null;
          visitor_hash?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          path?: string;
          referrer?: string | null;
          property?: string | null;
          visitor_hash?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_leads: {
        Row: {
          id: string;
          reference_id: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          project_type: string;
          budget: string | null;
          timeline: string | null;
          services: string[];
          description: string;
          source: string;
          status: Database["public"]["Enums"]["lead_status"];
          priority: Database["public"]["Enums"]["lead_priority"];
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference_id: string;
          name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          project_type?: string;
          budget?: string | null;
          timeline?: string | null;
          services?: string[];
          description: string;
          source?: string;
          status?: Database["public"]["Enums"]["lead_status"];
          priority?: Database["public"]["Enums"]["lead_priority"];
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reference_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          company?: string | null;
          project_type?: string;
          budget?: string | null;
          timeline?: string | null;
          services?: string[];
          description?: string;
          source?: string;
          status?: Database["public"]["Enums"]["lead_status"];
          priority?: Database["public"]["Enums"]["lead_priority"];
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      faq_items: {
        Row: {
          id: string;
          question: string;
          answer: string;
          page: Database["public"]["Enums"]["faq_page"];
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          page?: Database["public"]["Enums"]["faq_page"];
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          page?: Database["public"]["Enums"]["faq_page"];
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      innovation_projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: Database["public"]["Enums"]["innovation_category"];
          stage: Database["public"]["Enums"]["lab_stage"];
          description: string;
          long_description: string;
          problem: string | null;
          experiment: string | null;
          learnings: string | null;
          future_direction: string | null;
          cover_image_path: string | null;
          cover_image_alt: string | null;
          technologies: string[];
          github_url: string | null;
          demo_url: string | null;
          featured: boolean;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          category?: Database["public"]["Enums"]["innovation_category"];
          stage?: Database["public"]["Enums"]["lab_stage"];
          description: string;
          long_description?: string;
          problem?: string | null;
          experiment?: string | null;
          learnings?: string | null;
          future_direction?: string | null;
          cover_image_path?: string | null;
          cover_image_alt?: string | null;
          technologies?: string[];
          github_url?: string | null;
          demo_url?: string | null;
          featured?: boolean;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          category?: Database["public"]["Enums"]["innovation_category"];
          stage?: Database["public"]["Enums"]["lab_stage"];
          description?: string;
          long_description?: string;
          problem?: string | null;
          experiment?: string | null;
          learnings?: string | null;
          future_direction?: string | null;
          cover_image_path?: string | null;
          cover_image_alt?: string | null;
          technologies?: string[];
          github_url?: string | null;
          demo_url?: string | null;
          featured?: boolean;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lead_notes: {
        Row: {
          id: string;
          lead_id: string;
          author_id: string;
          note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          author_id: string;
          note: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          author_id?: string;
          note?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      navigation_items: {
        Row: {
          id: string;
          label: string;
          href: string;
          location: Database["public"]["Enums"]["nav_location"];
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          label: string;
          href: string;
          location?: Database["public"]["Enums"]["nav_location"];
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          href?: string;
          location?: Database["public"]["Enums"]["nav_location"];
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          status: Database["public"]["Enums"]["subscriber_status"];
          source: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          status?: Database["public"]["Enums"]["subscriber_status"];
          source?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          status?: Database["public"]["Enums"]["subscriber_status"];
          source?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      process_steps: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short_description: string;
          description: string;
          icon: string;
          deliverables: string[];
          duration: string | null;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          short_description: string;
          description: string;
          icon?: string;
          deliverables?: string[];
          duration?: string | null;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          short_description?: string;
          description?: string;
          icon?: string;
          deliverables?: string[];
          duration?: string | null;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short_description: string;
          description: string;
          category: string;
          client_name: string | null;
          industry: string | null;
          cover_image_path: string | null;
          cover_image_alt: string | null;
          gallery: Json;
          technologies: string[];
          challenge: string | null;
          solution: string | null;
          implementation: string | null;
          results: string | null;
          metrics: Json;
          project_url: string | null;
          github_url: string | null;
          featured: boolean;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          short_description: string;
          description?: string;
          category?: string;
          client_name?: string | null;
          industry?: string | null;
          cover_image_path?: string | null;
          cover_image_alt?: string | null;
          gallery?: Json;
          technologies?: string[];
          challenge?: string | null;
          solution?: string | null;
          implementation?: string | null;
          results?: string | null;
          metrics?: Json;
          project_url?: string | null;
          github_url?: string | null;
          featured?: boolean;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          short_description?: string;
          description?: string;
          category?: string;
          client_name?: string | null;
          industry?: string | null;
          cover_image_path?: string | null;
          cover_image_alt?: string | null;
          gallery?: Json;
          technologies?: string[];
          challenge?: string | null;
          solution?: string | null;
          implementation?: string | null;
          results?: string | null;
          metrics?: Json;
          project_url?: string | null;
          github_url?: string | null;
          featured?: boolean;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string;
          overview: string;
          icon: string;
          cover_image_path: string | null;
          cover_image_alt: string | null;
          problems: Json;
          features: Json;
          technologies: string[];
          process: Json;
          outcomes: Json;
          faqs: Json;
          cta_title: string;
          cta_description: string;
          cta_label: string;
          cta_href: string;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary: string;
          overview?: string;
          icon?: string;
          cover_image_path?: string | null;
          cover_image_alt?: string | null;
          problems?: Json;
          features?: Json;
          technologies?: string[];
          process?: Json;
          outcomes?: Json;
          faqs?: Json;
          cta_title?: string;
          cta_description?: string;
          cta_label?: string;
          cta_href?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          summary?: string;
          overview?: string;
          icon?: string;
          cover_image_path?: string | null;
          cover_image_alt?: string | null;
          problems?: Json;
          features?: Json;
          technologies?: string[];
          process?: Json;
          outcomes?: Json;
          faqs?: Json;
          cta_title?: string;
          cta_description?: string;
          cta_label?: string;
          cta_href?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: boolean;
          site_name: string;
          hero_headline: string;
          hero_subheadline: string;
          hero_primary_cta_label: string;
          hero_primary_cta_href: string;
          hero_secondary_cta_label: string;
          hero_secondary_cta_href: string;
          seo_title: string | null;
          seo_description: string | null;
          studio_statement: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          contact_address: string | null;
          social_links: Json;
          footer_text: string | null;
          og_image_path: string | null;
          logo_path: string | null;
          favicon_path: string | null;
          analytics_id: string | null;
          final_cta_title: string;
          final_cta_description: string;
          final_cta_label: string;
          final_cta_href: string;
          updated_at: string;
        };
        Insert: {
          id?: boolean;
          site_name: string;
          hero_headline: string;
          hero_subheadline: string;
          hero_primary_cta_label: string;
          hero_primary_cta_href: string;
          hero_secondary_cta_label: string;
          hero_secondary_cta_href: string;
          seo_title?: string | null;
          seo_description?: string | null;
          studio_statement?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          contact_address?: string | null;
          social_links?: Json;
          footer_text?: string | null;
          og_image_path?: string | null;
          logo_path?: string | null;
          favicon_path?: string | null;
          analytics_id?: string | null;
          final_cta_title?: string;
          final_cta_description?: string;
          final_cta_label?: string;
          final_cta_href?: string;
          updated_at?: string;
        };
        Update: {
          id?: boolean;
          site_name?: string;
          hero_headline?: string;
          hero_subheadline?: string;
          hero_primary_cta_label?: string;
          hero_primary_cta_href?: string;
          hero_secondary_cta_label?: string;
          hero_secondary_cta_href?: string;
          seo_title?: string | null;
          seo_description?: string | null;
          studio_statement?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          contact_address?: string | null;
          social_links?: Json;
          footer_text?: string | null;
          og_image_path?: string | null;
          logo_path?: string | null;
          favicon_path?: string | null;
          analytics_id?: string | null;
          final_cta_title?: string;
          final_cta_description?: string;
          final_cta_label?: string;
          final_cta_href?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      team_members: {
        Row: {
          id: string;
          slug: string;
          name: string;
          role: string;
          bio: string;
          photo_path: string | null;
          photo_alt: string | null;
          skills: string[];
          social_links: Json;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          role: string;
          bio?: string;
          photo_path?: string | null;
          photo_alt?: string | null;
          skills?: string[];
          social_links?: Json;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          role?: string;
          bio?: string;
          photo_path?: string | null;
          photo_alt?: string | null;
          skills?: string[];
          social_links?: Json;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      technologies: {
        Row: {
          id: string;
          slug: string;
          name: string;
          category: Database["public"]["Enums"]["tech_category"];
          description: string | null;
          logo_path: string | null;
          logo_alt: string | null;
          website: string | null;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          category?: Database["public"]["Enums"]["tech_category"];
          description?: string | null;
          logo_path?: string | null;
          logo_alt?: string | null;
          website?: string | null;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          category?: Database["public"]["Enums"]["tech_category"];
          description?: string | null;
          logo_path?: string | null;
          logo_alt?: string | null;
          website?: string | null;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string | null;
          company: string | null;
          avatar_path: string | null;
          avatar_alt: string | null;
          testimonial: string;
          rating: number;
          featured: boolean;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role?: string | null;
          company?: string | null;
          avatar_path?: string | null;
          avatar_alt?: string | null;
          testimonial: string;
          rating?: number;
          featured?: boolean;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string | null;
          company?: string | null;
          avatar_path?: string | null;
          avatar_alt?: string | null;
          testimonial?: string;
          rating?: number;
          featured?: boolean;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: never;
        Returns: boolean;
      };
      is_valid_gallery: {
        Args: { items: Json; max_items: number };
        Returns: boolean;
      };
      is_valid_metrics: {
        Args: { items: Json; max_items: number };
        Returns: boolean;
      };
      is_owner: {
        Args: never;
        Returns: boolean;
      };
      is_valid_social_links: {
        Args: { items: Json; max_items: number };
        Returns: boolean;
      };
      is_valid_social_map: {
        Args: { map: Json };
        Returns: boolean;
      };
      is_valid_tags: {
        Args: { tags: string[]; max_items: number; max_length: number };
        Returns: boolean;
      };
      is_valid_text_pairs: {
        Args: {
          items: Json;
          first_key: string;
          second_key: string;
          max_items: number;
          first_min: number;
          first_max: number;
          second_min: number;
          second_max: number;
        };
        Returns: boolean;
      };
    };
    Enums: {
      admin_role: "owner" | "editor";
      content_status: "draft" | "published" | "archived";
      faq_page: "general" | "services" | "projects" | "innovation" | "blog" | "contact";
      innovation_category:
        | "ai"
        | "cybersecurity"
        | "web3"
        | "robotics"
        | "automation"
        | "developer-tools"
        | "experimental-interfaces"
        | "other";
      lab_stage: "research" | "prototype" | "building" | "testing" | "live" | "archived";
      lead_priority: "low" | "normal" | "high" | "urgent";
      lead_status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost" | "archived";
      nav_location: "header" | "footer";
      subscriber_status: "active" | "unsubscribed";
      tech_category:
        | "frontend"
        | "backend"
        | "ai"
        | "cloud"
        | "database"
        | "cybersecurity"
        | "devops"
        | "mobile"
        | "web3";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];
