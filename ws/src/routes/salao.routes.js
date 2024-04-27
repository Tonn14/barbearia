const express = require('express');
const router = express.Router();
const Salao = require('../models/salao');
const Servico = require('../models/servico');
const turf = require('@turf/turf');

router.post('/', async(req, res) => {
    try {
        const salao = await  new Salao(req.body).save();
        res.json({salao});
    } catch (error) {
        res.json({ error: true, message: error.message })
    }

})

router.get('/servicos/:salaoId', async (req, res) =>{
    try {
        const {salaoId} = req.params;
        const servicos = await Servico.find({
            salaoId,
            status:'A'
        }).select('_id titulo');
        res.json({
            servicos: servicos.map(s =>({ label: s.titulo, value: s._id}))
        })
        
    } catch (error) {
        res.json({error: true, message: error.message});
        
    }
})

router.get('/:id', async (req, res) => {
    try {
        const salao = await Salao.findById(req.params.id).select(
            'capa nome endereco.cidade geo.coordinates telefone')

            //DISTANCIA
            const distance =  turf.distance(
                turf.point(salao.geo.coordinates),
                turf.point([-13.012042324319951, -38.482544651656546])
            )

        res.json({error: false, salao, distance});
    } catch (error) {
        res.json({error: true, message: error.message});
    }
})

module.exports = router;