-- ==========================================
-- 005: Perbaikan RLS, notifikasi in-app, kolom proyek
-- Jalankan setelah 004_rls_policies.sql
-- ==========================================

-- --- 1. PELAMAR YANG DITERIMA BOLEH MEMBACA KONTAK PEMILIK POST (F-24) ---
-- Sebelumnya hanya pemilik yang bisa membaca kontak pelamar, sehingga
-- pelamar tidak pernah melihat WhatsApp pemilik.
CREATE POLICY "Accepted applicant can read post owner contact" ON public.user_contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.join_requests jr
      JOIN public.team_posts tp ON tp.id = jr.post_id
      WHERE jr.user_id = auth.uid()
        AND jr.status = 'accepted'
        AND tp.owner_id = user_contacts.user_id
    )
  );

-- --- 2. PELAMAR BISA MEMBATALKAN PENGAJUAN PENDING (F-27) ---
-- Policy UPDATE lama tidak punya WITH CHECK, sehingga perubahan ke 'cancelled'
-- oleh pelamar gagal. Dipisah menjadi dua policy yang jelas.
DROP POLICY IF EXISTS "Owner can update request status" ON public.join_requests;

CREATE POLICY "Owner can accept or reject requests" ON public.join_requests
  FOR UPDATE
  USING (post_id IN (SELECT id FROM public.team_posts WHERE owner_id = auth.uid()))
  WITH CHECK (status IN ('accepted', 'rejected', 'pending'));

CREATE POLICY "Applicant can cancel own pending request" ON public.join_requests
  FOR UPDATE
  USING (user_id = auth.uid() AND status = 'pending')
  WITH CHECK (user_id = auth.uid() AND status = 'cancelled');

-- --- 3. MODERATOR/ADMIN BISA MENGHAPUS POSTINGAN LAPORAN (F-41, F-45) ---
CREATE POLICY "Admin/moderator can delete any post" ON public.team_posts
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'moderator'))
  );

-- --- 4. PENGUNJUNG HANYA MELIHAT POST open/full, PEMILIK & MODERATOR JUGA BISA
-- melihat post 'closed' miliknya (sudah ada di 004) ---

-- --- 5. KOLOM PROYEK (F-30): komitmen waktu & tautan repo ---
ALTER TABLE public.team_posts ADD COLUMN IF NOT EXISTS komitmen varchar;
ALTER TABLE public.team_posts ADD COLUMN IF NOT EXISTS repo_url varchar;

-- --- 6. NOTIFIKASI IN-APP (F-42) ---
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tipe varchar NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  dibaca boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON public.notifications(user_id, dibaca, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Pengguna hanya boleh menandai notifikasinya sendiri sebagai dibaca.
CREATE POLICY "Users mark own notifications read" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert hanya lewat trigger SECURITY DEFINER (tidak ada policy INSERT untuk klien).

-- Pengajuan baru -> notifikasi ke pemilik postingan
CREATE OR REPLACE FUNCTION public.notify_join_request_created()
RETURNS trigger AS $$
DECLARE
  v_owner uuid;
  v_judul text;
BEGIN
  SELECT owner_id, judul INTO v_owner, v_judul FROM public.team_posts WHERE id = NEW.post_id;
  INSERT INTO public.notifications (user_id, tipe, payload)
  VALUES (v_owner, 'pengajuan_baru', jsonb_build_object(
    'post_id', NEW.post_id,
    'request_id', NEW.id,
    'judul', v_judul
  ));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_join_request_created
  AFTER INSERT ON public.join_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_join_request_created();

-- Diterima/ditolak -> notifikasi ke pelamar
CREATE OR REPLACE FUNCTION public.notify_join_request_decided()
RETURNS trigger AS $$
BEGIN
  IF NEW.status IN ('accepted', 'rejected') AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, tipe, payload)
    VALUES (NEW.user_id, CASE WHEN NEW.status = 'accepted' THEN 'pengajuan_diterima' ELSE 'pengajuan_ditolak' END,
      jsonb_build_object(
        'post_id', NEW.post_id,
        'request_id', NEW.id,
        'judul', (SELECT judul FROM public.team_posts WHERE id = NEW.post_id)
      ));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_join_request_decided
  AFTER UPDATE OF status ON public.join_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_join_request_decided();
