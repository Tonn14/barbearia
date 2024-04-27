import { useEffect } from "react";
import { Button, Drawer, Icon, Modal, SelectPicker,TagPicker} from "rsuite";

import  "rsuite/dist/styles/rsuite-default.css";
import Table from "../../components/Table"
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { allColaboradores,  updateColaborador, filterColaboradores,addColaborador,unlinkColaborador,allServicos} from '../../store/modulos/colaborador/actions'
import ModalFooter from "rsuite/lib/Modal/ModalFooter";
import bancos from '../../data/bancos.json'


const Colaboradores = () => {

    const dispatch = useDispatch();
    const { colaboradores, colaborador,behavior, form, components,servicos } = useSelector((state) => state.colaborador);
   
const setComponent = (component, state) => {
    dispatch(
        updateColaborador({
        components: { ...components, [component]: state},
    })
  );
};


   const setColaborador = (key, value) =>{
        dispatch(
            updateColaborador({
            colaborador: { ...colaborador, [key]: value},
        })
      );
    }
    const setContaBancaria = (key, value) => {
        dispatch(
            updateColaborador({
           colaborador:{
            ...colaborador,
            contaBancaria: {
                ...colaborador.contaBancaria,
                [key] :value,

              },
           },
        })
      );
    }
    const save = () => {
       dispatch(addColaborador())
    }
    const remove = () => {
        dispatch(unlinkColaborador())
    }

    useEffect (() =>{
        dispatch(allColaboradores())
        dispatch(allServicos())
    },[])
    return (
        <div className="col p-5 overflow-auto h-100">
            <Drawer show={components.drawer} size="sm" onHide={() => setComponent('drawer', false)} >
              <Drawer.Body>
                <h3>{ behavior === "create" ? 'Criar novo' : 'Atualizar'} colaborador </h3>
                <div className="row mt-3">
                    <div className="form-group col-12">
                        <b className="">E-mail</b>
                        <div className="input-group mb-3">
                            <input 
                            disabled={behavior === 'update'}
                            type="email"
                            className="form-control"
                            placeholder="E-mail do Colaborador"
                            value={colaborador.email}
                            onChange={(e) => setColaborador('email', e.target.value)}
                            />
                            {behavior === 'create' && (
                                <div className="input-group-append">
                                  <Button
                                  appearance="primary"
                                  loading={form.filtering}
                                  disabled={form.filtering}
                                  onClick={() => {
                                    dispatch(
                                       filterColaboradores());
                                  }}
                                  >
                                    Pesquisar
                                </Button> 
                              </div>   
                            )}
                        </div>
                    </div>
                    <div className="form-group col-6">
                        <b className="">Nome</b>
                        <input
                        type='text'
                        className="form-control"
                        placeholder="Nome do Colaborador"
                        disabled={form.disabled}
                        value={colaborador.nome}
                        onChange={(e) => setColaborador("nome", e.target.value)}
                        />
                    </div>
                    <div className="form-group col-6">
                        <b className="">Status</b>
                        <select
                        className="form-control"
                        disabled={form.disabled && behavior === 'create'}
                        value={colaborador.vinculo}
                        onChange={(e) => setColaborador("vinculo", e.target.value)}
                        >
                        <option value="A">Ativo</option>
                        <option value="I">Inativo</option>
                        </select>
                    </div>
                    <div className="form-group col-4">
                        <b className="">Telefone / Whatsapp</b>
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Telefone / Whatsapp do Colaborador"
                        disabled={form.disabled}
                        value={colaborador.telefone}
                        onChange={(e) => setColaborador('telefone', e.target.value)}
                        />
                    </div>
                    <div className="form-group col-4">
                        <b className="">Data de Nascimento</b>
                        <input
                        type="date"
                        className="form-control"
                        placeholder="Data de Nascimento do Colaborador"
                        disabled={form.disabled}
                        value={colaborador.dataNascimento}
                        onChange={(e) => setColaborador('dataNascimento', e.target.value)}
                        />
                 </div> 
                 <div className="form-group col-4">
                    <b className="">Sexo</b>
                    <select
                    className="form-control"
                    disabled={form.disabled}
                    value={colaborador.sexo}
                    onChange={(e) => setColaborador('sexo', e.target.value)}
                    >
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </select>
                  </div>
                  <div className="col-12 mb-4">
                    <b>Especoalidades</b>
                    <TagPicker
                    size="lg"
                    block data={servicos} disabled={form.disabled && behavior === "create"}
                    value={colaborador.especialidades}
                    onChange={(especialidade) => setColaborador ('especialidades', especialidade)}
                    />
                   </div>

                   <div className="row mt-3">
                    <div className="form-group col-6">
                        <b className="">Titular da conta</b>
                        <input
                        type='text'
                        className="form-control"
                        placeholder="Nome do titular da conta"
                        disabled={form.disabled}
                        value={colaborador.contaBancaria.titular}
                        onChange={(e) => setContaBancaria ('titular', e.target.value)}
                        />
                    </div>
                    <div class="form-group col-6">
                        <b className="">CPF/CNPJ</b>
                        <input
                        type='text'
                        className="form-control"
                        placeholder="CPF/CNPJ do titular"
                        disabled={form.disabled}
                        value={colaborador.contaBancaria.cpfCnpj}
                        onChange={(e) => setContaBancaria('cpfCnpj', e.target.value)}
                        />
                    </div>
                    <div className="form-group col-6">
                    <b className="">Banco</b>  
                    <SelectPicker
                    disabled={form.disabled}
                    value={colaborador.contaBancaria.banco}
                    onChange={(banco) => setContaBancaria('banco', banco)}
                    data={bancos} 
                    block
                    size="lg"
                    />        
                    </div>
                    <div className="form-group col-6">
                        <b className="">Tipo de Conta</b>
                        <select
                        className="form-control"
                        disabled={form.disabled}
                        value={colaborador.contaBancaria.tipo}
                        onChange={(e) => setContaBancaria('tipo', e.target.value)}
                        >
                            <option value="conta_corrente">Conta Corrente</option>
                            <option value="conta_poupanca">Conta Poupança</option>
                        </select>
                    </div>  
                    <div className="form-group col-6">
                       <b className="">Agência</b>
                       <input
                       type="text"
                       className="form-control"
                       placeholder="Agência"
                       disabled={form.disabled}
                       value={colaborador.contaBancaria.agencia}
                       onChange={(e) => setContaBancaria('agencia', e.target.value)}
                       />
                    </div>
                    <div className="form-group col-4">
                       <b className="">Numero da Conta</b>
                       <input
                       type="text"
                       className="form-control"
                       placeholder="Numero da Conta"
                       disabled={form.disabled}
                       value={colaborador.contaBancaria.numero}
                       onChange={(e) => setContaBancaria('numero', e.target.value)}
                       />
                    </div>
                    <div className="form-group col-2">
                       <b className="">Digito</b>
                       <input
                       type="text"
                       className="form-control"
                       placeholder="DV"
                       disabled={form.disabled}
                       value={colaborador.contaBancaria.dv}
                       onChange={(e) => setContaBancaria('dv', e.target.value)}
                         />
                      </div>
                     </div>       
                    </div>
                    <Button
                    loading={form.saving}
                    color={behavior === 'create' ? 'green' : 'primary'}
                    size="lg"
                    block
                    onClick={() => save()}
                    className="mt-3"
                    >
                      {behavior === 'create' ? "Salvar" : "Atualizar"} Colaborador
                    </Button>
                    {behavior === 'update' && (
                        <Button
                        loading={form.saving}
                        color="red"
                        size="lg"
                        block
                        onClick={() => setComponent('confirmDelete', true)}
                        className="mt-1"
                        >
                            Remover Colaborador
                        </Button>

                    )}

               
                
           </Drawer.Body>  
          </Drawer>
            <Modal 
            show={components.confirmDelete}
            onHide={() => setComponent('confirmDelete', false)}
            size="xs"
            >
             <Modal.Body>
                <Icon 
                    icon="remind"
                    style={{
                        color: '#ffb300',
                        fontSize:'24',
                    }}
                />
                {'  '} Tem certeza que deseja excluir? Essa ação sera irreversivel!
            </Modal.Body>
            <Modal.Footer>
                <Button loading={form.saving} onClick={() => remove()} color="red">
                    Sim, tenho certeza
                </Button>
                <Button 
                    onClick={() => setComponent('confirmDelete', false)}
                    appearance="subtle"
                    >
                        Cancelar
                </Button>
            </Modal.Footer>         
        </Modal>


            <div className="row">
                <div className="col-12">
                    <div className=" w-100 d-flex justify-content-between">
                       <h2 className="mb-4 mt-0">Colaboradores</h2>
                         <div>
                            <button 
                            className="btn btn-primary btn-lg"
                            onClick={() =>{
                                dispatch(
                                    updateColaborador({
                                   behavior: 'create',
                                })
                              )
                               setComponent('drawer', true); 
                            }}
                            >
                              <span className="mdi mdi-plus">Novo colaborador</span>
                        </button>   
                     </div>
                 </div>
                 <Table 
                 loading = {form.filtering}
                 data={colaboradores} 
                 config={[
                    { label: 'Nome', key: 'nome', width: 200, fixed: true },
                    {label: 'E-mail', key: 'email', width:200 },
                    {label: 'Telefone', key: 'telefone', width:200 },
                    
                    {label: 'Sexo',
                     content: (colaborador) =>
                     colaborador.sexo === 'M' ? 'Masculino' : 'Feminino',
                      width:200,
                     },
                     
                    {label: 'Data Cadastro', 
                    content: (colaborador) => 
                        moment(colaborador.dataCadastro).format('DD/MM/YYYY'), 
                        width:200, 
                    },
                 ]}
                  actions={(colaborador) => (
                    <Button color="blue" size="xs">
                        Ver informações
                    </Button>
                  )}
                   onRowClick={(colaborador) => {
                    dispatch(
                        updateColaborador({
                            behavior: 'update',
                        })
                    );
                    dispatch(
                        updateColaborador({
                            colaborador,
                        })
                    )
                    setComponent('drawer', true);
                   }} 
                 />
              
            </div>           
       </div>
    </div>
    )
};

export default Colaboradores;