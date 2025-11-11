globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as validateGetCategoriesQuery, c as sanitizeGetCategoriesQuery, C as CategoriesService, d as validateCreateCategoryCommand, e as sanitizeCreateCategoryCommand } from '../../chunks/categories.service_n7QOnMaA.mjs';
import { r as requireAuth } from '../../chunks/api-helpers_gexHC0qf.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_JyCnA0Wd.mjs';

const GET = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    const url = new URL(context.request.url);
    const queryParams = url.searchParams;
    const validation = validateGetCategoriesQuery(queryParams);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const query = sanitizeGetCategoriesQuery(queryParams);
    const categoriesService = new CategoriesService(context.locals.supabase);
    const result = await categoriesService.getCategories(user.id, query);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas pobierania kategorii:", error);
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania kategorii" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
const POST = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    let requestBody;
    try {
      requestBody = await context.request.json();
    } catch {
      return new Response(JSON.stringify({ message: "Nieprawidłowe dane JSON w żądaniu" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const validation = validateCreateCategoryCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const command = sanitizeCreateCategoryCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const categoriesService = new CategoriesService(context.locals.supabase);
    const category = await categoriesService.create(command, user.id);
    return new Response(JSON.stringify(category), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas tworzenia kategorii:", error);
    if (error instanceof Error) {
      if (error.message.includes("już istnieje")) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 422,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas tworzenia kategorii" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
