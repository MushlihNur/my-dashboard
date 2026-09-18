CREATE TABLE goal_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE NOT NULL,
  amount BIGINT NOT NULL CHECK (amount >= 0),
  note TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE goal_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own goal snapshots"
ON goal_snapshots FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = goal_snapshots.goal_id
    AND goals.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = goal_snapshots.goal_id
    AND goals.user_id = auth.uid()
  )
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.goal_snapshots TO authenticated;