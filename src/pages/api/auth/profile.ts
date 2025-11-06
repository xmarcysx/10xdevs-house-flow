import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";
import { settingsSchema } from "../../../lib/validation/auth.validation";

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Brak dostępu" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Pobierz dane profilu z tabeli users
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("first_name, last_name, avatar_url")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return new Response(JSON.stringify({ error: "Nie udało się pobrać danych profilu" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        profile: {
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          avatarUrl: profile.avatar_url || undefined,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Profile GET error:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd serwera" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Brak dostępu" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parsuj FormData (ponieważ może zawierać plik)
    const formData = await request.formData();
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const avatarFile = formData.get("avatar");

    // Walidacja danych wejściowych
    const validationData = {
      firstName,
      lastName,
      avatar: avatarFile instanceof File ? avatarFile : null,
    };

    const validationResult = settingsSchema.safeParse(validationData);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: validationResult.error.issues[0].message,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let avatarUrl: string | null = null;

    // Jeśli przesłano plik awatara, upload do Supabase Storage
    if (avatarFile) {
      const fileName = `${user.id}/avatar-${Date.now()}.${avatarFile.name.split(".").pop()}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        return new Response(JSON.stringify({ error: "Nie udało się przesłać awatara" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Pobierz publiczny URL awatara
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);

      avatarUrl = urlData.publicUrl;
    }

    // Aktualizuj dane w tabeli users
    const updateData: any = {
      first_name: validationResult.data.firstName,
      last_name: validationResult.data.lastName,
    };

    if (avatarUrl) {
      updateData.avatar_url = avatarUrl;
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id)
      .select("first_name, last_name, avatar_url")
      .single();

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return new Response(JSON.stringify({ error: "Nie udało się zaktualizować profilu" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Aktualizuj metadane w Supabase Auth (jeśli zmieniono imię/nazwisko)
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        first_name: validationResult.data.firstName,
        last_name: validationResult.data.lastName,
      },
    });

    if (metadataError) {
      console.error("Error updating auth metadata:", metadataError);
      // Nie przerywamy - profil został zaktualizowany w bazie
    }

    return new Response(
      JSON.stringify({
        profile: {
          firstName: updatedProfile.first_name,
          lastName: updatedProfile.last_name,
          avatarUrl: updatedProfile.avatar_url,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Profile PUT error:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd serwera" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
