CREATE OR REPLACE FUNCTION update_goals_sort_order(
  updates JSONB
) RETURNS void AS $$
DECLARE
  item JSONB;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(updates)
  LOOP
    UPDATE goals
    SET sort_order = (item->>'sort_order')::int,
        updated_at = NOW()
    WHERE id = (item->>'id')::uuid
    AND user_id = auth.uid();
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;