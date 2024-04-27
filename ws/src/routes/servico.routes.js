const express = require('express');
const router = express.Router();
const aws = require('../services/aws');
const Busboy = require('busboy');
const Servico = require('../models/servico');
const Arquivo = require('../models/arquivo');

router.post('/', async(req, res) => {
let busboy = new Busboy({headers: req.headers });

busboy.on('finish', async () => {
    try {
        const { salaoId, servico } = req.body;
        let errors = [];
        let arquivos = [];

        console.log(req.files);
      if (req.files && Object.keys(req.files).length > 0){
            for (let key of Object.keys(req.files)){
               const file = req.files[key]; 
               const nameParts = file.name.split('.');
               const fileName = `${new Date().getTime()}.${
                nameParts[nameParts.length -1]}`;
            
            
                const path = `servicos/${salaoId}/${fileName}`;

                const response = await aws.uploadToS3(file, path);

                if(response.error) {
                    errors.push({ error: true, message: response.message});
                } else{
                        arquivos.push(path);
                }
            }
        }
     
        if(errors.length > 0){
            res.json(errors[0]);
            return false;
        }
        //CRIA SERVIÇO
        let jsonServico = JSON.parse(servico);
       const servicoCadastrado = await Servico(jsonServico).save();
        //CRIA ARQUIVO
        arquivos = arquivos.map((arquivo) => ({
            referenciaId: servicoCadastrado._id,
            model: 'Servico',
            caminho: arquivo,
        }));
        
        await Arquivo.insertMany(arquivos);
        res.json({ servico: servicoCadastrado, arquivos });

    } catch (error) {
        res.json({ error: true, message: error.message })
    }

})
req.pipe(busboy);
})



router.put('/:id', async(req, res) => {
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('finish', async () => {
        try {
            const {salaoId,servico} = req.body;
            let errors = [];
            let arquivos = [];
            if (req.files && Object.keys(req.files).length > 0){
                for (let key of Object.keys(req.files)){
                   const file = req.files[key]; 
                   const nameParts = file.name.split('.');
                   const fileName = `${new Date().getTime()}.${
                    nameParts[nameParts.length -1]
                }`;
                const name = fileName.replace(/\s/g,'')
                const path = `servicos/${salaoId}/${fileName}`;
    
                    const response = await aws.uploadToS3(file,path);
    
                    if(response.error) {
                        errors.push({ error: true, message: response.message});
                    } else{
                            arquivos.push(path);
                    }
                }
            }
    
            if(errors.length > 0){
                res.json(errors[0]);
                return false;
            }
            //CRIA SERVIÇO
            const jsonServico = JSON.parse(servico)
            await Servico.findByIdAndUpdate(req.params.id, jsonServico)
            
           //CRIA ARQUIVO
            arquivos = arquivos.map((arquivo) => ({
                referenciaId: req.params.id,
                model: 'Servico',
                caminho: arquivo,
            }));
            
            await Arquivo.insertMany(arquivos);
            res.json({Servico: "Alterado com Sucesso"});
    
        } catch (err) {
            res.json({ error: true, message: err.message })
        }
    
    })
    req.pipe(busboy);
    })

router.get('/salao/:salaoId', async (req, res) => {
    try {
        let servicoSalao = [];
        const servicos = await Servico.find({
            salaoId: req.params.salaoId,
            status: {$ne: 'E' },
        })

        for (let servico of servicos) {
            const arquivos = await Arquivo.find({ referenciaId: servico._id, model: 'Servico' });
            servicoSalao.push({ ...servico._doc, arquivos})
        }
        res.json({ servicos: servicoSalao,})
    } catch (error) {
        res.json({ error: true, message: error.message })
        
    }
})

    router.post('/delete-arquivo', async (req, res) => {
        try {
            const { key } = req.body;
            
            // EXCLUIR AWS
            await aws.deleteFileS3(key);

            await Arquivo.findOneAndDelete({
                caminho: key,
            })
            res.json({error: false });
        } catch (err) {
            res.json({ error: true, message: err.message })

        }
    })
    
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await Servico.findByIdAndUpdate(id, { status: 'E'});
            res.json({error: false });
        } catch (err) {
            res.json({ error: true, message: err.message })

        }

    })


    module.exports = router;