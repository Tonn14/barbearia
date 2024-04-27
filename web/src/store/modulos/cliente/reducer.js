import produce from 'immer'
import types from './types'

const INITIAL_STATE = {
    behavior:"create", //update
    components: {
        drawer: false,
        confirmDelete: false,
    },
    form:{
      filtering: false,
      disabled: true,
      saving: false,  
    },
    clientes: [],
    cliente: {
        email: '',
        nome: '',
        telefone: '',
        dataNascimento: '',
        sexo: 'M',
        documento: {
            tipo: 'cpf',
            numero: '',
        },
        endereco:{
            cidade: '',
            uf: '',
            cep: '',
            logradouro: '',
            numero: '',
            pais: 'br',

        },
    },
};

function cliente(state = INITIAL_STATE, action){
    switch(action.type) {
        case types.UPDATE_CLIENTE: {
            return produce(state, draft => {
                // { clientes: [......] }
                draft = {...draft, ...action.payload};
                return draft;
            });
        }
        case types.RESET_CLIENTE: {
            return produce(state, draft => {
                draft.cliente = INITIAL_STATE.cliente;
                return draft;
            });
        }

        default:
           return state; 
    }
}

export default cliente