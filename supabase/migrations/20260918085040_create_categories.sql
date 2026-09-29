CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  color TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'all')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read categories"
ON categories FOR SELECT TO authenticated USING (true);

GRANT SELECT ON public.categories TO authenticated;

INSERT INTO categories (id, label, color, type) VALUES
  ('makan-minum', 'Makan Minum', '#F97316', 'expense'),
  ('transportasi', 'Transportasi', '#3B82F6', 'expense'),
  ('tempat-tinggal', 'Tempat Tinggal', '#A855F7', 'expense'),
  ('pribadi', 'Pribadi', '#EC4899', 'expense'),
  ('kasih-sayang', 'Kasih Sayang', '#EF4444', 'expense'),
  ('berbagi', 'Berbagi', '#22C55E', 'expense'),
  ('dana-darurat', 'Dana Darurat', '#EAB308', 'expense'),
  ('investasi', 'Investasi', '#14B8A6', 'expense'),
  ('salary', 'Salary', '#10B981', 'income'),
  ('other', 'Other', '#6B7280', 'all');