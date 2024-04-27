import { combineReducers } from 'redux'

import agendamento from './modulos/agendamento/reducer'
import cliente from './modulos/cliente/reducer'
import colaborador from './modulos/colaborador/reducer'
import servico from './modulos/servico/reducer'
import horario from './modulos/horario/reducer'

export default combineReducers({
  agendamento,
  cliente,
  colaborador,
  servico,
  horario,
});
