CREATE TABLE public.lesson_overrides (
  key TEXT PRIMARY KEY,
  language TEXT NOT NULL,
  lesson_num INTEGER NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  title_override TEXT,
  content_override TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lesson_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read lesson overrides"
  ON public.lesson_overrides FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert lesson overrides"
  ON public.lesson_overrides FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update lesson overrides"
  ON public.lesson_overrides FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete lesson overrides"
  ON public.lesson_overrides FOR DELETE
  TO authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.update_lesson_overrides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_lesson_overrides_updated_at
  BEFORE UPDATE ON public.lesson_overrides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lesson_overrides_updated_at();
