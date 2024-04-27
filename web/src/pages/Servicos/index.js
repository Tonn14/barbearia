import { useEffect } from "react";
import { Button, Drawer, Icon, Modal, Uploader, Tag, DatePicker} from "rsuite";

import  "rsuite/dist/styles/rsuite-default.css";
import Table from "../../components/Table"
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { allServicos,  updateServico, addServico,removeServico, removeArquivo,resetServico} from '../../store/modulos/servico/actions'
import ModalFooter from "rsuite/lib/Modal/ModalFooter";
import consts from "../../consts";



const Servicos = () => {

    const dispatch = useDispatch();
    const { servicos, servico,behavior, form, components } = useSelector((state) => state.servico);
   
const setComponent = (component, state) => {
    dispatch(
        updateServico({
        components: { ...components, [component]: state},
    })
  );
};


   const setServico = (key, value) =>{
        dispatch(
            updateServico({
            servico: { ...servico, [key]: value},
        })
      );
    }
    const save = () => {
       dispatch(addServico())
    }
    const remove = () => {
        dispatch(removeServico())
    }

    useEffect (() =>{
        dispatch(allServicos())
        
    },[])
    return (
        <div className="col p-5 overflow-auto h-100">
            <Drawer show={components.drawer} size="sm" onHide={() => setComponent('drawer', false)} >
              <Drawer.Body>
                <h3>{ behavior === "create" ? 'Criar novo' : 'Atualizar'} Serviço </h3>
                <div className="row mt-3">
                    <div className="form-group col-6">
                        <b className="">Titulo</b>
                        <input
                        type='text'
                        className="form-control"
                        placeholder="Titulo do serviço"
                        value={servico.titulo}
                        onChange={(e) => { setServico('titulo', e.target.value)
                    }}
                    />
                    </div>
                    <div className="form-group col-3">
                        <b className="">R$ Preço</b>
                        <input
                        type='number'
                        className="form-control"
                        placeholder="Preço do serviço"
                        value={servico.preco}
                        onChange={(e) => { setServico('preco', e.target.value)
                    }}
                    />
                    </div>
                    <div className="form-group col-3">
                        <b className="">Recorrência (dias)</b>
                        <input
                        type='number'
                        className="form-control"
                        placeholder="Recorrência do serviço"
                        value={servico.recorrencia}
                        onChange={(e) => { setServico('recorrencia', e.target.value)
                    }}
                    />
                    </div>
                    <div className="form-group col-4">
                        <b className="">% Comissão</b>
                        <input
                        type='number'
                        className="form-control"
                        placeholder="Comissão do serviço"
                        value={servico.comissao}
                        onChange={(e) => { setServico('comissao', e.target.value)
                    }}
                    />
                    </div>
                    <div className="form-group col-4">
                        <b className="">Duração</b>
                        <DatePicker
                        block
                        format="HH:mm"
                        value={servico.duracao}
                        hideMinutes={(min) => ![0, 30].includes(min)}
                        onChange={(e) => { setServico('duracao', e.target.value)
                    }}
                    />
                    </div>
                    <div className="form-group col-4">
                        <b className="">Status</b>
                        <select
                        className="form-control"
                        value={servico.status}
                        onChange={(e) => setServico('status', e.target.value)}
                        >
                            <option value="A">Ativo</option>
                            <option value="I">Inativo</option>
                        </select>
                    </div>
                    <div className="form-group col-12">
                        <b className="">Descrição</b>
                        <textarea
                        rows="5"
                        className="form-control"
                        placeholder="Descrição do serviço..."
                        value={servico.descricao}
                        onChange={(e) => { setServico('', e.target.value)
                    }}
                    ></textarea>
                    </div>
                    <div className="form-group col-12">
                        <b className="d-block">Imagens do serviço</b>
                        <Uploader 
                        multiple
                        autoUpload={false}
                        listType="picture"
                        defaultFileList={servico.arquivos.map((servico, index) => ({
                            name: servico?.caminho,
                            fileKey: index,
                            url: `${consts.bucketUrl}/${servico?.caminho}`
                        }))}
                        onChange={(files) => {
                          const arquivos = files
                          .filter((f) => f.blobFile)
                          .map((f) => f.blobFile);

                          setServico('arquivos', arquivos);
                        }}
                        onRemove={(file) =>{
                            if(behavior === "update" && file.url){
                                dispatch(removeArquivo(file.name))
                            }
                        }}
                        >
                            <button>
                                <Icon icon="camera-retro" size="lg"/>
                            </button>
                        </Uploader>
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
                      {behavior === 'create' ? "Salvar" : "Atualizar"} Serviço
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
                            Remover Serviço
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
                       <h2 className="mb-4 mt-0">Serviços</h2>
                         <div>
                            <button 
                            className="btn btn-primary btn-lg"
                            onClick={() =>{
                                dispatch(resetServico())
                                dispatch(
                                    updateServico({
                                   behavior: 'create',
                                })
                              )
                               setComponent('drawer', true); 
                            }}
                            >
                              <span className="mdi mdi-plus">Novo serviço</span>
                        </button>   
                     </div>
                 </div>
                 <Table 
                 loading = {form.filtering}
                 data={servicos} 
                 config={[
                    {
                        label: 'Titulo',
                        key: 'titulo',
                        fixed: true,
                        width: 200,
                    },
                    {
                        label: 'R$ Preço',
                        content: (servico) => `R$ ${servico.preco.toFixed(2)}`,
                    },
                    {
                        label: '% Comissão',
                        content:(servico)=> `${servico.comissao}%`,
                    },
                    {
                        label:'Recorrência (dias)',
                        content:(servico) => `${servico.recorrencia} dias`
                    },
                    {
                        label:"duração",
                        key: 'duracao',
                        content: (servico) => moment(servico.duracao).format('HH:mm')
                    },
                    {
                        label: 'Status',
                        key:'status',
                        content: (servico) => (
                            <Tag color={servico.status === 'A' ? 'green' : 'red'}>
                                {servico.status === 'A' ? 'Ativo' : 'Inativo'}
                            </Tag>
                        ),
                        sortable: true,    

                    }
                 ]}
                  actions={(servico) => (
                    <Button color="blue" size="xs">
                        Ver informações
                    </Button>
                  )}
                   onRowClick={(servico) => {
                    dispatch(
                        updateServico({
                            behavior: 'update',
                        })
                    );
                    dispatch(
                        updateServico({
                            servico,
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

export default Servicos;