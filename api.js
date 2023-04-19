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

// Read CSV file and store its contents in an array
const results = [];

fs.createReadStream('Data.csv')
.pipe(csvParser())
.on('data', (rows) => {
	results.push(rows);
})
.on('end', () => {
	console.log('csv file loaded');
	// console.log(results);
});


// entry point or homepage
app.get('/', (req, res) => {
	res.send('hello coders');
})


// endpoint to retrieve all data
app.get('/pH', (req, res) => {
	res.json(results);
})


// endpoint to retrieve a specific row by ID
app.get('/pH/:tds', (req, res) => {
	
	const tds = req.params.tds;
	const row = results.find((val) => {
		return val.tds === tds;

	});


	if (row) {

		const newResult = {
			'max': row.pHmax,
			'min': row.pHmin
		};
		res.json(newResult);
	} else {
		// res.status(404).send({ data : 'not found' });
		res.send({ data : 'not found' });
		// res.sendStatus();
	}

});


// starting the app
app.listen(
	port, 
	() => {
		console.log('app listening..');
})