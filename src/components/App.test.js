import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import {getByPlaceholderText, fireEvent, screen, waitForElement, getByText} from "@testing-library/dom";
import {TemperatureRepository} from "../services/storage-repository/TemperatureRepository";
import {ProductStocksRepository} from "../services/storage-repository/ProductStocksRepository";
import {Tea} from "../services/products";

test('temperature should be displayed correctly', async () => {
  const {container} = render(<App/>);

  const temperatureInput = getByPlaceholderText(document.body, "Temperature");
  expect(Number(temperatureInput.value)).toEqual(new TemperatureRepository().getTemperature());
});

test('offer a cup of tea', async () => {
  const {container} = render(<App/>);

  fireEvent.click(screen.getByText(/TEA/i));
  expect(new ProductStocksRepository().getStock(Tea)).toEqual(99);
});
