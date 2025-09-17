const assert = require("assert");
const app = require("../../src/app");

describe("messages service", () => {
  let thisService;
  let messageCreated;

  beforeEach(async () => {
    thisService = await app.service("messages");
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (messages)");
  });

  describe("#create", () => {
    const options = {"conversationId":"aasdfasdfasdfadsfadfa","role":"new value","content":"new value","sources":"new value"};

    beforeEach(async () => {
      messageCreated = await thisService.create(options);
    });

    it("should create a new message", () => {
      assert.strictEqual(messageCreated.conversationId, options.conversationId);
assert.strictEqual(messageCreated.role, options.role);
assert.strictEqual(messageCreated.content, options.content);
assert.strictEqual(messageCreated.sources, options.sources);
    });
  });

  describe("#get", () => {
    it("should retrieve a message by ID", async () => {
      const retrieved = await thisService.get(messageCreated._id);
      assert.strictEqual(retrieved._id, messageCreated._id);
    });
  });

  describe("#update", () => {
    let messageUpdated;
    const options = {"conversationId":"345345345345345345345","role":"updated value","content":"updated value","sources":"updated value"};

    beforeEach(async () => {
      messageUpdated = await thisService.update(messageCreated._id, options);
    });

    it("should update an existing message ", async () => {
      assert.strictEqual(messageUpdated.conversationId, options.conversationId);
assert.strictEqual(messageUpdated.role, options.role);
assert.strictEqual(messageUpdated.content, options.content);
assert.strictEqual(messageUpdated.sources, options.sources);
    });
  });

  describe("#delete", () => {
  let messageDeleted;
    beforeEach(async () => {
      messageDeleted = await thisService.remove(messageCreated._id);
    });

    it("should delete a message", async () => {
      assert.strictEqual(messageDeleted._id, messageCreated._id);
    });
  });
});