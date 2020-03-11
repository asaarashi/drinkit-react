import params from "../../config/params";

export class LowStockAlertApiService {
    headers = new Headers({
        'Content-Type': 'application/json',
    });
    baseUrl = params.apiBaseUrl;

    getLowStockAlert(machineId) {
        const url = new URL(`${this.baseUrl}/api/lowstockalert`);
        url.search = new URLSearchParams({machine_id: machineId}).toString();
        return fetch(url, {
            method: 'GET',
            headers: this.headers,
        });
    }

    postLowStockAlert(requestBody) {
        const url = new URL(`${this.baseUrl}/api/lowstockalert`);
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: this.headers,
        });
    }
}