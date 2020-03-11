import React from 'react';
import Container from '@material-ui/core/Container';
import '../assets/App.css';
import Notification from "./Notification";
import { Block } from "./Block";
import { ProductStocksRepository } from "../services/storage-repository/ProductStocksRepository";
import {LowStockAlertApiService} from "../services/api/LowStockAlertApi";
import {TemperatureApi} from "../services/api/TemperatureApi";
import {TemperatureRepository} from "../services/storage-repository/TemperatureRepository";
import params from "../config/params";
import {TemperatureControl} from "./TemperatureControl";


class App extends React.Component {
    providedDrinks = params.providedDrinks;
    lowStockThreshold = params.lowStockThreshold;
    stocksRepository = new ProductStocksRepository();
    lowStockAlertApiService = new LowStockAlertApiService();
    temperatureApiService = new TemperatureApi();
    temperatureRepository = new TemperatureRepository();
    temperatureReportInterval = params.temperatureReportInterval; // In second
    defaultTemperature = params.defaultTemperature;

    constructor(props) {
        super(props);

        this.state = {
            drinks: this.providedDrinks,
            showNotification: false,
            notificationText: "",
            notificationVariant: "success",
            temperature: this.temperatureRepository.getTemperature()
        };

        // If there is no data in local storage, initialize data
        if (!this.stocksRepository.retrieveCollection()) {
            this.initStocks();
        }
        if (!this.temperatureRepository.getTemperature()) {
            this.initTemperature();
        }
    }

    initStocks() {
        for (const initialStock of params.initialStocks) {
            this.stocksRepository.setStock(initialStock.product, initialStock.stocks);
        }
    }

    initTemperature() {
        this.temperatureRepository.setTemperature(this.defaultTemperature);
    }

    onTemperatureChange = (oldTemperature, newTemperature) => {
        this.temperatureRepository.setTemperature(newTemperature);
    };

    showNotification(text, variant) {
        this.setState({
            showNotification: true,
            notificationText: text,
            notificationVariant: variant
        });
    }

    onSubmitOffer = (drink, additives) => {
        try {
            // Offer drink to user
            this.offer(drink, ...additives);

            // Toast message text
            let additiveText = '';
            if (additives.length > 0) {
                additiveText = ' with ';
                const strings = [];
                for (const additive of additives) {
                    strings.push(additive.name);
                }
                additiveText += strings.join(' and ');
            }
            // Show toast message
            this.showNotification(`Here is your ${drink.name}${additiveText}. Thank you!`, 'success');
        } catch (e) {
            if (e instanceof DrinkRunOutError) {
                this.showNotification(`The ${e.product.name} has been ran out, please come back next time.`, 'success');
            } else if (e instanceof DrinkNotAvailableError) {
                this.showNotification('The drink is not available', 'success');
            }
        }
    };

    componentDidMount() {
        // Listen to event afterOffer, if it is emitted and the stock reaches threshold of low stock alert, reports it to the server
        window.addEventListener("afterOffer", this.reportLowStockAlert);

        // Register a timer that reports temperature to the server periodically
        this.registerTemperatureReporter();
        // Report temperature at once
        this.reportTemperature();
    }

    registerTemperatureReporter() {
        window.setInterval(this.reportTemperature, this.temperatureReportInterval*1000);
    }

    reportTemperature = () => {
        // Request POST api/temperature to report temperature
        const service = this.temperatureApiService;
        const repo = this.temperatureRepository;
        const requestBody = {
            machine_id: params.machineId,
            timestamp: (new Date()).getTime().toString(),
            temperature: repo.getTemperature().toString()
        };
        service.postTemperature(requestBody).then((res) => {
            if (!res.ok) {
                this.showNotification(`Got abnormal status from the API: ${res.status.toString()}`, 'error');
                return ;
            }
            this.showNotification(`Reported the temperature successfully`, 'success');
        }).catch((err) => {
            this.showNotification(`Error occurred while reporting the temperature: ${err.message}`, 'error');
        });
    };

    reportLowStockAlert = (event) => {
        const documents = this.stocksRepository.getAllDocuments();
        const productStocks = [];
        // Collect low stock products
        for (const document of documents) {
            if (document.stock < this.lowStockThreshold) {
                productStocks.push({
                    product: document.productName,
                    stock: document.stock
                });
            }
        }

        if (productStocks.length < 1) {
            return;
        }

        // Request the API
        const service = this.lowStockAlertApiService;
        const requestBody = {
            machine_id: params.machineId,
            timestamp: (new Date()).getTime().toString(),
            stock: productStocks
        };
        service.postLowStockAlert(requestBody).then((res) => {
            if (!res.ok) {
                this.showNotification(`Got abnormal status from the API: ${res.status.toString()}`, 'error');
                return ;
            }
            this.showNotification(`Reported the low stock alert successfully`, 'success');
        }).catch((err) => {
            this.showNotification(`Error occurred while reporting low stock alert: ${err.message}`, 'error');
        });
    };

    offer = (...products) => {
        const toOffer = [];
        // Validation
        for (const product of products) {
            const contentDocument = this.stocksRepository.getDocument(product);
            if (contentDocument) {
                if (contentDocument.stock < 1) {
                    throw new DrinkRunOutError(product);
                }
            } else {
                throw new DrinkNotAvailableError();
            }
            toOffer.push(product);
        }

        for (const product of toOffer) {
            try {
                // Offer products, reduce the stock
                this.stocksRepository.offer(product);

                // Trigger event afterOffer
                const e = new CustomEvent('afterOffer');
                dispatchEvent(e);
            } catch (e) {
                //
                return false;
            }
        }
        return true;
    };

    render() {
        const { drinks, showNotification, notificationText, notificationVariant } = this.state;

        return (
            <Container maxWidth="md" className="app-content">
                <Notification open={showNotification} message={notificationText} variant={notificationVariant}
                              onClose={() => this.setState({ showNotification: false })} />
                <TemperatureControl onTemperatureChange={this.onTemperatureChange} temperature={this.temperatureRepository.getTemperature()} />
                <div className="blocks-container">
                    {drinks.map((drink) =>
                        <Block key={drink.name} variant="determinate" drink={drink}
                               onSubmitOffer={this.onSubmitOffer}
                               percent={this.stocksRepository.getDocument(drink)?.stock} />
                    )}
                </div>
            </Container>
        );
    }
}

class DrinkRunOutError extends Error {
    constructor(product) {
        super();

        this.product = product;
    }
}

class DrinkNotAvailableError extends Error {
}

export default App;
