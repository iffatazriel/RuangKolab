-- ==========================================
-- Row-Level Security (RLS) Policies
-- Run this FOURTH in Supabase SQL Editor
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;

-- --- USERS POLICIES ---
-- Public can read all users
CREATE POLICY "Users are viewable by everyone" ON public.users
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.users WHERE id = auth.uid()));

-- Users can insert only at auth trigger
CREATE POLICY "Disable user insert" ON public.users
  FOR INSERT WITH CHECK (false);

-- --- USER_CONTACTS POLICIES ---
-- Owner can read their own contacts
CREATE POLICY "Users can read own contacts" ON public.user_contacts
  FOR SELECT USING (auth.uid() = user_id);

-- Post owner can read accepted requester's contact
CREATE POLICY "Post owner can read accepted requester contact" ON public.user_contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.join_requests jr
      JOIN public.team_posts tp ON jr.post_id = tp.id
      WHERE jr.user_id = user_contacts.user_id
      AND tp.owner_id = auth.uid()
      AND jr.status = 'accepted'
    )
  );

-- Users can insert/update own contacts
CREATE POLICY "Users can insert own contact" ON public.user_contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contact" ON public.user_contacts
  FOR UPDATE USING (auth.uid() = user_id);

-- --- SKILLS POLICIES ---
-- Public can read all skills
CREATE POLICY "Skills are viewable by everyone" ON public.skills
  FOR SELECT USING (true);

-- --- USER_SKILLS POLICIES ---
-- Public can read user skills
CREATE POLICY "User skills are viewable" ON public.user_skills
  FOR SELECT USING (true);

-- Users can manage own skills
CREATE POLICY "Users can insert own skills" ON public.user_skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills" ON public.user_skills
  FOR DELETE USING (auth.uid() = user_id);

-- --- COMPETITIONS POLICIES ---
-- Public can read published/pending competitions
CREATE POLICY "Competitions viewable by status" ON public.competitions
  FOR SELECT USING (
    publish_status = 'published'
    OR (auth.uid() IS NOT NULL AND created_by = auth.uid())
    OR (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'moderator')))
  );

-- Admin/moderator can insert competitions
CREATE POLICY "Admin/moderator can create competitions" ON public.competitions
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'moderator'))
  );

-- Admin/moderator or creator can update
CREATE POLICY "Admin/moderator can update competitions" ON public.competitions
  FOR UPDATE USING (
    created_by = auth.uid()
    OR auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'moderator'))
  );

-- Admin/moderator can delete
CREATE POLICY "Admin/moderator can delete competitions" ON public.competitions
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'moderator'))
  );

-- --- TEAM_POSTS POLICIES ---
-- Public can read open/full posts
CREATE POLICY "Team posts viewable by everyone" ON public.team_posts
  FOR SELECT USING (status IN ('open', 'full') OR owner_id = auth.uid());

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts" ON public.team_posts
  FOR INSERT WITH CHECK (auth.uid() = owner_id AND auth.uid() IS NOT NULL);

-- Owner can update own posts
CREATE POLICY "Owner can update own post" ON public.team_posts
  FOR UPDATE USING (owner_id = auth.uid());

-- Owner can delete own posts
CREATE POLICY "Owner can delete own post" ON public.team_posts
  FOR DELETE USING (owner_id = auth.uid());

-- --- POST_SKILLS POLICIES ---
-- Public can read post skills
CREATE POLICY "Post skills are viewable" ON public.post_skills
  FOR SELECT USING (true);

-- Post owner can manage post skills
CREATE POLICY "Post owner can manage skills" ON public.post_skills
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.team_posts WHERE id = post_id AND owner_id = auth.uid())
  );

CREATE POLICY "Post owner can delete post skills" ON public.post_skills
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.team_posts WHERE id = post_id AND owner_id = auth.uid())
  );

-- --- JOIN_REQUESTS POLICIES ---
-- Users can read join requests they created or received
CREATE POLICY "Users can read join requests" ON public.join_requests
  FOR SELECT USING (
    user_id = auth.uid()
    OR post_id IN (SELECT id FROM public.team_posts WHERE owner_id = auth.uid())
  );

-- Authenticated users can create join requests
CREATE POLICY "Authenticated users can create join requests" ON public.join_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Owner can accept/reject, requester can cancel
CREATE POLICY "Owner can update request status" ON public.join_requests
  FOR UPDATE USING (
    post_id IN (SELECT id FROM public.team_posts WHERE owner_id = auth.uid())
    OR (user_id = auth.uid() AND status = 'pending')
  );

-- --- REPORTS POLICIES ---
-- Authenticated users can create reports
CREATE POLICY "Authenticated users can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Admin/moderator can read reports
CREATE POLICY "Admin/moderator can read reports" ON public.reports
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'moderator'))
  );

-- Admin/moderator can update report status
CREATE POLICY "Admin/moderator can update reports" ON public.reports
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'moderator'))
  );

-- --- CAMPUSES POLICIES ---
-- Public can read all campuses
CREATE POLICY "Campuses are viewable by everyone" ON public.campuses
  FOR SELECT USING (true);
