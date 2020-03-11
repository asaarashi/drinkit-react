const Milk = {
    name: 'milk',
    color: 'white'
};

const Sugar = {
    name: 'sugar',
    color: 'white'
};

const Coffee = {
    name: 'coffee',
    color: 'brown',
    additives: [Milk, Sugar],
};

const Tea = {
    name: 'tea',
    color: 'green',
    additives: [Milk, Sugar],
};

const availableProducts = [Milk, Sugar, Coffee, Tea];

function resolveProductByName(name) {
    for (const product of availableProducts) {
        if (product.name === name) {
            return product;
        }
    }
    return;
}

export {Milk, Sugar, Coffee, Tea, resolveProductByName};
