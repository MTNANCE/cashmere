migrate((app) => {
  const collection = new Collection({
    name: "portfolios",
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
        name: "description",
        type: "text",
        required: false,
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
      "CREATE INDEX idx_portfolios_user ON portfolios (user)",
    ],
  });

  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("portfolios");
  app.delete(collection);
});

