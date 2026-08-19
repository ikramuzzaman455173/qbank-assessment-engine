import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the user from the auth token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Now instantiate a service role client to actually delete the user
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // First delete any files in the avatars bucket that belong to this user.
    // The bucket is 'avatars' and files are stored in `avatars/{user_id}/...`
    const { data: avatarFiles, error: listError } = await supabaseAdmin
      .storage
      .from("avatars")
      .list(user.id);

    if (!listError && avatarFiles && avatarFiles.length > 0) {
      const filesToRemove = avatarFiles.map((x: { name: string }) => `${user.id}/${x.name}`);
      await supabaseAdmin.storage.from("avatars").remove(filesToRemove);
    }

    // Note: Question Bank PDF/attachments deletion could also go here if needed,
    // but CASCADEs on the database handle the DB side. 
    // Ideally, a separate cron job or storage trigger cleans up orphaned files.

    // Finally, delete the user from auth.users (this cascades to profiles, user_preferences, question_banks, etc. if ON DELETE CASCADE is set)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      throw deleteError;
    }

    return new Response(
      JSON.stringify({ message: "User account deleted successfully." }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
