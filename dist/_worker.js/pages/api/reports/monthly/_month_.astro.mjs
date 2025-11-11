globalThis.process ??= {}; globalThis.process.env ??= {};
import { R as ReportsService } from '../../../../chunks/reports.service_B1ycDDhS.mjs';
import { r as requireAuth } from '../../../../chunks/api-helpers_gexHC0qf.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_JyCnA0Wd.mjs';

function validateMonthParameter(month) {
  const errors = [];
  if (typeof month !== "string") {
    errors.push("Parametr month musi być tekstem");
    return { isValid: false, errors };
  }
  const trimmedMonth = month.trim();
  if (trimmedMonth.length === 0) {
    errors.push("Parametr month nie może być pusty");
    return { isValid: false, errors };
  }
  const monthRegex = /^\d{4}-\d{2}$/;
  if (!monthRegex.test(trimmedMonth)) {
    errors.push("Parametr month musi być w formacie YYYY-MM (np. 2024-01)");
    return { isValid: false, errors };
  }
  const [yearStr, monthStr] = trimmedMonth.split("-");
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);
  if (year < 2e3 || year > 2100) {
    errors.push("Rok musi być w zakresie 2000-2100");
  }
  if (monthNum < 1 || monthNum > 12) {
    errors.push("Miesiąc musi być w zakresie 1-12");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
function sanitizeMonthParameter(month) {
  const validation = validateMonthParameter(month);
  if (!validation.isValid) {
    return null;
  }
  return month.trim();
}

const GET = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    const { month } = context.params;
    if (!month) {
      return new Response(JSON.stringify({ message: "Parametr month jest wymagany" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const validation = validateMonthParameter(month);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const sanitizedMonth = sanitizeMonthParameter(month);
    if (!sanitizedMonth) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania parametru month" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const reportsService = new ReportsService(context.locals.supabase);
    const report = await reportsService.getMonthlyReport(user.id, sanitizedMonth);
    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas pobierania miesięcznego raportu:", error);
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania miesięcznego raportu" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
