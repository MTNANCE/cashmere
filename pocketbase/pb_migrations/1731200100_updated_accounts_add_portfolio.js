migrate((app) => {
  const collection = app.findCollectionByNameOrId("accounts");

  // Add portfolio relation field
  collection.fields.addAt(7, new Field({
    name: "portfolio",
    type: "relation",
    required: true,
    collectionId: app.findCollectionByNameOrId("portfolios").id,
    cascadeDelete: false,
    maxSelect: 1,
  }));

  // Add index for portfolio
  collection.indexes = [
    "CREATE INDEX idx_accounts_user ON accounts (user)",
    "CREATE INDEX idx_accounts_type ON accounts (type)",
    "CREATE INDEX idx_accounts_portfolio ON accounts (portfolio)",
  ];

  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("accounts");
  
  // Remove portfolio field
  collection.fields.removeById(collection.fields.getByName("portfolio").id);
  
  // Restore original indexes
  collection.indexes = [
    "CREATE INDEX idx_accounts_user ON accounts (user)",
    "CREATE INDEX idx_accounts_type ON accounts (type)",
  ];

  app.save(collection);
});

