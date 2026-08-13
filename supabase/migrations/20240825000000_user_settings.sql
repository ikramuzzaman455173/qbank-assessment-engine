-- 1. Alter public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create public.user_preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    theme TEXT DEFAULT 'system',
    default_test_question_count INTEGER DEFAULT 20,
    default_test_timer INTEGER,
    randomize_questions BOOLEAN DEFAULT true,
    randomize_options BOOLEAN DEFAULT false,
    default_practice_question_count INTEGER DEFAULT 10,
    immediate_feedback BOOLEAN DEFAULT true,
    show_explanations BOOLEAN DEFAULT true,
    notification_preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS for user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
    ON public.user_preferences FOR SELECT
    USING ( auth.uid() = id );

CREATE POLICY "Users can insert their own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own preferences"
    ON public.user_preferences FOR UPDATE
    USING ( auth.uid() = id );

CREATE POLICY "Users can delete their own preferences"
    ON public.user_preferences FOR DELETE
    USING ( auth.uid() = id );

-- TRIGGER FOR UPDATED_AT on user_preferences
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Update the handle_new_user trigger to populate both tables
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name, display_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'avatar_url'
  );

  -- Insert into user_preferences
  INSERT INTO public.user_preferences (id)
  VALUES (new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
