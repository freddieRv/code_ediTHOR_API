const { Router } = require('express');
const router     = Router();

router.get('/', (request, response) => {
    response.send('Users index');
});

router.post('/', (request, response) => {
    response.send('Users store');
});

router.get('/:id', (request, response) => {
    response.send(`Show user with id ${request.params.id}`);
});

router.put('/:id', (request, response) => {
    response.send(`Edit user with id ${request.params.id}`);
});

router.delete('/:id', (request, response) => {
    response.send(`Delete user with id ${request.params.id}`);
});

module.exports = router;
