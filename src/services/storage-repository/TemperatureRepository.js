/**
 * Local storage accessor for temperature
 */
export class TemperatureRepository {
    key = 'drinkit_temperature';
    storage = window.localStorage;

    setTemperature(temperature) {
        this.storage.setItem(this.key, temperature?.toString());
    }

    getTemperature() {
        return Number(this.storage.getItem(this.key));
    }
}
