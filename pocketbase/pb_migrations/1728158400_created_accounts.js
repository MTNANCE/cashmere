migrate((app) => {
  const collection = new Collection({
    name: "accounts",
    type: "base",
    listRule: "@request.auth.id != '' && user = @request.auth.id",
    viewRule: "@request.auth.id != '' && user = @request.auth.id",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != '' && user = @request.auth.id",
    deleteRule: "@request.auth.id != '' && user = @request.auth.id",
    fields: [
      {
        name: "name",
        type: "text",
        required: true,
      },
      {
        name: "type",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ["bank", "credit"],
      },
      {
        name: "institution",
        type: "text",
        required: true,
      },
      {
        name: "balance",
        type: "number",
        required: true,
      },
      {
        name: "credit_limit",
        type: "number",
      },
      {
        name: "available_credit",
        type: "number",
      },
      {
        name: "user",
        type: "relation",
        required: true,
        collectionId: app.findCollectionByNameOrId("users").id,
        cascadeDelete: false,
        maxSelect: 1,
      },
    ],
    indexes: [
      "CREATE INDEX idx_accounts_user ON accounts (user)",
      "CREATE INDEX idx_accounts_type ON accounts (type)",
    ],
  });

  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("accounts");
  app.delete(collection);
});
