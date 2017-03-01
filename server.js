const bodyParser = require('body-parser');
const express = require('express');

const app = express();
app.use(bodyParser.json());

const knex = require('knex')({
    client: 'pg',
    connection: {
        database: 'recipify'
    },
});


// knex.delete
//
// knex.insert({
//     name: 'DONE FROM ATOM',
//     description: 'This should show up in the recipify database'
// }).into('recipes').then();
//
// knex.insert({
//     name: 'pancakes',
//     description: 'water, batter and other stuff'
// }).into('recipes').then();
//
// knex.insert({
//     name: 'pancakes supreme',
//     description: 'water, batter and other stuff'
// }).into('recipes').then(function(results){
//   console.log(results)
// });

// knex.select('name', 'description').from('recipes').then( recipes => console.log(recipes[0].name));

knex.select('recipes.name', 'steps.description')
    .from('recipes')
    .join('steps', 'steps.rec_id', 'recipes.id')
    .then(function(rows) {
        console.log(rows[0])
    });


app.listen(8080, () => {
  process.stdout.write('\033c');
  console.log(`Your app is listening on port 8080`);
});
