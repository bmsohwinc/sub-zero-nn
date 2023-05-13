/**
 * We load the cars data from Google's data API
 * 
 */
async function getData() {
    const carsDataResponse = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
    const carsData = await carsDataResponse.json();
    const cleaned = carsData.map(car => ({
        mpg: car.Miles_per_Gallon,
        horsepower: car.Horsepower,
    }))
    .filter(car => car.mpg != null && car.horsepower != null);
    return cleaned;
}


function createModel() {
    // Model instantiation
    const model = tf.sequential();

    // Input layer
    model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));

    // model.add(tf.layers.dense({units: 8, useBias: true}));

    // model.add(tf.layers.dense({units: 4, useBias: true}));

    // model.add(tf.layers.dense({units: 2, useBias: true}));

    // // Output layer
    // model.add(tf.layers.dense({units: 1, useBias: true}));

    return model;
}


async function run() {
    const data = await getData();
    const values = data.map(d => ({
        x: d.horsepower,
        y: d.mpg,
    }));

    tfvis.render.scatterplot(
        {name: 'Horsepower v MPG'},
        {values},
        {
            xLabel: 'Horsepower',
            yLabel: 'MPG',
            height: 300,
        }
    );

    const model = createModel();
    tfvis.show.modelSummary({name: 'Model Summary'}, model)

    const tensorData = convertToTensor(data);
    const {inputs, labels} = tensorData;

    await trainModel(model, inputs, labels);
    console.log('Done training!');

    await testModel(model, data, tensorData);
}

/**
 * The data that was loaded from the api will be shuffled, normalized and,
 * returned as a tensor here.
 * 
 */
function convertToTensor(data) {
    return tf.tidy(() => {
        tf.util.shuffle(data);

        const inputs = data.map(d => d.horsepower);
        const labels = data.map(d => d.mpg);

        // converting simple array to n x 1 tensor
        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

        const inputMax = inputTensor.max();
        const inputMin = inputTensor.min();
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();

        const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
        const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

        return {
            inputs: inputTensor,
            labels: labelTensor,
            inputMax,
            inputMin,
            labelMax,
            labelMin,
        };
    });
}


async function trainModel(model, inputs, labels) {
    model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse'],
    });

    const batchSize = 32;
    const epochs = 100;

    return await model.fit(inputs, labels, {
        batchSize,
        epochs,
        shuffle: true,
        callbacks: tfvis.show.fitCallbacks(
            {name: 'Training Performance'},
            ['loss', 'mse'],
            {height: 200, callbacks: ['onEpochEnd']},
        )
    });
}


async function testModel(model, inputData, normalizationData) {
    const {inputMax, inputMin, labelMin, labelMax} = normalizationData;

    const [xs, preds] = tf.tidy(() => {
        const xsNorm = tf.linspace(0, 1, 100);
        const predictions = model.predict(xsNorm.reshape([100, 1]));

        const unNormXs = xsNorm
            .mul(inputMax.sub(inputMin))
            .add(inputMin);
        
        const unNormPreds = predictions
            .mul(labelMax.sub(labelMin))
            .add(labelMin);
        
        return [unNormXs.dataSync(), unNormPreds.dataSync()];
    });

    const predictedPoints = Array.from(xs).map((val, i) => {
        return {x: val, y: preds[i]};
    });

    const originalPoints = inputData.map(d => ({
        x: d.horsepower, y: d.mpg,
    }));

    tfvis.render.scatterplot(
        {name: 'Model Predictions vs Original Data'},
        {values: [originalPoints, predictedPoints], series: ['original', 'predicted']},
        {
            xLabel: 'Horsepower',
            yLabel: 'MPG',
            height: 300,
        }
    );

}


document.addEventListener('DOMContentLoaded', run);
