// Test ostatecznej poprawionej walidacji dat
const dateString = "2025-11-04";
const today = new Date();

// Poprawiona walidacja - porównanie stringów dat
const todayString = today.getFullYear() + '-' +
                  String(today.getMonth() + 1).padStart(2, '0') + '-' +
                  String(today.getDate()).padStart(2, '0');

console.log("dateString:", dateString);
console.log("todayString:", todayString);
console.log("dateString > todayString:", dateString > todayString);
console.log("dateString <= todayString:", dateString <= todayString);
