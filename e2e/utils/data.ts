/**
 * Test data for E2E tests
 */

export const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  },
  newUser: {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    name: 'New Test User',
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpass',
  },
};

export const testExpenses = {
  food: {
    amount: 45.50,
    description: 'Lunch at restaurant',
    category: 'Food',
  },
  transport: {
    amount: 15.00,
    description: 'Bus ticket',
    category: 'Transport',
  },
  entertainment: {
    amount: 120.00,
    description: 'Movie tickets',
    category: 'Entertainment',
  },
  utilities: {
    amount: 250.00,
    description: 'Electricity bill',
    category: 'Utilities',
  },
};

export const testIncomes = {
  salary: {
    amount: 3500.00,
    description: 'Monthly salary',
    date: new Date().toISOString().split('T')[0], // Today's date
  },
  freelance: {
    amount: 800.00,
    description: 'Freelance project',
    date: new Date().toISOString().split('T')[0],
  },
};

export const testGoals = {
  vacation: {
    name: 'Summer Vacation',
    targetAmount: 2000,
    description: 'Trip to the mountains',
  },
  emergency: {
    name: 'Emergency Fund',
    targetAmount: 5000,
    description: '6 months of expenses',
  },
  car: {
    name: 'New Car',
    targetAmount: 15000,
    description: 'Down payment for new car',
  },
};

export const testCategories = [
  'Food',
  'Transport',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Clothing',
  'Other',
];

// Helper function to generate random test data
export function generateRandomExpense() {
  const categories = Object.keys(testExpenses);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const baseExpense = testExpenses[randomCategory as keyof typeof testExpenses];

  return {
    ...baseExpense,
    amount: Math.round((Math.random() * 200 + 10) * 100) / 100, // Random amount between 10-210
    description: `${baseExpense.description} ${Date.now()}`, // Make unique
  };
}

export function generateRandomIncome() {
  const incomes = Object.values(testIncomes);
  const randomIncome = incomes[Math.floor(Math.random() * incomes.length)];

  return {
    ...randomIncome,
    amount: Math.round((Math.random() * 1000 + 500) * 100) / 100, // Random amount between 500-1500
    description: `${randomIncome.description} ${Date.now()}`, // Make unique
  };
}
