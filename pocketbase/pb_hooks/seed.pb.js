/// <reference path="../pb_data/types.d.ts" />

/**
 * Seed script for Cashmere Finance App
 * 
 * This hook provides a route to seed the database with demo data for testing.
 * Access via: POST /api/seed
 * 
 * WARNING: This will delete all existing data and create fresh demo data!
 */

// Register a custom route for seeding
routerAdd("POST", "/api/seed", (c) => {
  try {
    console.log("[Seed] Starting database seed...");

    // Clear existing data (in reverse order to respect foreign keys)
    try {
      const transactions = $app.findRecordsByFilter("transactions", "id != ''");
      transactions.forEach((record) => {
        $app.delete(record);
      });
      console.log("[Seed] Cleared transactions");
    } catch (e) {
      console.log("[Seed] No transactions to clear");
    }

    try {
      const accounts = $app.findRecordsByFilter("accounts", "id != ''");
      accounts.forEach((record) => {
        $app.delete(record);
      });
      console.log("[Seed] Cleared accounts");
    } catch (e) {
      console.log("[Seed] No accounts to clear");
    }

    try {
      const portfolios = $app.findRecordsByFilter("portfolios", "id != ''");
      portfolios.forEach((record) => {
        $app.delete(record);
      });
      console.log("[Seed] Cleared portfolios");
    } catch (e) {
      console.log("[Seed] No portfolios to clear");
    }

    // Create or get demo user
    let demoUser;
    try {
      demoUser = $app.findFirstRecordByFilter("users", "email = 'demo@cashmere.app'");
      console.log("[Seed] Found existing demo user");
    } catch (e) {
      const usersCollection = $app.findCollectionByNameOrId("users");
      const userRecord = new Record(usersCollection);
      userRecord.set("email", "demo@cashmere.app");
      userRecord.set("emailVisibility", true);
      userRecord.set("verified", true);
      userRecord.setPassword("demodemo");
      $app.save(userRecord);
      demoUser = userRecord;
      console.log("[Seed] Created demo user: demo@cashmere.app / demodemo");
    }

    const userId = demoUser.id;

    // Create portfolios
    const portfoliosCollection = $app.findCollectionByNameOrId("portfolios");
    
    const personalPortfolio = new Record(portfoliosCollection);
    personalPortfolio.set("name", "Personal");
    personalPortfolio.set("description", "Personal finances");
    personalPortfolio.set("user", userId);
    $app.save(personalPortfolio);
    console.log("[Seed] Created Personal portfolio");

    const businessPortfolio = new Record(portfoliosCollection);
    businessPortfolio.set("name", "Business");
    businessPortfolio.set("description", "Business finances");
    businessPortfolio.set("user", userId);
    $app.save(businessPortfolio);
    console.log("[Seed] Created Business portfolio");

    // Create accounts
    const accountsCollection = $app.findCollectionByNameOrId("accounts");
    
    const checkingAccount = new Record(accountsCollection);
    checkingAccount.set("name", "Main Checking");
    checkingAccount.set("type", "bank");
    checkingAccount.set("institution", "Chase Bank");
    checkingAccount.set("balance", 5240.50);
    checkingAccount.set("user", userId);
    checkingAccount.set("portfolio", personalPortfolio.id);
    $app.save(checkingAccount);
    console.log("[Seed] Created Checking account");

    const savingsAccount = new Record(accountsCollection);
    savingsAccount.set("name", "Emergency Fund");
    savingsAccount.set("type", "bank");
    savingsAccount.set("institution", "Ally Bank");
    savingsAccount.set("balance", 12500.00);
    savingsAccount.set("user", userId);
    savingsAccount.set("portfolio", personalPortfolio.id);
    $app.save(savingsAccount);
    console.log("[Seed] Created Savings account");

    const businessChecking = new Record(accountsCollection);
    businessChecking.set("name", "Business Checking");
    businessChecking.set("type", "bank");
    businessChecking.set("institution", "Wells Fargo");
    businessChecking.set("balance", 8300.75);
    businessChecking.set("user", userId);
    businessChecking.set("portfolio", businessPortfolio.id);
    $app.save(businessChecking);
    console.log("[Seed] Created Business Checking account");

    const creditCard = new Record(accountsCollection);
    creditCard.set("name", "Credit Card");
    creditCard.set("type", "credit");
    creditCard.set("institution", "American Express");
    creditCard.set("balance", -1250.30);
    creditCard.set("credit_limit", 10000);
    creditCard.set("available_credit", 8749.70);
    creditCard.set("user", userId);
    creditCard.set("portfolio", businessPortfolio.id);
    $app.save(creditCard);
    console.log("[Seed] Created Credit Card account");

    // Create transactions
    const transactionsCollection = $app.findCollectionByNameOrId("transactions");
    
    // Helper to create transaction
    const createTransaction = (accountRecord, amount, description, category, type, daysAgo) => {
      const transaction = new Record(transactionsCollection);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      transaction.set("account", accountRecord.id);
      transaction.set("amount", amount);
      transaction.set("description", description);
      transaction.set("category", category);
      transaction.set("type", type);
      transaction.set("date", date.toISOString().split('T')[0]);
      $app.save(transaction);
    };

    // Personal Checking transactions
    createTransaction(checkingAccount, 3500.00, "Monthly Salary", "Salary", "income", 2);
    createTransaction(checkingAccount, 89.99, "Grocery Shopping", "Groceries", "expense", 3);
    createTransaction(checkingAccount, 45.50, "Gas Station", "Transportation", "expense", 5);
    createTransaction(checkingAccount, 120.00, "Electric Bill", "Utilities", "expense", 7);
    createTransaction(checkingAccount, 65.00, "Internet Bill", "Utilities", "expense", 7);
    createTransaction(checkingAccount, 42.30, "Restaurant Dinner", "Dining", "expense", 10);
    createTransaction(checkingAccount, 15.99, "Netflix Subscription", "Entertainment", "expense", 12);
    createTransaction(checkingAccount, 95.50, "Grocery Shopping", "Groceries", "expense", 15);
    createTransaction(checkingAccount, 250.00, "Car Insurance", "Insurance", "expense", 18);
    createTransaction(checkingAccount, 55.75, "Dining Out", "Dining", "expense", 20);
    
    // Personal Savings transactions
    createTransaction(savingsAccount, 500.00, "Monthly Savings Transfer", "Savings", "income", 2);
    createTransaction(savingsAccount, 1000.00, "Bonus Deposit", "Bonus", "income", 35);
    createTransaction(savingsAccount, 200.00, "Interest Payment", "Interest", "income", 60);
    
    // Business Checking transactions
    createTransaction(businessChecking, 5000.00, "Client Payment - Project A", "Revenue", "income", 5);
    createTransaction(businessChecking, 2500.00, "Client Payment - Project B", "Revenue", "income", 15);
    createTransaction(businessChecking, 450.00, "Office Supplies", "Expenses", "expense", 8);
    createTransaction(businessChecking, 1200.00, "Software Subscriptions", "Software", "expense", 10);
    createTransaction(businessChecking, 3000.00, "Consulting Services", "Revenue", "income", 25);
    createTransaction(businessChecking, 850.00, "Marketing Campaign", "Marketing", "expense", 30);
    createTransaction(businessChecking, 600.00, "Office Rent", "Rent", "expense", 32);
    
    // Credit Card transactions
    createTransaction(creditCard, 125.50, "Office Equipment", "Equipment", "expense", 4);
    createTransaction(creditCard, 89.99, "Business Lunch", "Dining", "expense", 6);
    createTransaction(creditCard, 450.00, "Flight Tickets", "Travel", "expense", 12);
    createTransaction(creditCard, 220.00, "Hotel Stay", "Travel", "expense", 13);
    createTransaction(creditCard, 65.30, "Car Rental", "Travel", "expense", 14);
    createTransaction(creditCard, 299.51, "Professional Development Course", "Education", "expense", 20);
    
    console.log("[Seed] Created 35+ transactions");
    console.log("[Seed] Database seeded successfully!");

    return c.json(200, {
      success: true,
      message: "Database seeded successfully!",
      data: {
        user: "demo@cashmere.app",
        password: "demodemo",
        portfolios: 2,
        accounts: 4,
        transactions: "35+",
      },
    });
  } catch (error) {
    console.error("[Seed] Error seeding database:", error);
    return c.json(500, {
      success: false,
      error: error.message || "Failed to seed database",
    });
  }
});

console.log("[Seed Hook] Seed route registered at POST /api/seed");
