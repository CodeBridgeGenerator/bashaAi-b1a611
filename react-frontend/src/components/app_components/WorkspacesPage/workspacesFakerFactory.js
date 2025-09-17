
import { faker } from "@faker-js/faker";
export default (user,count,ownerIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
name: faker.lorem.sentence(1),
ownerId: ownerIdIds[i % ownerIdIds.length],

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
