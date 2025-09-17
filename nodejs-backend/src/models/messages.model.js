
    module.exports = function (app) {
        const modelName = "messages";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            conversationId: { type: Schema.Types.ObjectId, ref: "conversations", comment: "Conversation Id, dropdown, false, true, true, true, true, true, true, conversations, conversations, one-to-one, title," },
role: { type:  String , required: true, comment: "Role, p, false, true, true, true, true, true, true, , , , ," },
content: { type:  String , required: true, comment: "Content, p, false, true, true, true, true, true, true, , , , ," },
sources: { type:  String , required: true, comment: "Sources, p, false, true, true, true, true, true, true, , , , ," },

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