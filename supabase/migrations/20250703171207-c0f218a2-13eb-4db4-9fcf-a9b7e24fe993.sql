
-- Create a table for AI nurse chat history
CREATE TABLE public.ai_nurse_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  response_audio_url TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_synced BOOLEAN NOT NULL DEFAULT true
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.ai_nurse_chats ENABLE ROW LEVEL SECURITY;

-- Users can view their own chat history
CREATE POLICY "Users can view their own ai nurse chats" 
  ON public.ai_nurse_chats 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own chat entries
CREATE POLICY "Users can create their own ai nurse chats" 
  ON public.ai_nurse_chats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own chat entries (for syncing)
CREATE POLICY "Users can update their own ai nurse chats" 
  ON public.ai_nurse_chats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own chat entries
CREATE POLICY "Users can delete their own ai nurse chats" 
  ON public.ai_nurse_chats 
  FOR DELETE 
  USING (auth.uid() = user_id);
