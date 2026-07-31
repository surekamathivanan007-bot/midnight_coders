/*
# Portfolio Builder CMS Schema

## Overview
Creates the full multi-tenant schema for a Portfolio Builder with lightweight CMS.
Each authenticated user owns one portfolio and all its content sections.
Admins (flagged via profiles.is_admin) can read all data for management.

## Tables
1. `profiles` — extends auth.users with display name, avatar, admin flag.
2. `portfolios` — one portfolio per user (slug, template, theme, published state, SEO meta).
3. `education` — education entries per portfolio.
4. `experience` — work experience entries per portfolio.
5. `skills` — skills with category and proficiency per portfolio.
6. `projects` — portfolio projects with images and links.
7. `blog_posts` — blog posts per portfolio.
8. `certificates` — certificates per portfolio.
9. `achievements` — achievements/awards per portfolio.
10. `contacts` — contact info (email, phone, location) per portfolio.
11. `social_links` — social media links per portfolio.
12. `resumes` — resume file metadata per portfolio.

## Security
- RLS enabled on every table.
- Owner-scoped CRUD for authenticated users (via portfolio ownership check).
- Public SELECT on published portfolios and their content (so anon visitors can view live portfolios).
- Admins can read all rows for management (is_admin check).
- Storage buckets: `avatars`, `portfolio-images`, `resumes` (public read, authenticated write to own folder).

## Notes
- Owner columns default to auth.uid() so client inserts omitting owner succeed.
- Child tables reference portfolios.id; ownership checked via EXISTS subquery.
- Published portfolios expose their content publicly via the `portfolios.is_published` flag.
- The profiles public-read policy is defined last, after portfolios exists.
*/

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

DROP POLICY IF EXISTS "profiles_insert_self" ON public.profiles;
CREATE POLICY "profiles_insert_self" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================
-- PORTFOLIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text NOT NULL,
  template text NOT NULL DEFAULT 'aurora',
  theme text NOT NULL DEFAULT 'dark',
  accent_color text NOT NULL DEFAULT '#6366f1',
  is_published boolean NOT NULL DEFAULT false,
  title text,
  tagline text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS portfolios_slug_unique ON public.portfolios (slug);

DROP POLICY IF EXISTS "portfolios_select_own_or_admin_or_published" ON public.portfolios;
CREATE POLICY "portfolios_select_own_or_admin_or_published" ON public.portfolios
  FOR SELECT TO anon, authenticated
  USING (
    is_published = true
    OR auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

DROP POLICY IF EXISTS "portfolios_insert_own" ON public.portfolios;
CREATE POLICY "portfolios_insert_own" ON public.portfolios
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "portfolios_update_own" ON public.portfolios;
CREATE POLICY "portfolios_update_own" ON public.portfolios
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "portfolios_delete_own" ON public.portfolios;
CREATE POLICY "portfolios_delete_own" ON public.portfolios
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- EDUCATION
-- ============================================================
CREATE TABLE IF NOT EXISTS public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  institution text NOT NULL,
  degree text,
  field text,
  start_date date,
  end_date date,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "education_select" ON public.education;
CREATE POLICY "education_select" ON public.education
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = education.portfolio_id AND (p.is_published = true OR p.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.id = auth.uid() AND pr.is_admin = true)))
  );

DROP POLICY IF EXISTS "education_insert" ON public.education;
CREATE POLICY "education_insert" ON public.education
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = education.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "education_update" ON public.education;
CREATE POLICY "education_update" ON public.education
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = education.portfolio_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = education.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "education_delete" ON public.education;
CREATE POLICY "education_delete" ON public.education
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = education.portfolio_id AND p.user_id = auth.uid()));

-- ============================================================
-- EXPERIENCE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  company text NOT NULL,
  role text NOT NULL,
  start_date date,
  end_date date,
  current boolean NOT NULL DEFAULT false,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "experience_select" ON public.experience;
CREATE POLICY "experience_select" ON public.experience
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = experience.portfolio_id AND (p.is_published = true OR p.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.id = auth.uid() AND pr.is_admin = true)))
  );

DROP POLICY IF EXISTS "experience_insert" ON public.experience;
CREATE POLICY "experience_insert" ON public.experience
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = experience.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "experience_update" ON public.experience;
CREATE POLICY "experience_update" ON public.experience
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = experience.portfolio_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = experience.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "experience_delete" ON public.experience;
CREATE POLICY "experience_delete" ON public.experience
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = experience.portfolio_id AND p.user_id = auth.uid()));

-- ============================================================
-- SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  proficiency int NOT NULL DEFAULT 80,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "skills_select" ON public.skills;
CREATE POLICY "skills_select" ON public.skills
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = skills.portfolio_id AND (p.is_published = true OR p.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.id = auth.uid() AND pr.is_admin = true)))
  );

DROP POLICY IF EXISTS "skills_insert" ON public.skills;
CREATE POLICY "skills_insert" ON public.skills
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = skills.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "skills_update" ON public.skills;
CREATE POLICY "skills_update" ON public.skills
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = skills.portfolio_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = skills.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "skills_delete" ON public.skills;
CREATE POLICY "skills_delete" ON public.skills
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = skills.portfolio_id AND p.user_id = auth.uid()));

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  project_url text,
  github_url text,
  tags text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_select" ON public.projects;
CREATE POLICY "projects_select" ON public.projects
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = projects.portfolio_id AND (p.is_published = true OR p.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.id = auth.uid() AND pr.is_admin = true)))
  );

DROP POLICY IF EXISTS "projects_insert" ON public.projects;
CREATE POLICY "projects_insert" ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = projects.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "projects_update" ON public.projects;
CREATE POLICY "projects_update" ON public.projects
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = projects.portfolio_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = projects.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "projects_delete" ON public.projects;
CREATE POLICY "projects_delete" ON public.projects
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = projects.portfolio_id AND p.user_id = auth.uid()));

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  excerpt text,
  content text,
  cover_image text,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_portfolio_slug_unique ON public.blog_posts (portfolio_id, slug);

DROP POLICY IF EXISTS "blog_posts_select" ON public.blog_posts;
CREATE POLICY "blog_posts_select" ON public.blog_posts
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = blog_posts.portfolio_id AND (p.is_published = true OR p.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.id = auth.uid() AND pr.is_admin = true)))
  );

DROP POLICY IF EXISTS "blog_posts_insert" ON public.blog_posts;
CREATE POLICY "blog_posts_insert" ON public.blog_posts
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = blog_posts.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "blog_posts_update" ON public.blog_posts;
CREATE POLICY "blog_posts_update" ON public.blog_posts
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = blog_posts.portfolio_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = blog_posts.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "blog_posts_delete" ON public.blog_posts;
CREATE POLICY "blog_posts_delete" ON public.blog_posts
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = blog_posts.portfolio_id AND p.user_id = auth.uid()));

-- ============================================================
-- CERTIFICATES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  title text NOT NULL,
  issuer text,
  issue_date date,
  expiry_date date,
  credential_url text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "certificates_select" ON public.certificates;
CREATE POLICY "certificates_select" ON public.certificates
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = certificates.portfolio_id AND (p.is_published = true OR p.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.id = auth.uid() AND pr.is_admin = true)))
  );

DROP POLICY IF EXISTS "certificates_insert" ON public.certificates;
CREATE POLICY "certificates_insert" ON public.certificates
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = certificates.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "certificates_update" ON public.certificates;
CREATE POLICY "certificates_update" ON public.certificates
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = certificates.portfolio_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = certificates.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "certificates_delete" ON public.certificates;
CREATE POLICY "certificates_delete" ON public.certificates
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = certificates.portfolio_id AND p.user_id = auth.uid()));

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  date date,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "achievements_select" ON public.achievements;
CREATE POLICY "achievements_select" ON public.achievements
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = achievements.portfolio_id AND (p.is_published = true OR p.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.id = auth.uid() AND pr.is_admin = true)))
  );

DROP POLICY IF EXISTS "achievements_insert" ON public.achievements;
CREATE POLICY "achievements_insert" ON public.achievements
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = achievements.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "achievements_update" ON public.achievements;
CREATE POLICY "achievements_update" ON public.achievements
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = achievements.portfolio_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = achievements.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "achievements_delete" ON public.achievements;
CREATE POLICY "achievements_delete" ON public.achievements
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = achievements.portfolio_id AND p.user_id = auth.uid()));

-- ============================================================
-- CONTACTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  email text,
  phone text,
  location text,
  website text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contacts_select" ON public.contacts;
CREATE POLICY "contacts_select" ON public.contacts
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = contacts.portfolio_id AND (p.is_published = true OR p.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.id = auth.uid() AND pr.is_admin = true)))
  );

DROP POLICY IF EXISTS "contacts_insert" ON public.contacts;
CREATE POLICY "contacts_insert" ON public.contacts
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = contacts.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "contacts_update" ON public.contacts;
CREATE POLICY "contacts_update" ON public.contacts
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = contacts.portfolio_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = contacts.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "contacts_delete" ON public.contacts;
CREATE POLICY "contacts_delete" ON public.contacts
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = contacts.portfolio_id AND p.user_id = auth.uid()));

-- ============================================================
-- SOCIAL LINKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  platform text NOT NULL,
  url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "social_links_select" ON public.social_links;
CREATE POLICY "social_links_select" ON public.social_links
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = social_links.portfolio_id AND (p.is_published = true OR p.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.id = auth.uid() AND pr.is_admin = true)))
  );

DROP POLICY IF EXISTS "social_links_insert" ON public.social_links;
CREATE POLICY "social_links_insert" ON public.social_links
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = social_links.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "social_links_update" ON public.social_links;
CREATE POLICY "social_links_update" ON public.social_links
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = social_links.portfolio_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = social_links.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "social_links_delete" ON public.social_links;
CREATE POLICY "social_links_delete" ON public.social_links
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = social_links.portfolio_id AND p.user_id = auth.uid()));

-- ============================================================
-- RESUMES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "resumes_select" ON public.resumes;
CREATE POLICY "resumes_select" ON public.resumes
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = resumes.portfolio_id AND (p.is_published = true OR p.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.id = auth.uid() AND pr.is_admin = true)))
  );

DROP POLICY IF EXISTS "resumes_insert" ON public.resumes;
CREATE POLICY "resumes_insert" ON public.resumes
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = resumes.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "resumes_update" ON public.resumes;
CREATE POLICY "resumes_update" ON public.resumes
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = resumes.portfolio_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = resumes.portfolio_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS "resumes_delete" ON public.resumes;
CREATE POLICY "resumes_delete" ON public.resumes
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = resumes.portfolio_id AND p.user_id = auth.uid()));

-- ============================================================
-- PROFILES PUBLIC READ (defined after portfolios exists)
-- ============================================================
DROP POLICY IF EXISTS "profiles_public_read_published" ON public.profiles;
CREATE POLICY "profiles_public_read_published" ON public.profiles
  FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1 FROM public.portfolios p WHERE p.user_id = profiles.id AND p.is_published = true
  ));

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_auth_insert" ON storage.objects;
CREATE POLICY "avatars_auth_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "avatars_auth_update" ON storage.objects;
CREATE POLICY "avatars_auth_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "avatars_auth_delete" ON storage.objects;
CREATE POLICY "avatars_auth_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "portfolio_images_public_read" ON storage.objects;
CREATE POLICY "portfolio_images_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "portfolio_images_auth_insert" ON storage.objects;
CREATE POLICY "portfolio_images_auth_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-images' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "portfolio_images_auth_update" ON storage.objects;
CREATE POLICY "portfolio_images_auth_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-images' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "portfolio_images_auth_delete" ON storage.objects;
CREATE POLICY "portfolio_images_auth_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-images' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "resumes_public_read" ON storage.objects;
CREATE POLICY "resumes_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'resumes');

DROP POLICY IF EXISTS "resumes_auth_insert" ON storage.objects;
CREATE POLICY "resumes_auth_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "resumes_auth_update" ON storage.objects;
CREATE POLICY "resumes_auth_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "resumes_auth_delete" ON storage.objects;
CREATE POLICY "resumes_auth_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS portfolios_updated_at ON public.portfolios;
CREATE TRIGGER portfolios_updated_at BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();