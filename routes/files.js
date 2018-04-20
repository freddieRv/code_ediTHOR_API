const { Router } = require('express');
const router     = Router();

router.get('/', (request, response) => {
    response.send('Files index');
});

router.post('/', (request, response) => {
    response.send('Files store');
});

router.get('/:id', (request, response) => {
    response.send(`Show file with id ${request.params.id}`);
});

router.put('/:id', (request, response) => {
    response.send(`Edit file with id ${request.params.id}`);
});

router.delete('/:id', (request, response) => {
    response.send(`Delete file with id ${request.params.id}`);
});

module.exports = router;
