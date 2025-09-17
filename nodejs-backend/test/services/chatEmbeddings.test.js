const assert = require("assert");
const app = require("../../src/app");

describe("chatEmbeddings service", () => {
  let thisService;
  let chatEmbeddingCreated;

  beforeEach(async () => {
    thisService = await app.service("chatEmbeddings");
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (chatEmbeddings)");
  });

  describe("#create", () => {
    const options = {"userId":"aasdfasdfasdfadsfadfa","conversationId":"aasdfasdfasdfadsfadfa","messageId":"aasdfasdfasdfadsfadfa","content":"new value","embedding":"new value"};

    beforeEach(async () => {
      chatEmbeddingCreated = await thisService.create(options);
    });

    it("should create a new chatEmbedding", () => {
      assert.strictEqual(chatEmbeddingCreated.userId, options.userId);
assert.strictEqual(chatEmbeddingCreated.conversationId, options.conversationId);
assert.strictEqual(chatEmbeddingCreated.messageId, options.messageId);
assert.strictEqual(chatEmbeddingCreated.content, options.content);
assert.strictEqual(chatEmbeddingCreated.embedding, options.embedding);
    });
  });

  describe("#get", () => {
    it("should retrieve a chatEmbedding by ID", async () => {
      const retrieved = await thisService.get(chatEmbeddingCreated._id);
      assert.strictEqual(retrieved._id, chatEmbeddingCreated._id);
    });
  });

  describe("#update", () => {
    let chatEmbeddingUpdated;
    const options = {"userId":"345345345345345345345","conversationId":"345345345345345345345","messageId":"345345345345345345345","content":"updated value","embedding":"updated value"};

    beforeEach(async () => {
      chatEmbeddingUpdated = await thisService.update(chatEmbeddingCreated._id, options);
    });

    it("should update an existing chatEmbedding ", async () => {
      assert.strictEqual(chatEmbeddingUpdated.userId, options.userId);
assert.strictEqual(chatEmbeddingUpdated.conversationId, options.conversationId);
assert.strictEqual(chatEmbeddingUpdated.messageId, options.messageId);
assert.strictEqual(chatEmbeddingUpdated.content, options.content);
assert.strictEqual(chatEmbeddingUpdated.embedding, options.embedding);
    });
  });

  describe("#delete", () => {
  let chatEmbeddingDeleted;
    beforeEach(async () => {
      chatEmbeddingDeleted = await thisService.remove(chatEmbeddingCreated._id);
    });

    it("should delete a chatEmbedding", async () => {
      assert.strictEqual(chatEmbeddingDeleted._id, chatEmbeddingCreated._id);
    });
  });
});