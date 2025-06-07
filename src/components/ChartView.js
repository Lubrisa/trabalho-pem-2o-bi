import Throw from "../utils/Throw.js";

/**
 * @template TLabel, TValue
 * @typedef {[TLabel, TValue]} DataMap
 */

/**
 * @typedef {object} DatasetOptions
 * @property {string} label The label for the dataset.
 * @property {string[]} backgroundColor The background colors for the dataset.
 * @property {string[]} borderColor The border colors for the dataset.
 */

/**
 * @typedef {object} ChartViewOptions
 * @property {string} title The title of the chart.
 * @property {string} type The type of the chart (e.g., 'bar', 'line', 'pie').
 * @property {DatasetOptions} datasetOptions The options for the dataset, including label, background color, and border color.
 */

/**
 * @template TLabel, TValue
 */
export default class ChartView {
    /** @type {HTMLCanvasElement} */
    #element;

    /** @type {Chart} */
    #chart;

    /**
     * Creates an instance of ChartView.
     * 
     * @param {HTMLCanvasElement} element The canvas element to be used for the chart.
     * 
     * @throws {Error} If the element is not an instance of HTMLCanvasElement.
     */
    constructor(element) {
        Throw.if(!(element instanceof HTMLCanvasElement),
            'Element must be an instance of HTMLCanvasElement');

        this.#element = element;
    }

    /**
     * Renders the chart with the initial data.
     * 
     * @param {ChartViewOptions} options The options for rendering the chart, including title, type, and dataset options.
     */
    render(options) {
        Throw.if(!options || typeof options !== 'object', 'Options must be an object');
        Throw.if(!options.title || typeof options.title !== 'string', 'Title must be a string');
        Throw.if(!options.type || typeof options.type !== 'string', 'Type must be a string');
        Throw.if(!options.datasetOptions || typeof options.datasetOptions !== 'object',
            'Dataset options must be an object');

        this.#chart?.destroy();

        this.#chart = new Chart(this.#element, {
            type: options.type,
            data: {
                labels: [],
                datasets: [{
                    label: options.datasetOptions.label,
                    data: [],
                    backgroundColor: options.datasetOptions.backgroundColor,
                    borderColor: options.datasetOptions.borderColor,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: options.title
                    }
                }
            }
        });
    }

    /**
     * Updates the chart with new data.
     * 
     * @param {...DataMap<TLabel, TValue>} data The data to update the chart with, where keys are labels and values are data points.
     */
    update(...data) {
        Throw.if(!this.#chart, 'Chart must be rendered before updating');

        Throw.if(!Array.isArray(data) || data.length === 0, 'Data must be a non-empty array');

        Throw.if(!data.every(item => Array.isArray(item) && item.length === 2),
            'Each data item must be an array with two elements: [label, value]');

        data.forEach(([label, value]) => {
            const labelIndex = this.#chart.data.labels.indexOf(label);

            if (labelIndex === -1) {
                this.#chart.data.labels.push(label);
                this.#chart.data.datasets[0].data.push(value);
            } else {
                this.#chart.data.datasets[0].data[labelIndex] += value;
            }
        });

        this.#chart.update();
    }
}