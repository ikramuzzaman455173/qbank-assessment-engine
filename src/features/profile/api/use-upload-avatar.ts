import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/features/auth/hooks/use-session";
import { useUpdateProfile } from "./use-update-profile";

export function useUploadAvatar() {
  const { user } = useSession();
  const updateProfile = useUpdateProfile();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadAvatar = async (file: File) => {
    if (!user) throw new Error("Not authenticated");

    setIsUploading(true);
    setError(null);

    try {
      // 1. Validate file
      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB");
      }

      // 2. Upload to Supabase Storage
      const fileExt = file.name.split(".").pop() || "jpg";
      const filePath = `${user.id}/profile.${fileExt}`;

      // Upsert the file
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        if (uploadError.message?.toLowerCase().includes("bucket not found")) {
          throw new Error(
            "Supabase Storage bucket 'avatars' not found. Please create the 'avatars' public bucket in your Supabase Dashboard.",
          );
        }
        throw uploadError;
      }

      // 3. Get public URL with timestamp cache buster
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const finalUrl = `${publicUrl}?t=${Date.now()}`;

      // 4. Update Profile
      await updateProfile.mutateAsync({
        id: user.id,
        avatarUrl: finalUrl,
      });

      return finalUrl;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!user) throw new Error("Not authenticated");
    setIsUploading(true);
    setError(null);
    try {
      // Find files in user folder
      const { data: files, error: listError } = await supabase.storage
        .from("avatars")
        .list(user.id);

      if (listError) throw listError;

      if (files && files.length > 0) {
        const filePaths = files.map((f) => `${user.id}/${f.name}`);
        await supabase.storage.from("avatars").remove(filePaths);
      }

      await updateProfile.mutateAsync({
        id: user.id,
        avatarUrl: null,
      });
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadAvatar,
    removeAvatar,
    isUploading,
    error,
  };
}
