var express = require('express');
var router = express.Router();

const knex = require('../db/knex');

/* GET home page. */
router.get('/', function(req, res, next) {
  knex('todo')
    .select()
    .then(todos => {
      res.render('all', { todos: todos });
    })
});

function viewAndRender(id, res, view) {
  if(typeof(id) != undefined){
    knex('todo')
    .select()
    .where('id', id)
    .first()
    .then(todo => {
      res.render(view, todo);
    })
  } else {
    res.status(500);
    res.render('error', {
      message: 'Invalid id'
    })
  }
}

router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  viewAndRender(id, res, 'single');
});

router.get('/new', function(req, res, next) {
  res.render('new');
});

router.get('/:id/edit', function(req, res, next) {
  const id = req.params.id;
  viewAndRender(id, res, 'edit');
});

function validTodo(todo){
  return typeof(todo.title == String) && todo.title.trim() != '' && typeof(todo.priority) != undefined && !isNaN(Number(todo.priority));  
}

function validateTodoInsertUpdateRedirect(req, res, callback) {
  if (validTodo(req.body)) {
    const todo = {
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority
    };
    callback(todo);
  } else {
    res.status(500);
    res.render('error', {
      message: 'Invalid todo'
    })
  }
}

router.post('/', function(req, res, next) {
  validateTodoInsertUpdateRedirect(req, res, (todo) => {
    todo.date = new Date()
    knex('todo')
      .insert(todo, 'id')
      .then(ids => {
        const id = ids[0];
        res.redirect(`/todo/${id}`); 
      })
  })  
});

router.put('/:id', function(req, res, next) {
  validateTodoInsertUpdateRedirect(req, res, (todo) => {
    todo.date = new Date()
    knex('todo')
      .where('id', req.params.id)
      .update(todo, 'id')
      .then(ids => {
        const id = ids[0];
        res.redirect(`/todo/${id}`); 
      })
  })  
});

router.delete('/:id', function (req, res, next) {
  const id = req.params.id;
  if(typeof(id) != undefined){
    knex('todo')
    .where('id', id)
    .del()
    .then(() => {
      res.redirect('/todo');
    })
  } else {
    res.status(500);
    res.render('error', {
      message: 'Invalid id'
    })
  }
})

module.exports = router;
