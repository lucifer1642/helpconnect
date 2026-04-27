-- ==========================================
-- MIGRATION: Fix Accept/Donate + Real-time Updates
-- Run this ONCE in Supabase SQL Editor
-- ==========================================

-- ============================================
-- PART 1: Auto-match trigger
-- When a donor accepts, auto-update the request status to 'matched'
-- Uses SECURITY DEFINER to bypass RLS (donor != request owner)
-- ============================================

CREATE OR REPLACE FUNCTION auto_match_on_accept()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'accepted' THEN
        UPDATE blood_requests
        SET status = 'matched',
            updated_at = NOW()
        WHERE id = NEW.request_id
          AND status IN ('pending', 'searching');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_auto_match_on_accept ON request_responses;

CREATE TRIGGER trigger_auto_match_on_accept
    AFTER INSERT ON request_responses
    FOR EACH ROW
    EXECUTE FUNCTION auto_match_on_accept();

-- ============================================
-- PART 2: Ensure 'discarded' is a valid status
-- (may already exist from earlier migration)
-- ============================================

ALTER TABLE blood_requests DROP CONSTRAINT IF EXISTS blood_requests_status_check;

ALTER TABLE blood_requests 
ADD CONSTRAINT blood_requests_status_check 
CHECK (status IN ('pending', 'searching', 'matched', 'fulfilled', 'cancelled', 'discarded'));

-- ============================================
-- PART 3: Ensure Realtime is enabled for all tables
-- This is what makes both sides auto-update
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'blood_requests') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE blood_requests;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'request_responses') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE request_responses;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'donors') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE donors;
  END IF;
END $$;

-- ============================================
-- PART 4: Enable REPLICA IDENTITY FULL for real-time
-- This ensures UPDATE/DELETE events include full row data
-- ============================================

ALTER TABLE blood_requests REPLICA IDENTITY FULL;
ALTER TABLE request_responses REPLICA IDENTITY FULL;
ALTER TABLE donors REPLICA IDENTITY FULL;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 'Migration complete! Auto-match trigger + Realtime enabled.' as status;
