/**
 * Local storage accessor for stock of products
 */
export class ProductStocksRepository {
    key = 'drinkit_product_stocks';
    storage = window.localStorage;

    offer(product) {
        const collection = this.retrieveCollection() || {};
        if (this.hasDocument(product)) {
            if (Number.isInteger(collection[product.name].stock)) {
                collection[product.name].stock -= 1;
                this.saveCollection(collection);
                return true;
            }
        }
        return false;
    }

    retrieveCollection() {
        return JSON.parse(this.storage.getItem(this.key)) || null;
    }

    saveCollection(collection) {
        return this.storage.setItem(this.key, JSON.stringify(collection));
    }

    getAllDocuments() {
        const documents = [];
        const collection = this.retrieveCollection() || {};
        if (collection) {
            for (const key in collection) {
                if (collection.hasOwnProperty(key)) {
                    const document = collection[key];
                    documents.push(document);
                }
            }
        }
        return documents;
    }

    getDocument(product) {
        const collection = this.retrieveCollection() || {};
        if (collection) {
            return collection.hasOwnProperty(product.name) ? collection[product.name] : null;
        }
        return null;
    }

    setDocument(product, document) {
        const collection = this.retrieveCollection() || {};
        collection[product.name] = document;
        return this.saveCollection(collection);
    }

    hasDocument(product) {
        const collection = this.retrieveCollection() || {};
        if (collection) {
            return collection.hasOwnProperty(product.name);
        }
        return false;
    }

    getStock(product) {
        const document = this.getDocument(product);
        if (!document) {
            return null;
        }
        return document.stock;
    }

    setStock(product, stock) {
        let document = this.getDocument(product);
        if (!document) {
            document = {
                productName: product.name
            };
        }
        document.stock = Number(stock);
        return this.setDocument(product, document);
    }
}
