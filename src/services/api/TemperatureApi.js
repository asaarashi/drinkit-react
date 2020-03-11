import params from "../../config/params";

export class TemperatureApi {
    headers = new Headers({
        'Content-Type': 'application/json',
    });
    baseUrl = params.apiBaseUrl;

    postTemperature(requestBody) {
        const url = new URL(`${this.baseUrl}/api/temperature`);
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: this.headers,
        });
    }

    getRecentTemperatures(machineId) {
        const url = new URL(`${this.baseUrl}/api/temperature`);
        url.search = new URLSearchParams({machine_id: machineId}).toString();
        return fetch(url, {
            method: 'GET',
            headers: this.headers,
        });
    }
}
