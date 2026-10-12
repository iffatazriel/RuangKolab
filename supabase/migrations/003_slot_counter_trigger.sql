-- ==========================================
-- Slot Counter Trigger & Business Logic
-- Run this THIRD in Supabase SQL Editor
-- ==========================================

-- Function to update slot counter when join request accepted
CREATE OR REPLACE FUNCTION public.handle_join_request_accepted()
RETURNS trigger AS $$
BEGIN
  -- Only proceed if status changed to 'accepted'
  IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status != 'accepted') THEN
    -- Increment slot_terisi
    UPDATE public.team_posts
    SET slot_terisi = slot_terisi + 1
    WHERE id = NEW.post_id;
    
    -- Check if post should be marked as full
    UPDATE public.team_posts
    SET status = 'full'
    WHERE id = NEW.post_id
      AND slot_terisi >= slot_total
      AND status = 'open';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on join_requests update
CREATE TRIGGER on_join_request_status_change
  AFTER INSERT OR UPDATE OF status ON public.join_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_join_request_accepted();

-- Function to prevent owner from joining their own post
CREATE OR REPLACE FUNCTION public.prevent_self_join()
RETURNS trigger AS $$
DECLARE
  post_owner_id uuid;
BEGIN
  SELECT owner_id INTO post_owner_id FROM public.team_posts WHERE id = NEW.post_id;
  
  IF post_owner_id = NEW.user_id THEN
    RAISE EXCEPTION 'Cannot join your own post';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to prevent self-join
CREATE TRIGGER check_self_join
  BEFORE INSERT ON public.join_requests
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_join();
