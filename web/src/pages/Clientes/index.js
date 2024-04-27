import { useEffect } from "react";
import { Button, Drawer, Icon, Modal  } from "rsuite";
import  "rsuite/dist/styles/rsuite-default.css";
import Table from "../../components/Table"
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { allClientes, updateCliente,filterClientes,addCliente, unlinkCliente} from '../../store/modulos/cliente/action'
import ModalFooter from "rsuite/lib/Modal/ModalFooter";


const Clientes = () => {

    const dispatch = useDispatch();
    const { clientes, cliente,behavior, form, components } = useSelector((state) => state.cliente);
   
const setComponent = (component, state) => {
    dispatch(
        updateCliente({
        components: { ...components, [component]: state},
    })
  );
};


    const setCliente = (key, value) =>{
        dispatch(
            updateCliente({
            cliente: { ...cliente, [key]: value},
        })
      );
    }

    const save = () => {
       dispatch(addCliente())
    }
    const remove = () => {
        dispatch(unlinkCliente())
    }

    useEffect (() =>{
        dispatch(allClientes())
    },[])
    return (
        <div className="col p-5 overflow-auto h-100">
            <Drawer 
            show={components.drawer} size="sm" onHide={() => setComponent('drawer', false)} >
              <Drawer.Body>
                <h3>{ behavior === "create" ? 'Criar novo' : 'Atualizar'} cliente </h3>
                <div className="row mt-3">
                <div className="form-group  col-12 mb-3">
                    <b>E-mail</b>
                    <div className="input-group">
                        <input 
                        type="email"
                         className="form-control" 
                         placeholder="E-mail do cliente"
                         disabled={behavior === "update"}
                          value={cliente.email}
                          onChange={(e) => setCliente ('email', e.target.value)}
                        />
                      {behavior === 'create'&& (  
                      <div className="input-group-append">
                            <Button 
                            appearance="primary" 
                            loading={form.filtering} 
                            disabled={form.filtering} 
                            onClick={() => dispatch(filterClientes())}
                            >Pesquisar</Button>
                        </div>
                        )};
                    </div>
                </div>
                <div className="form-group col-6">
                    <b className="">Nome</b>
                    <input
                     type='text'
                     className="form-control"
                     placeholder="Nome do Cliente"
                     disabled={form.disabled}
                     value={cliente.nome}
                     onChange={(e)=>setCliente("nome", e.target.value )}
                    />
                </div>
                <div className="form-group col-6">
                    <b className="">Telefone / Whatsapp</b>
                    <input
                     type='text'
                     className="form-control"
                     placeholder="Telefone / Whatsapp do Cliente"
                     disabled={form.disabled}
                     value={cliente.telefone}
                     onChange={(e)=>setCliente("telefone", e.target.value )}
                    />
                </div>

                <div className="form-group col-6">
                    <b className="">Data de Nascimento</b>
                    <input
                     type='date'
                     className="form-control"
                     disabled={form.disabled}
                     value={cliente.dataNascimento}
                     onChange={(e)=>setCliente("dataNascimento", e.target.value )}
                    />
                </div>

                <div className="form-group col-6">
                    <b className="">Sexo</b>
                    <select
                     className="form-control"
                     disabled={form.disabled}
                     value={cliente.sexo}
                     onChange={(e)=>setCliente("sexo", e.target.value )}
                    >
                      <option value={"M"}>Masculino</option>
                      <option value={"F"}>Feminino</option>
                    </select>      
                </div>

                <div className="form-group col-6">
                    <b className="">Tipo de documento</b>
                    <select
                     className="form-control"
                     disabled={form.disabled}
                     value={cliente.documento.tipo}
                     onChange={(e)=>
                        setCliente("documnto", {
                        ...cliente.documento,
                        tipo: e.target.value,
                       })
                    }   
                   >
                      <option value="cpf">CPF</option>
                      <option value='cnpj'>CNPJ</option>
                    </select>      
                </div>
                <div  className="form-group col-6 ">
                    <b className="">Numero do documento</b>
                    <input
                        type="text"
                        className="form-control"
                        disabled={form.disabled}
                        value={cliente.documento.numero}
                        onChange={(e) =>
                        setCliente('documento',{
                            ...cliente.documento,
                            numero: e.target.value,
                           })
                        }
                     />
                </div>

            <div className="form-group col-3">
                <b className="">CEP</b>
                <input 
                    type="text"
                    className="form-control"
                    placeholder="Digite o CEP"
                    disabled={form.disabled}
                    value={cliente.endereco.cep}
                    onChange={(e) =>
                        setCliente('endereco', {
                            ...cliente.endereco,
                            cep: e.target.value,
                        })
                    }
                />

            </div>
            <div className="form-group col-6">
                <b className="">Rua / lagradouro</b>
                <input 
                    type="text"
                    className="form-control"
                    placeholder="Rua / Logradouro"
                    disabled={form.disabled}
                    value={cliente.endereco.logradouro}
                    onChange={(e) =>
                        setCliente('endereco', {
                            ...cliente.endereco,
                            logradouro: e.target.value,
                        })
                    }
                />
            </div>
            <div className="form-group col-3">
                <b className="">Numero</b>
                <input 
                    type="text"
                    className="form-control"
                    placeholder="Numero"
                    disabled={form.disabled}
                    value={cliente.endereco.numero}
                    onChange={(e) =>
                        setCliente('endereco', {
                            ...cliente.endereco,
                            numero: e.target.value,
                        })
                    }
                />
            </div>    
            <div className="form-group col-3">
                <b className="">UF</b>
                <input 
                    type="text"
                    className="form-control"
                    placeholder="UF"
                    disabled={form.disabled}
                    value={cliente.endereco.uf}
                    onChange={(e) =>
                        setCliente('endereco', {
                            ...cliente.endereco,
                            uf: e.target.value,
                        })
                    }
                />
            </div>
            <div className="form-group col-9">
                <b className="">Cidade</b>
                <input 
                    type="text"
                    className="form-control"
                    placeholder="Cidade"
                    disabled={form.disabled}
                    value={cliente.endereco.cidade}
                    onChange={(e) =>
                        setCliente('endereco', {
                            ...cliente.endereco,
                            cidade: e.target.value,
                        })
                    }
                />
            </div>
          </div>        
            <Button
                block
                className="mt-3"
                color={behavior === "create" ? 'green' : 'red'}
                size="lg"
                loading={form.saving}
                onClick={() =>{
                    if (behavior === "create"){
                        save()    
                    } else{
                        setComponent('confirmDelete', false);
                    }
                }}
            >
                {behavior === "create" ? "Salvar" : 'Remover'} Cliente
            </Button>
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
            <ModalFooter>
                <Button loading={form.saving} onClick={() => remove()} color="red">
                    Sim, tenho certeza
                </Button>
                <Button 
                    onClick={() => setComponent('confirmDelete', false)}
                    appearance="subtle"
                    >
                        Cancelar
                </Button>
            </ModalFooter>         
        </Modal>


            <div className="row">
                <div className="col-12">
                    <div className=" w-100 d-flex justify-content-between">
                       <h2 className="mb-4 mt-0">Clientes</h2>
                         <div>
                            <button 
                            className="btn btn-primary btn-lg"
                            onClick={() =>{
                                dispatch(
                                    updateCliente({
                                   behavior: 'create',
                                })
                              )
                               setComponent('drawer', true); 
                            }}
                            >
                              <span className="mdi mdi-plus">Novo Cliente</span>
                        </button>   
                     </div>
                 </div>
                 <Table 
                 loading = {form.filtering}
                 data={clientes} 
                 config={[
                    { label: 'Nome', key: 'nome', width: 200, fixed: true },
                    {label: 'E-mail', key: 'email', width:200 },
                    {label: 'Telefone', key: 'telefone', width:200 },
                    
                    {label: 'Sexo',
                     content: (cliente) =>
                     cliente.sexo === 'M' ? 'Masculino' : 'Feminino',
                      width:200,
                     },
                     
                    {label: 'Data Cadastro', 
                    content: (cliente) => 
                        moment(cliente.dataCadastro).format('DD/MM/YYYY'), 
                        width:200, 
                    },
                 ]}
                  actions={(cliente) => (
                    <Button color="blue" size="xs">
                        Ver informações
                    </Button>
                  )}
                   onRowClick={(cliente) => {
                    dispatch(
                        updateCliente({
                            behavior: 'update',
                        })
                    );
                    dispatch(
                        updateCliente({
                            cliente,
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

export default Clientes;