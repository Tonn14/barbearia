const express = require('express');
const router = express.Router();
const Colaborador = require('../models/colaborador');
const SalaoColaborador = require('../models/relationship/salaoColaborador');
const ColaboradorServico = require('../models/relationship/colaboradorServico');
const mongoose = require('mongoose');
const pagarme = require('../services/pagarme');

router.post('/', async (req, res) => {
   
       const db = mongoose.connection;
       const  session = await db.startSession();
       session.startTransaction();

       try{

        const { colaborador, salaoId} = req.body;
        let newColaborador = null;
        //VERIFICAR SE O COLABORADOR EXISTE
        const colaboradorExiste = await Colaborador.findOne({ 
            $or: [
            { email: colaborador.email},
            { telefone: colaborador.telefone},
        ] 
    })
        //SE NÃO EXISTIR O COLABORADOR
        if(!colaboradorExiste){
            //CRIAR CONTA BANCARIA
            const { contaBancaria} = colaborador;
            const pagarmeBankAccount = await pagarme('bank_accounts', {
                agencia: contaBancaria.agencia,
                bank_code: contaBancaria.banco,
                conta: contaBancaria.numero,
                conta_dv: contaBancaria.dv,
                type: contaBancaria.tipo,
                document_number: contaBancaria.cpfCnpj,
                legal_name: contaBancaria.titular,
            });
            
            if (pagarmeBankAccount.error){
                throw pagarmeBankAccount;
            }

            //CRIA RECEBEDOR
            const pagarmeRecipient = await pagarme('recipients', {
                transfer_interval: 'daily',
                transfer_enabled: true,
                back_account_id: pagarmeBankAccount.data.id,

        })

        // CRIANDO COLABORADOR

        newColaborador = await Colaborador({
            ...colaborador,
            recipientId: pagarmeRecipient.data.id,
        }).save({ session})

       }
    
       //RELACIONAMENTO
       const colaboradorId = colaboradorExiste ? colaboradorExiste._id: newColaborador.id

       //VERIFICA SE JA EXISTE O RELACIONAMENTO COM O SALÃO
       const existentRelationship = await SalaoColaborador.findOne({
        salaoId,
        colaboradorId,
        status: { $ne: 'E'},
       });

       // SE NÃO ESTA VINCULADO
       if(!existentRelationship){
        await new SalaoColaborador({
            salaoId,
            colaboradorId,
            status: colaborador.vinculo,
        }).save({ session})
       }
       //SE JA EXISTE O VINCULO ENTRE COLABORADOR E SALÃO
       if(colaboradorExiste){
        await SalaoColaborador.findOneAndUpdate(
            {
            salaoId,
            colaboradorId,

           }, {status: colaborador.vinculo},
              {session}  
        );
       }

       //RELAÇÃO COM AS ESPECIALIDADES
       //['123' , '123', ]
       await ColaboradorServico.insertMany(
        colaborador.especialidades.map(servicoId =>({
            servicoId,
            colaboradorId,

        }),{ session} 
       )
     )

     await session.commitTransaction();
     session.endSession();

     if(colaboradorExiste && existentRelationship) {
        res.json ({ error: true, message: 'Colaborador ja cadastrado.'})
     } else{
        res.json({ error: false })
     }

    } catch(err){
        await session.abortTransaction();
        session.endSession();
        res.json({ error: true, message: err.message})
       }
       })

router.put('/:colaboradorId', async (req, res) =>{
    try {
        const { vinculo, vinculoId, especialidades} = req.body;
        const { colaboradorId } = req.params;

        //VINCULO
        await SalaoColaborador.findByIdAndUpdate(vinculoId, { status: vinculo});

        //ESPECIALIDADES
        await ColaboradorServico.deleteMany({
            colaboradorId,
        })

        await ColaboradorServico.insertMany(
            especialidades.map(
                (servicoId) =>({
                servicoId,
                colaboradorId,
            }),
           )
        )

        res.json({ error: false })
    } catch (err) {
        res.json({ error: true, message: err.message })
    }
})

router.delete('/vinculo/:id', async (req, res) =>{
    try {
        await SalaoColaborador.findByIdAndUpdate(req.params.id, { status: 'E' })
        res.json({ error: false})
    } catch (err) {
        res.json({ error: true, message: err.message})
    }
})

router.post('/filter' , async(req, res) => {
    try {
        const colaboradores = await Colaborador.find(req.body.filters)
        res.json({ error: false, colaboradores })
    } catch (err) {
     res.json({ error: true, message: err.message})
    }
})
router.get('/salao/:salaoId', async (req, res) => {
    try {
        const { salaoId } = req.params
        let listaColaboradores = []

        //RECUPERAR VINCULOS
        const salaoColaborador = await SalaoColaborador.find({
            salaoId,
            status: {$ne: 'E'},
        }).populate({ path: 'colaboradorId', select: '-senha -recipientId'}).select('colaboradorId dataCadastro status')
    
        for(let vinculo of salaoColaborador){
            const especialidades = await ColaboradorServico.find({
                colaboradorId: vinculo.colaboradorId._id
            })

            listaColaboradores.push({
                ...vinculo._doc,
                especialidades: especialidades.map(
                    (especialidade) => especialidade.servicoId
                 ),
            });
        }
        res.json({
            error:false,
            colaboradores: listaColaboradores.map((vinculo) => ({
                ...vinculo.colaboradorId._doc,
                vinculoId: vinculo._id,
                vinculo:vinculo.status,
                especialidades: vinculo.especialidades,
                dataCadastro: vinculo.dataCadastro,
            })),
        })

    } catch (error) {
        res.json({ error: true, message: err.message})
    }
})
module.exports = router;