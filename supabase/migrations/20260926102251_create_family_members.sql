CREATE TABLE family_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relation TEXT NOT NULL,
  nik TEXT,
  birth_place TEXT,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female')),
  phone TEXT,
  address TEXT,
  blood_type TEXT CHECK (blood_type IN ('A', 'B', 'AB', 'O')),
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own family members"
ON family_members FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_members TO authenticated;