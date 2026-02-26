-- =============================================
-- PROFILES table (linked to auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  country TEXT DEFAULT 'Cameroun',
  phone TEXT,
  class_level TEXT DEFAULT '6e',
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'parent', 'teacher', 'admin')),
  goal TEXT,
  onboarding_done BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- POSTS table (forum per class)
-- =============================================
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_level TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 1000),
  author_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Users can only see posts from their own class
CREATE POLICY "posts_select_same_class" ON public.posts
  FOR SELECT USING (
    class_level = (SELECT class_level FROM public.profiles WHERE id = auth.uid())
  );

-- Users can only insert posts to their own class
CREATE POLICY "posts_insert_own_class" ON public.posts
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    class_level = (SELECT class_level FROM public.profiles WHERE id = auth.uid())
  );

-- Users can delete their own posts
CREATE POLICY "posts_delete_own" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- REPORTS table (flag forum posts)
-- =============================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT DEFAULT 'inappropriate',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, reporter_id)
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_insert_own" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "reports_select_own" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- =============================================
-- PROGRESS table (quiz scores etc.)
-- =============================================
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "progress_select_own" ON public.progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "progress_insert_own" ON public.progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "progress_update_own" ON public.progress FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- NOTES table (student grades)
-- =============================================
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  value NUMERIC DEFAULT 0,
  coefficient NUMERIC DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_select_own" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notes_insert_own" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_update_own" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notes_delete_own" ON public.notes FOR DELETE USING (auth.uid() = user_id);
