const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose')
const moment = require('moment')
const pagarme = require('../services/pagarme');
const _ = require('lodash');
const util = require('../services/util')
const keys = require('../models/data/keys.json');

const Cliente = require('../models/cliente')
const Salao = require('../models/salao')
const Servico = require('../models/servico')
const Colaborador = require('../models/colaborador')
const Agendamento = require('../models/agendamento')
const Horario = require('../models/horario')

const { json } = require('body-parser');
const { last } = require('lodash');
const horario = require('../models/horario');

router.post('/', async (req, res) => {
    const db = mongoose.connection;
    const  session = await db.startSession();
    session.startTransaction();
    try {

        const {clienteId, salaoId, servicoId, colaboradorId } = req.body


                /*
                FAZER VERIFICAÇÃO SE AINDA EXISTE AQUELE HORARIO DISPONIVEL
                */

        //RECUPERAR O CLIENTE
        const cliente = await Cliente.findById(clienteId).select('nome endereco customerId')
        //RECUPERAR O SALÃO
        const salao = await Salao.findById(salaoId).select('recipientId')

        //RECUPERAR O SERVIÇO
        const servico = await Servico.findById(servicoId).select('preco titulo comissao')

        //RECUPERAR O COLABORADOR
        const colaborador = await Colaborador.findById(colaboradorId).select('recipientId')


        //CRIADO PAGAMENTO
        const precoFinal = util.toCents(servico.preco) * 100; ///50

        //COLABORADOR SPLIT RULES
        const colaboradorSplitRule = {
            recipient_Id: colaborador.recipientId,
            amount: parseInt(precoFinal * (servico.comissao / 100))
        }
        const createPayment = await pagarme('/transactions', {
            //PREÇO TOTAL
            amount: precoFinal,

            //DADOS DO CARTÃO
            card_number: '411111111111111',
            card_cvv: '123',
            card_expiration_date: '0922',
            card_holder_name: 'Morpheus Fishburne',

            // DADOS DO CLIENTE
            customer:{
                id: cliente.customerId,
            },
            //DADOS DE ENDEREÇO DO CLIENTE

            billing: {
                name: cliente.nome,
                address:{
                    country: cliente.endereco.pais,
                    state: cliente.endereco.uf,
                    city: cliente.endereco.cidade,
                    street: cliente.endereco.logradouro,
                    street_number: cliente.endereco.numero,
                    zipcode: cliente.endereco.cep,
                },
            },

            // ITENS DA VENDA
            items: [
                {
                    id: servicoId,
                    title: servico.titulo,
                    unit_price: precoFinal,
                    quantity: 1,
                    tangible: false,
                },
            ],
            split_rules: [
                //TAXA DO SALÃO
                {
                    recipient_id: salao.recipientId,
                    amount: precoFinal - keys.app_free - colaboradorSplitRule.amount
                },
                //TAXA DO COLABORADOR
                colaboradorSplitRule,
                //TAXA DO APP
                {
                    recipient_id: keys.recipient_id,
                    amount: keys.app_free,
                }
            ],
        })

        if(createPayment.error){
            throw createPayment
        }
        
        //CRIA AGENDAMENTO
        const agendamento = await new Agendamento({
            ...req.body,
            transactionId: createPayment.data.id,
            comissao: servico.comissao,
            valor: servico.preco
        }).save({ session })


        await session.commitTransaction()
        session.endSession()

        res.json({ error: false, agendamento})
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.json({error: true, message: error.message })
    }
})

router.post('/filter', async(req, res) =>{
    try {
        const { periodo, salaoId} = req.body

        const agendamentos = await   Agendamento.find({
            salaoId,
            data:{
              $gte: moment(periodo.inicio).startOf('day'),
              $lte: moment(periodo.final).endOf('day'),
            },
        }).populate([
            {path: 'servicoId', select: 'titulo duracao'},
            {path: 'colaboradorId', select: 'nome'},
            {path: 'clienteId', select: 'nome'},
        ])
        res.json({ error: false, agendamentos})

    } catch (error) {
        res.json({ error: true, message: error.message})
    }
})

router.post('/dias-disponiveis', async (req, res) => {
    try {
        const { data, salaoId, servicoId} = req.body
        const horarios  = await Horario.find({ salaoId })
        const servico = await Servico.findById(servicoId).select('duracao')

        let agenda = [];
        let colaboradores =[];
        let lastDay = moment(data);

        //DURAÇÃO DO SERVIÇO
        const servicoMinutos =  util.hourToMinutes(moment(servico.duracao).format('HH:mm'))
       
        const servicoSlots =  util.sliceMinutes(
        servico.duracao, 
        moment(servico.duracao).add(servicoMinutos, 'minutes'),
        util.SLOT_DURATION
        ).length;

            /*
                PROCURE NOS PROXIMOS 365 DIAS ATE A AGENDA CONTER 7 DIAS DISPÓNIVEIS

            */
        for(let i = 0; i < 365 && agenda.length <= 7; i++){
            const espacosValidos = horarios.filter(horario =>{
                // VERIFICAR O DIA DA SEMANA
                const diaSemanaDisponivel = horario.dias.includes(moment(lastDay).day())

                //VERIFICAR ESPECIALIDADE DISPONIVEL
                const servicoDisponivel = horario.especialidades.includes(servicoId)

                return diaSemanaDisponivel && servicoDisponivel;
            })

            /*
                TODOS OS COLABORADORES DISPONIVEIS NO DIA 
                E SEUS HORARIOS
                [
                    {
                        '2021-03-21':{
                            '111111111':[
                                '12:12',
                                '14:18',
                                '19:19'
                            ],
                         
                            }
                        }
                    }
                ]
            */

             
                
            if(espacosValidos.length > 0) {
                let todosHorariosDia = {};

                for(let spaco of espacosValidos) {
                  for(let colaboradorId of spaco.colaboradores ) {
                    if(!todosHorariosDia[colaboradorId]){
                        todosHorariosDia[colaboradorId] = []
                    }
                    //PEGAR TODOS OS HORARIOS DO ESPAÇO E JOGAR PRA DENTRO DO COLABORADOR

                    todosHorariosDia[colaboradorId] = [
                        ...todosHorariosDia[colaboradorId],
                        ...util.sliceMinutes(
                            util.mergeDateTime(lastDay, spaco.inicio ),
                            util.mergeDateTime(lastDay, spaco.fim),
                            util.SLOT_DURATION
                        )
                    ]
                  } 
                }

                // OCUPAÇÃO DE CADA ESPECIALISTA NO DIA
                for(let colaboradorId of Object.keys(todosHorariosDia)){
                    // RECUPERAR AGENDAMENTOS
                    const agendamentos = await Agendamento.find({
                        colaboradorId,
                        data:{
                            $gte: moment(lastDay).startOf('day'),
                            $lte : moment(lastDay).endOf('day'),
                        },
                     }).select('data servicoId-_id')
                        .populate('servicoId', 'duracao');
                     
                     //RECUPERA HORARIOS AGENDADOS
                     let horariosOcupados = agendamentos.map(agendamento =>({
                        inicio: moment(agendamento.data),
                        final: moment(agendamento.data).add(
                        util.hourToMinutes(
                        moment(agendamento.servicoId.duracao).format('HH:mm')
                        ),'minutes'
                        ),
                     }));
                     //RECUPERAR TODOS OS SLOTS ENTRE OS AGENDAMENTOS
                     horariosOcupados = horariosOcupados.map((horario) => 
                        util.sliceMinutes(horario.inicio,
                             horario.final, 
                             util.SLOT_DURATION
                             )
                            ).flat();


                            //REMOVENDO TODOS OS HORARIO/ SLOTS OCUPADOS
                           let horarioLivres = util
                            .splitByValue(
                                todosHorariosDia[colaboradorId].map((horarioLivre) =>{
                                return horariosOcupados.includes(horarioLivre)
                                ? '-'
                                : horarioLivre;
                          } ), 
                          '-'
                        ).filter((space) => space.length > 0);

                        //VERIFICANDO SE EXISTE ESPAÇO SUFICIENTE NO SLOT
                          horarioLivres = horarioLivres.filter(
                            (horarios) => horarios.length >= servicoSlots
                            );

                            /*
                            VERIFICANDO SE OS HORARIOS DENTRO DO SLOT 
                            TEM A QUANTIDADE NECESSARIA
                            */
                           horarioLivres = horarioLivres
                           .map((slot) => 
                           slot.filter(
                            (horario, index) => slot.length - index >= servicoSlots
                            )
                         ).flat();

                         //FORMATANDO HORARIOS DE 2 EM 2
                         horarioLivres = _.chunk(horarioLivres, 2);

                         //REMOVER COLABORADOR CASO NÃO TENHA NENHUM ESPAÇO
                         if(horarioLivres.length = 0){
                            todosHorariosDia = _.omit(todosHorariosDia, colaboradorId)
                         } else {
                            
                                todosHorariosDia[colaboradorId] = horarioLivres;
                         }
                      }     

                      //VERIFICAR SE TEM ESPECIALISTA DISPONIVEL NAQUELE DIA
                      const totalEspecialistas = Object.keys(todosHorariosDia).length;

                      if(totalEspecialistas > 0){
                        colaboradores.push(Object.keys(todosHorariosDia));
                        agenda.push({
                            [lastDay.format('YYYY-MM-DD')]: todosHorariosDia,
                        });
                      }
            }
            lastDay = lastDay.add(1, 'day');
        }
        // RECUPERANDO DADOS DOS COLABORADORES
        colaboradores = _.uniq(colaboradores.flat());

        colaboradores = await Colaborador.find({
            _id: { $in: colaboradores},
        }).select('nome foto');

        colaboradores = colaboradores.map((c) =>({
            ...c._doc,
            nome: c.nome.split(' ')[0]
        }));

        res.json({ 
            error: false,
            colaboradores, 
            agenda,
        })

    } catch (error) {
        res.json({ error: true, message: error.message});
    }
})

module.exports = router;