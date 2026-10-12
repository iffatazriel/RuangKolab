-- ==========================================
-- 006: Usulan lomba (F-15), favorit lomba (F-16), rate limit (PRD keputusan #2)
-- Jalankan setelah 005_fixes_notifications_project_fields.sql
-- ==========================================

-- --- 1. USULAN LOMBA OLEH PENGGUNA (F-15) ---
-- Pengguna biasa boleh mengusulkan lomba, tapi hanya dengan status 'pending'
-- dan atas nama dirinya sendiri. Admin/moderator tetap bisa insert langsung.
CREATE POLICY "Users can propose competitions" ON public.competitions
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND created_by = auth.uid()
    AND publish_status = 'pending'
  );

-- Pengusul bisa melihat usulannya sendiri (sudah tercakup policy SELECT 004).
-- Pengusul boleh memperbaiki usulannya selama masih pending, tapi tidak bisa
-- menaikkan statusnya sendiri menjadi 'published'.
CREATE POLICY "Proposer can edit own pending proposal" ON public.competitions
  FOR UPDATE USING (created_by = auth.uid() AND publish_status = 'pending')
  WITH CHECK (created_by = auth.uid() AND publish_status = 'pending');

-- Notifikasi ke admin/moderator saat ada usulan baru
CREATE OR REPLACE FUNCTION public.notify_competition_proposed()
RETURNS trigger AS $$
BEGIN
  IF NEW.publish_status = 'pending' THEN
    INSERT INTO public.notifications (user_id, tipe, payload)
    SELECT u.id, 'usulan_lomba_baru', jsonb_build_object(
      'competition_id', NEW.id,
      'judul', NEW.judul
    )
    FROM public.users u
    WHERE u.role IN ('admin', 'moderator');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_competition_proposed
  AFTER INSERT ON public.competitions
  FOR EACH ROW EXECUTE FUNCTION public.notify_competition_proposed();

-- Notifikasi ke pengusul saat usulannya diterbitkan atau ditolak (draft)
CREATE OR REPLACE FUNCTION public.notify_competition_decided()
RETURNS trigger AS $$
BEGIN
  IF OLD.publish_status = 'pending' AND NEW.publish_status IN ('published', 'draft')
     AND NEW.created_by IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, tipe, payload)
    VALUES (NEW.created_by,
      CASE WHEN NEW.publish_status = 'published' THEN 'usulan_lomba_diterima' ELSE 'usulan_lomba_ditolak' END,
      jsonb_build_object('competition_id', NEW.id, 'judul', NEW.judul));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_competition_decided
  AFTER UPDATE OF publish_status ON public.competitions
  FOR EACH ROW EXECUTE FUNCTION public.notify_competition_decided();

-- --- 2. FAVORIT / MINAT SAYA (F-16) ---
CREATE TABLE IF NOT EXISTS public.competition_favorites (
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, competition_id)
);

ALTER TABLE public.competition_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own favorites" ON public.competition_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users add own favorites" ON public.competition_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users remove own favorites" ON public.competition_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- --- 3. RATE LIMIT (PRD keputusan #2 & risiko spam) ---
-- Maksimal 5 postingan (team_posts) dan 10 pengajuan (join_requests) per 24 jam per user.
CREATE OR REPLACE FUNCTION public.enforce_post_rate_limit()
RETURNS trigger AS $$
BEGIN
  IF (SELECT count(*) FROM public.team_posts
      WHERE owner_id = NEW.owner_id AND created_at > now() - interval '24 hours') >= 5 THEN
    RAISE EXCEPTION 'Batas 5 postingan per 24 jam tercapai. Coba lagi nanti.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_post_rate_limit
  BEFORE INSERT ON public.team_posts
  FOR EACH ROW EXECUTE FUNCTION public.enforce_post_rate_limit();

CREATE OR REPLACE FUNCTION public.enforce_request_rate_limit()
RETURNS trigger AS $$
BEGIN
  IF (SELECT count(*) FROM public.join_requests
      WHERE user_id = NEW.user_id AND created_at > now() - interval '24 hours') >= 10 THEN
    RAISE EXCEPTION 'Batas 10 pengajuan per 24 jam tercapai. Coba lagi nanti.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_request_rate_limit
  BEFORE INSERT ON public.join_requests
  FOR EACH ROW EXECUTE FUNCTION public.enforce_request_rate_limit();
