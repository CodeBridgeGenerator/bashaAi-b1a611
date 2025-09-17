const assert = require("assert");
const app = require("../../src/app");

describe("conversations service", () => {
  let thisService;
  let conversationCreated;

  beforeEach(async () => {
    thisService = await app.service("conversations");
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (conversations)");
  });

  describe("#create", () => {
    const options = {"title":"new value","userId":"aasdfasdfasdfadsfadfa"};

    beforeEach(async () => {
      conversationCreated = await thisService.create(options);
    });

    it("should create a new conversation", () => {
      assert.strictEqual(conversationCreated.title, options.title);
assert.strictEqual(conversationCreated.userId, options.userId);
    });
  });

  describe("#get", () => {
    it("should retrieve a conversation by ID", async () => {
      const retrieved = await thisService.get(conversationCreated._id);
      assert.strictEqual(retrieved._id, conversationCreated._id);
    });
  });

  describe("#update", () => {
    let conversationUpdated;
    const options = {"title":"updated value","userId":"345345345345345345345"};

    beforeEach(async () => {
      conversationUpdated = await thisService.update(conversationCreated._id, options);
    });

    it("should update an existing conversation ", async () => {
      assert.strictEqual(conversationUpdated.title, options.title);
assert.strictEqual(conversationUpdated.userId, options.userId);
    });
  });

  describe("#delete", () => {
  let conversationDeleted;
    beforeEach(async () => {
      conversationDeleted = await thisService.remove(conversationCreated._id);
    });

    it("should delete a conversation", async () => {
      assert.strictEqual(conversationDeleted._id, conversationCreated._id);
    });
  });
});