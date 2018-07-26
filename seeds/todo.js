
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('todo').del()
    .then(function () {
      // Inserts seed entries
      const todos = [{
        title: 'Build a crud app',
        priority: 1,
        date: new Date()
      }, {
        title: 'Learn postgres',
        priority: 3,
        date: new Date()
      }, {
        title: 'Explore more!',
        priority: 4,
        date: new Date()
      }, {
        title: 'Crack it',
        priority: 2,
        date: new Date()
      }]

      return knex('todo').insert(todos);
    });
};
