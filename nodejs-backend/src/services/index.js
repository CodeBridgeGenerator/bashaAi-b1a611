
const workspaces = require("./workspaces/workspaces.service.js");
const workspaceMembers = require("./workspaceMembers/workspaceMembers.service.js");
const conversations = require("./conversations/conversations.service.js");
const messages = require("./messages/messages.service.js");
const chatEmbeddings = require("./chatEmbeddings/chatEmbeddings.service.js");
// ~cb-add-require-service-name~

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
    
  app.configure(workspaces);
  app.configure(workspaceMembers);
  app.configure(conversations);
  app.configure(messages);
  app.configure(chatEmbeddings);
    // ~cb-add-configure-service-name~
};
