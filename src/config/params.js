import {Coffee, Milk, Sugar, Tea} from "../services/products";

const params = {
    apiBaseUrl: 'http://localhost:3000',
    defaultTemperature: 90,
    temperatureReportInterval: 60,  // In second
    lowStockThreshold: 20,
    machineId: "124",
    initialStocks: [
        {
            product: Tea,
            stocks: 100,
        },
        {
            product: Coffee,
            stocks: 85,
        },
        {
            product: Milk,
            stocks: 150,
        },
        {
            product: Sugar,
            stocks: 120,
        },
    ],
    providedDrinks: [Tea, Coffee],
};

export default params;