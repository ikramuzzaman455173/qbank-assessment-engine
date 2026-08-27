-- Migration: Add gemini_api_key column to public.user_preferences
-- Allows authenticated users to securely store and sync their own Google Gemini API key across devices.

ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS gemini_api_key TEXT;
