-- ==========================================
-- RUANGKOLAB Initial Schema
-- Run this FIRST in Supabase SQL Editor
-- ==========================================

-- --- ENUMERATIONS ---
CREATE TYPE public.user_role AS ENUM ('student', 'moderator', 'admin');
CREATE TYPE public.post_type AS ENUM ('competition', 'project');
CREATE TYPE public.post_status AS ENUM ('open', 'full', 'closed');
CREATE TYPE public.request_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');
CREATE TYPE public.publish_status AS ENUM ('draft', 'pending', 'published');
CREATE TYPE public.report_target AS ENUM ('user', 'post', 'competition');
CREATE TYPE public.report_status AS ENUM ('pending', 'reviewed', 'resolved');

-- --- TABEL INTI ---

-- Campuses
CREATE TABLE public.campuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama varchar NOT NULL,
  kota varchar NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Users (id MUST match auth.users.id)
CREATE TABLE public.users (
  id uuid PRIMARY KEY,
  nama varchar NOT NULL,
  campus_id uuid NOT NULL REFERENCES public.campuses(id) ON DELETE RESTRICT,
  jurusan varchar,
  angkatan integer,
  bio text,
  portofolio_url varchar,
  role public.user_role NOT NULL DEFAULT 'student',
  created_at timestamptz DEFAULT now()
);

-- User contacts (separated for privacy)
CREATE TABLE public.user_contacts (
  user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  whatsapp varchar NOT NULL
);

-- Skills
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama varchar UNIQUE NOT NULL
);

-- User skills (many-to-many)
CREATE TABLE public.user_skills (
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES public.skills(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, skill_id)
);

-- Competitions
CREATE TABLE public.competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id uuid REFERENCES public.campuses(id),
  created_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  judul varchar NOT NULL,
  penyelenggara varchar,
  kategori varchar,
  tingkat varchar,
  deadline timestamptz NOT NULL,
  biaya integer NOT NULL DEFAULT 0,
  url varchar NOT NULL,
  poster_url varchar,
  deskripsi text,
  publish_status public.publish_status NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_competitions_deadline ON public.competitions(deadline);
CREATE INDEX idx_competitions_publish_deadline ON public.competitions(publish_status, deadline);
ALTER TABLE public.competitions ADD CONSTRAINT competitions_biaya_nonneg CHECK (biaya >= 0);

-- Team posts
CREATE TABLE public.team_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  competition_id uuid REFERENCES public.competitions(id) ON DELETE RESTRICT,
  tipe public.post_type NOT NULL,
  judul varchar NOT NULL,
  deskripsi text NOT NULL,
  slot_total integer NOT NULL,
  slot_terisi integer NOT NULL DEFAULT 0,
  status public.post_status NOT NULL DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_team_posts_status_created ON public.team_posts(status, created_at);
CREATE INDEX idx_team_posts_competition ON public.team_posts(competition_id);
CREATE INDEX idx_team_posts_owner ON public.team_posts(owner_id);
ALTER TABLE public.team_posts ADD CONSTRAINT team_posts_slot_total_positive CHECK (slot_total > 0);
ALTER TABLE public.team_posts ADD CONSTRAINT team_posts_slot_terisi_valid CHECK (slot_terisi >= 0 AND slot_terisi <= slot_total);
ALTER TABLE public.team_posts ADD CONSTRAINT team_posts_tipe_matches_competition CHECK (
  (tipe = 'competition' AND competition_id IS NOT NULL) OR
  (tipe = 'project' AND competition_id IS NULL)
);

-- Post skills (many-to-many)
CREATE TABLE public.post_skills (
  post_id uuid REFERENCES public.team_posts(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES public.skills(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, skill_id)
);

-- Join requests
CREATE TABLE public.join_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.team_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pesan text,
  status public.request_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX join_requests_one_per_user_per_post ON public.join_requests(post_id, user_id);
CREATE INDEX idx_join_requests_post ON public.join_requests(post_id);
CREATE INDEX idx_join_requests_user ON public.join_requests(user_id);

-- Reports
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  target_type public.report_target NOT NULL,
  target_id uuid NOT NULL,
  alasan text NOT NULL,
  status public.report_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_reports_status_created ON public.reports(status, created_at);

-- --- SEED DATA ---

-- Insert UMP campus
INSERT INTO public.campuses (id, nama, kota) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Universitas Muhammadiyah Purwokerto', 'Purwokerto');

-- Insert skills
INSERT INTO public.skills (nama) VALUES
  ('Kepenulisan Ilmiah'),
  ('Metodologi Penelitian'),
  ('Analisis Data'),
  ('Manajemen Referensi'),
  ('Tinjauan Pustaka'),
  ('Penyusunan Esai'),
  ('Pengembangan Web/Aplikasi'),
  ('UI/UX Design'),
  ('Internet of Things'),
  ('Kecerdasan Buatan & ML'),
  ('Rekayasa Perangkat Medis'),
  ('Analisis Laboratorium Medis'),
  ('Business Model Canvas'),
  ('Riset & Validasi Pasar'),
  ('Perencanaan Keuangan'),
  ('Strategi Promosi Kreatif'),
  ('Analisis Risiko Bisnis'),
  ('Manajemen Rantai Pasok'),
  ('Desain Komunikasi Visual'),
  ('Desain Grafis'),
  ('Editing Video & Animasi'),
  ('Copywriting & Content Creation'),
  ('Fotografi & Videografi'),
  ('Storyboarding'),
  ('Public Speaking & Pitching'),
  ('Kemampuan Bahasa Asing'),
  ('Manajemen Proyek'),
  ('Penyusunan Proposal Pitch Deck'),
  ('Negosiasi & Networking');
