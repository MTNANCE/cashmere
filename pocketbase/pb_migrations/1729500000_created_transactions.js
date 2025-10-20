migrate((app) => {
  const collection = new Collection({
    name: "transactions",
    type: "base",
    listRule: "@request.auth.id != '' && account.user = @request.auth.id",
    viewRule: "@request.auth.id != '' && account.user = @request.auth.id",
    createRule: "@request.auth.id != '' && account.user = @request.auth.id",
    updateRule: "@request.auth.id != '' && account.user = @request.auth.id",
    deleteRule: "@request.auth.id != '' && account.user = @request.auth.id",
    fields: [
      {
        name: "account",
        type: "relation",
        required: true,
        collectionId: app.findCollectionByNameOrId("accounts").id,
        cascadeDelete: true,
        maxSelect: 1,
      },
      {
        name: "amount",
        type: "number",
        required: true,
      },
      {
        name: "description",
        type: "text",
        required: true,
      },
      {
        name: "category",
        type: "text",
        required: false,
      },
      {
        name: "date",
        type: "date",
        required: true,
      },
      {
        name: "type",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ["income", "expense"],
      },
    ],
    indexes: [
      "CREATE INDEX idx_transactions_account ON transactions (account)",
      "CREATE INDEX idx_transactions_date ON transactions (date)",
      "CREATE INDEX idx_transactions_type ON transactions (type)",
      "CREATE INDEX idx_transactions_category ON transactions (category)",
    ],
  });

  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("transactions");
  app.delete(collection);
});

