import { faker } from '@faker-js/faker';

function generateProduct() {
    return {
        title: faker.commerce.productName(),
        price: parseInt(faker.commerce.price()),
        thumbnail: faker.image.imageUrl(),
        quantity: 1,
    };
};

export { generateProduct };