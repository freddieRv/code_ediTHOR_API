const { Router } = require('express');
const router     = Router();

router.get('/', (request, response) => {
    response.send('Directory index');
});

router.post('/', (request, response) => {
    response.send('Directory store');
});

router.get('/:id', (request, response) => {
    response.send(`Show directory with id ${request.params.id}`);
});

router.put('/:id', (request, response) => {
    response.send(`Edit directory with id ${request.params.id}`);
});

router.delete('/:id', (request, response) => {
    response.send(`Delete directory with id ${request.params.id}`);
});

module.exports = router;
