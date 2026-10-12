-- ==========================================
-- 007: Validasi pengajuan, link notifikasi, dan tipe notifikasi lengkap
-- Jalankan setelah 006_usulan_favorit_ratelimit.sql
-- ==========================================

-- --- 1. PENGAJUAN HANYA KE POSTINGAN YANG MASIH OPEN ---
-- Sebelumnya cek status hanya di UI; sekarang dijaga di database juga.
CREATE OR REPLACE FUNCTION public.prevent_join_on_closed_post()
RETURNS trigger AS $$
DECLARE
  v_status public.post_status;
BEGIN
  SELECT status INTO v_status FROM public.team_posts WHERE id = NEW.post_id;
  IF v_status IS DISTINCT FROM 'open' THEN
    RAISE EXCEPTION 'Postingan ini sudah tidak membuka pendaftaran';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_join_post_open
  BEFORE INSERT ON public.join_requests
  FOR EACH ROW EXECUTE FUNCTION public.prevent_join_on_closed_post();

-- --- 2. KOLOM LINK PADA NOTIFIKASI ---
-- Path tujuan saat notifikasi di-klik, dibuat di DB agar konsisten.
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS link varchar;

-- Perbarui trigger pengajuan baru: link ke halaman postingan (pemilik bisa
-- menerima/menolak dari dashboard, jadi link ke dashboard#pengajuan)
CREATE OR REPLACE FUNCTION public.notify_join_request_created()
RETURNS trigger AS $$
DECLARE
  v_owner uuid;
  v_judul text;
BEGIN
  SELECT owner_id, judul INTO v_owner, v_judul FROM public.team_posts WHERE id = NEW.post_id;
  INSERT INTO public.notifications (user_id, tipe, payload, link)
  VALUES (v_owner, 'pengajuan_baru', jsonb_build_object(
    'post_id', NEW.post_id,
    'request_id', NEW.id,
    'judul', v_judul
  ), '/dashboard#pengajuan');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Perbarui trigger keputusan pengajuan: pelamar diarahkan ke postingan
CREATE OR REPLACE FUNCTION public.notify_join_request_decided()
RETURNS trigger AS $$
DECLARE
  v_judul text;
  v_tipe text;
BEGIN
  IF NEW.status IN ('accepted', 'rejected') AND OLD.status IS DISTINCT FROM NEW.status THEN
    SELECT judul, tipe::text INTO v_judul, v_tipe FROM public.team_posts WHERE id = NEW.post_id;
    INSERT INTO public.notifications (user_id, tipe, payload, link)
    VALUES (
      NEW.user_id,
      CASE WHEN NEW.status = 'accepted' THEN 'pengajuan_diterima' ELSE 'pengajuan_ditolak' END,
      jsonb_build_object('post_id', NEW.post_id, 'request_id', NEW.id, 'judul', v_judul),
      CASE WHEN v_tipe = 'competition' THEN '/tim/' ELSE '/proyek/' END || NEW.post_id::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Perbarui trigger usulan lomba: admin diarahkan ke moderasi, pengusul ke lomba
CREATE OR REPLACE FUNCTION public.notify_competition_proposed()
RETURNS trigger AS $$
BEGIN
  IF NEW.publish_status = 'pending' THEN
    INSERT INTO public.notifications (user_id, tipe, payload, link)
    SELECT u.id, 'usulan_lomba_baru', jsonb_build_object(
      'competition_id', NEW.id,
      'judul', NEW.judul
    ), '/moderasi'
    FROM public.users u
    WHERE u.role IN ('admin', 'moderator');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.notify_competition_decided()
RETURNS trigger AS $$
BEGIN
  IF OLD.publish_status = 'pending' AND NEW.publish_status IN ('published', 'draft')
     AND NEW.created_by IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, tipe, payload, link)
    VALUES (
      NEW.created_by,
      CASE WHEN NEW.publish_status = 'published' THEN 'usulan_lomba_diterima' ELSE 'usulan_lomba_ditolak' END,
      jsonb_build_object('competition_id', NEW.id, 'judul', NEW.judul),
      '/lomba/' || NEW.id::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- 3. TANDAI DIBACA OTOMATIS: sudah ada policy UPDATE di 005 ---
-- Tidak perlu perubahan skema.
