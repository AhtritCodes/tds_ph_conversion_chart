// importing packages
const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const cors = require('cors');

// creating express app 
const app = express();

// using cors policy
app.use(cors());

// defining port to run the app
const port = process.env.PORT || 3000;

// read the CSV file using fs
// fs.readFile('./data.csv', 'utf-8', (error, data) => {
// 	if (error) { console.log('error: ', error.message); }
// 	else {
// 		console.log(data);
// 	}
// })

// Read CSV file of ph and store its contents in an array
const results_pH = [];

fs.createReadStream('Microbes_pH.csv')
.pipe(csvParser())
.on('data', (rows) => {
	results_pH.push(rows);
})
.on('end', () => {
	console.log('csv file1 loaded');
	// console.log(results);
});


// Read CSV file of temp and store its contents in an array
const results_temp = [];

fs.createReadStream('Microbes_temperature.csv')
.pipe(csvParser())
.on('data', (rows) => {
	results_temp.push(rows);
})
.on('end', () => {
	console.log('csv file2 loaded');
	// console.log(results);
});


// entry point or homepage
app.get('/', (req, res) => {
	res.send('hello coders');
})


// endpoint to retrieve all data for pH values
app.get('/microbes/pH', (req, res) => {
	res.json(results_pH);
})


// endpoint to retrieve a specific object by pH
app.get('/microbes/pH/:pHvalue', (req, res) => {
	
	const pH = req.params.pHvalue;

	// console.log(pH);
	const rows = [];
	
	results_pH.filter((obj) => {
		const lower = parseFloat(obj.pHrange.split('-')[0]);
		const upper = parseFloat(obj.pHrange.split('-')[1]);

		if (pH >= lower && pH <= upper) {
			rows.push(obj);
		}
	});

	if (rows) {
		res.json(rows);
	}
	else {
		res.status(404).json({ data: 'not found'} );
	}
	// console.log(rows);
	// const row = results.find((val) => {
	// 	return val.pH === pH;

	// });


	// if (row) {

	// 	const newResult = {
	// 		'max': row.pHmax,
	// 		'min': row.pHmin
	// 	};
	// 	res.json(newResult);
	// } else {
	// 	// res.status(404).send({ data : 'not found' });
	// 	res.send({ data : 'not found' });
	// 	// res.sendStatus();
	// }

});

// endpoint to retrieve all data by temperature
app.get('/microbes/temp', (req, res) => {

	res.json(results_temp);
});

// endpoint for parameterized temperature
app.get('/microbes/temp/:tempValue', (req, res) => {

	const temp = req.params.tempValue;

	// console.log(req);
	const rows = [];
	
	results_temp.filter((obj) => {
		const lower = parseInt(obj.Temperature.split('-')[0]);
		const upper = parseInt((obj.Temperature.split('-')[1]));

		if (temp >= lower && temp <= upper) {
			rows.push(obj);
		}
	});

	if (rows) {
		res.json(rows);
	}
	else {
		res.status(404).json({ data: 'not found'} );
	}
});

// starting the app
app.listen(
	port, 
	() => {
		console.log('app listening..');
});