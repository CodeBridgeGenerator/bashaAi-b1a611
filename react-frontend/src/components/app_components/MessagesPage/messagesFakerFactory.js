
import { faker } from "@faker-js/faker";
export default (user,count,conversationIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
conversationId: conversationIdIds[i % conversationIdIds.length],
role: faker.lorem.sentence(1),
content: faker.lorem.sentence(1),
sources: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
