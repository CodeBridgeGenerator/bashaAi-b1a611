
    module.exports = function (app) {
        const modelName = "chat_embeddings";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            userId: { type: Schema.Types.ObjectId, ref: "users", comment: "User Id, dropdown, false, true, true, true, true, true, true, users, users, one-to-one, name," },
conversationId: { type: Schema.Types.ObjectId, ref: "conversations", comment: "Conversation Id, dropdown, false, true, true, true, true, true, true, conversations, conversations, one-to-one, title," },
messageId: { type: Schema.Types.ObjectId, ref: "messages", comment: "Message Id, dropdown, false, true, true, true, true, true, true, messages, messages, one-to-one, content," },
content: { type:  String , required: true, comment: "Content, p, false, true, true, true, true, true, true, , , , ," },
embedding: { type:  String , required: true, comment: "Embedding, p, false, true, true, true, true, true, true, , , , ," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };