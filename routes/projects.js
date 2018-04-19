const { Router } = require('express');
const router     = Router();

router.get('/', (request, response) => {
    response.send('Projects index');
});

router.post('/', (request, response) => {
    response.send('Projects store');
});

router.get('/:id', (request, response) => {
    response.send(`Show project with id ${request.params.id}`);
});

router.put('/:id', (request, response) => {
    response.send(`Edit project with id ${request.params.id}`);
});

router.delete('/:id', (request, response) => {
    response.send(`Delete project with id ${request.params.id}`);
});

module.exports = router;
