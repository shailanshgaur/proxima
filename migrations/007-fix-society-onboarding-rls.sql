-- Allow signed-in residents to choose their society during first-login onboarding.
-- Without this policy, RLS can hide all societies and block profile creation.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'societies'
      AND policyname = 'societies_select_authenticated'
  ) THEN
    CREATE POLICY "societies_select_authenticated"
    ON societies
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END $$;
