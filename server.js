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

app.get('/recipes', (req, res) => {
    const recNames = knex.select('id', 'name')
    .from('recipes')
    const stepNames =knex.select('rec_id','steps.description')
    .from('steps')
    Promise.all([recNames, stepNames])

    .then(results => {
          let recipes = results[0];
          let steps = results[1];
          let output = [];
          for (let i = 0; i < recipes.length; i++) {
            let recObj = recipes[i];
            recObj.steps = [];
            for (let j = 0; j < steps.length; j++) {

              if (recObj.id === steps[j].rec_id) {
                recObj.steps.push(steps[j].description);
              }
            }
            output.push(recObj);
          }
          res.json(output)
    })
    .catch(err => {
        res.send(err)
    });
});
app.post('/recipes', (req, res) => {
    // dehydrate
    knex.insert({
        name: req.body.name,
        description: req.body.description
    }).into('recipes').returning('id')
      .then(results_id => {
        let id = Number(results_id);
        let promiseArray = req.body.steps.map(step => 
               knex.insert({
                        description: step,
                        rec_id: id
                      }).into('steps')
        )
        Promise.all(promiseArray)
        .then(() => {
          res.status(201).json({ msg: 'ITS DONE : Well Done' })
        })
    });
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

// knex.select('recipes.name', 'steps.description')
//     .from('recipes')
//     .join('steps', 'steps.rec_id', 'recipes.id')
//     .then(function(rows) {
//         console.log(rows[0])
//     });


app.listen(8080, () => {
  process.stdout.write('\033c');
  console.log(`Your app is listening on port 8080`);
});
