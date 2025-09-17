
import { faker } from "@faker-js/faker";
export default (user,count,userIdIds,conversationIdIds,messageIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
userId: userIdIds[i % userIdIds.length],
conversationId: conversationIdIds[i % conversationIdIds.length],
messageId: messageIdIds[i % messageIdIds.length],
content: faker.lorem.sentence(""),
embedding: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
