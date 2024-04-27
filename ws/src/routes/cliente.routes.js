const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose')
const pagarme = require('../services/pagarme')
const Cliente = require('../models/cliente')
const SalaoCliente = require('../models/relationship/salaoCliente')

router.post('/', async (req, res) => {
   
    const db = mongoose.connection;
    const  session = await db.startSession();
    session.startTransaction();

    try{

     const { cliente, salaoId} = req.body;
     let newCliente = null;
     //VERIFICAR SE O CLIENTE EXISTE
     const clienteExiste = await Cliente.findOne({ 
         $or: [
         { email: cliente.email},
         { telefone: cliente.telefone},
     ] 
 })
     //SE NÃO EXISTIR O CLIENTE
     if(!clienteExiste){
        const _id = mongoose.Types.ObjectId()
         //CRIAR CUSTOMER
         const pagarmeCustomer = await pagarme ('/customers',{
            external_id: _id,
            name: cliente.nome,
            type:cliente.documento.tipo === 'cpf' ? 'individual' : 'corporation',
            country: cliente.endereco.pais,
            email: cliente.emailm,
            documents:[
                {
                    type: cliente.documento.tipo,
                    number: cliente.documento.numero,

                },

            ],
            phone_numbers: [cliente.telefone],
            birthday: cliente.dataNascimento,
         })
         
         
         if (pagarmeCustomer.error){
             throw pagarmeCustomer;
         }

         

     // CRIANDO CLIENTE

     newCliente = await Cliente({
         ...cliente,
         _id,
         customerId: pagarmeCustomer.data.id,
     }).save({ session})

    }
 
    //RELACIONAMENTO
    const clienteId = clienteExiste ? clienteExiste._id: newCliente.id

    //VERIFICA SE JA EXISTE O RELACIONAMENTO COM O SALÃO
    const existentRelationship = await SalaoCliente.findOne({
     salaoId,
     clienteId,
     status: { $ne: 'E'},
    });

    // SE NÃO ESTA VINCULADO
    if(!existentRelationship){
     await new SalaoCliente({
         salaoId,
         clienteId,
     }).save({ session})
    }
    //SE JA EXISTE O VINCULO ENTRE CLIENTE E SALÃO
    if(clienteExiste){
     await SalaoCliente.findOneAndUpdate(
         {
         salaoId,
         clienteId,

        }, {status: 'A'},
           {session}  
     );
    }

   

  await session.commitTransaction();
  session.endSession();

  if(clienteExiste && existentRelationship) {
     res.json ({ error: true, message: 'Cliente ja cadastrado.'})
  } else{
     res.json({ error: false })
  }

 } catch(err){
     await session.abortTransaction();
     session.endSession();
     res.json({ error: true, message: err.message})
    }
    })

    
router.post('/filter' , async(req, res) => {
    try { 
        const clientes = await Cliente.find(req.body.filters)
        res.json({ error: false, clientes })
    } catch (err) {
     res.json({ error: true, message: err.message})
    }
})

router.get('/salao/:salaoId', async (req, res) => {
    try {
        const { salaoId } = req.params
     

        //RECUPERAR VINCULOS
        const clientes = await SalaoCliente.find({
            salaoId,
            status: {$ne: 'E'},
        }).populate('clienteId').select('clienteId dataCadastro')
    
     
        res.json({
            error:false,
            clientes: clientes.map((vinculo) => ({
                ...vinculo.clienteId._doc,
                vinculoId: vinculo._id,
                dataCadastro: vinculo.dataCadastro,
            })),
        })

    } catch (error) {
        res.json({ error: true, message: err.message})
    }
})

router.delete('/vinculo/:id', async (req, res) =>{
    try {
        await SalaoCliente.findByIdAndUpdate(req.params.id, { status: 'E' })
        res.json({ error: false})
    } catch (err) {
        res.json({ error: true, message: err.message})
    }
})
module.exports = router;