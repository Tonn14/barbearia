import { all } from 'redux-saga/effects'

import agendamento from './modulos/agendamento/sagas'
import clientes from './modulos/cliente/sagas';
import colaborador from './modulos/colaborador/sagas';
import servico from './modulos/servico/sagas';
import horario from './modulos/horario/sagas';


export default function* rootSaga() {
    return yield all([agendamento, clientes, colaborador, servico, horario]);
}