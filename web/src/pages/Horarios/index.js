import { useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Button, DatePicker, Drawer, TagPicker, Modal, Icon,} from 'rsuite'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {allHorarios, allServicos, updateHorario, filterColaboradores, addHorario, removeHorario } from '../../store/modulos/horario/actions'
import {useDispatch, useSelector} from 'react-redux'
import moment from 'moment';
import ModalFooter from "rsuite/lib/Modal/ModalFooter";
import 'moment/locale/pt-br';

moment.locale('pt-br')
const localize = momentLocalizer(moment);

const Horarios = () => {

    const dispatch = useDispatch();
    const { horarios, horario, servicos, colaboradores, components, form, behavior } = useSelector(state => state.horario)

    const diasSemanaData = [
      new Date(2023, 7, 2, 0, 0, 0, 0 ),
      new Date(2023, 7, 3, 0, 0, 0, 0 ),  
      new Date(2023, 7, 4, 0, 0, 0, 0 ),  
      new Date(2023, 7, 5, 0, 0, 0, 0 ),  
      new Date(2023, 7, 6, 0, 0, 0, 0 ),  
      new Date(2023, 7, 7, 0, 0, 0, 0 ),  
      new Date(2023, 7, 8, 0, 0, 0, 0 ),    
    ]

   const diasDaSemana = [
    'domingo',
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
   ];
    
   const formatEvents = horarios.map((horario, index) => horario.dias.map((dia) =>({
    resource: horario,
    title: `${horario.especialidade.length} especialidade e ${horario.colaboradores.length} colaboradores`,
    start:  new Date(
        diasSemanaData[dia].setHours(
           parseInt(moment(horario.inicio).format('HH')),
           parseInt(moment(horario.inicio).format('mm'))
        )
      ),
      end:  new Date(
        diasSemanaData[dia].setHours(
           parseInt(moment(horario.fim).format('HH')),
           parseInt(moment(horario.fim).format('mm'))
        )
      ),
   }))
 ).flat();

const setComponent = (component, state) => {
    dispatch(
        updateHorario({
        components: { ...components, [component]: state},
    })
  );
};

const setHorario = (key, value) =>{
    dispatch(
        updateHorario({
        horario: { ...horario, [key]: value},
    })
  );
}
  const save = () => {
    dispatch(addHorario())
  }

  const remove = () => {
    dispatch(removeHorario())
  }
   useEffect(() =>{
    //TODOS OS HORARIOS
    //TODOS OS SERVIÇOS
    dispatch(allHorarios())
    dispatch(allServicos())
   },[])

   useEffect(() =>{
    dispatch(filterColaboradores());
   }, [horario.especialidades])

    return (
      <div className='col p-5 overflow-auto h-100'>
        <Drawer
        show={components.drawer}
        size='sm'
        onHide={() => setComponent('drawer', false)}
        >
          <Drawer.Body>
            <h3>{behavior === "create" ? "Criar novo" : "Atualizar"} horario de atendimento</h3>
            <div className='row mt-3'>
              <div className='col-12'>
                <b>Dias da semana</b>
                <TagPicker
                size="lg"
                block
                value={horario.dias}
                data={diasDaSemana.map((label,value) => ({ label, value}))}
                onChange={(value) => {
                    setHorario('dias', value);
                }}
                />
                </div>  
                <div className='col-6 mb-3'>
                 <b className='d-block'>Horario Inicial</b>
                 <DatePicker
                 block
                 format='HH:mm'
                 hideMinutes={(min) => ![0, 30].includes(min)}
                 value={horario.inicio}
                 onChange={(e) => {
                    setHorario('inicio', e);
                 }}
                 />
              </div>
              <div className='col-6 mb-3'>
                 <b className='d-block'>Horario Final</b>
                 <DatePicker
                 block
                 format='HH:mm'
                 hideMinutes={(min) => ![0, 30].includes(min)}
                 value={horario.fim}
                 onChange={(e) => {
                    setHorario('fim', e);
                 }}
                 />
              </div>
              <div className='col-12 mt-3'>
                <b>Especoalidades disponiveis</b>
                <TagPicker
                size="lg"
                block
                data={servicos}
                value={horario.especialidades}
                onChange={(e) =>{
                    setHorario('especialidades', e)
                }}
                />
              </div>
              <div className='col-12 mt-3'>
                <b>Colaboradores disponiveis</b>
                <TagPicker
                size="lg"
                block
                data={colaboradores}
                value={horario.colaboradores}
                onChange={(e) =>{
                    setHorario('colaboradores', e)
                }}
                />
              </div>
            </div>
            <Button
            loading={form.saving}
            color={behavior === 'create' ? 'green' : 'primary'}
            size='lg'
            block
            onClick={() => save()}
            className='mt-3'
            >
             {behavior === 'create' ? "Salvar" : "Atualizar"} Horario
            </Button>
            {behavior === 'update' &&(
                <Button
                loading={form.saving}
                color='red'
                size='lg'
                block
                onClick={() => setComponent('confirmDelete', true)}
                className='mt-1'
                >
                 Remover Horario de Atendimento
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
        <div className='row'>
          <div className='col-12'>
              <div className=" w-100 d-flex justify-content-between">
                <h2 className="mb-4 mt-0">Horarios de atendimento</h2>
                   <div>
                        <button className="btn btn-primary btn-lg" onClick={() => {
                             dispatch(
                                updateHorario({
                                    behavior:'create',
                                })
                         );
                        setComponent('drawer', true);
                 }}>
                 <span className="mdi mdi-plus">Novo Horario</span>
               </button>  
               
              </div>
            </div>
      <Calendar 
        onSelectEvent={e => {
           dispatch(
            updateHorario({
              behavior: 'update'  
            })
           );
            dispatch(
                updateHorario({
                    horario: e.resource,
                })
            );
            setComponent('drawer', true);
        }}
         onSelectSlot={(slotInfo) => {
            const { start , end } = slotInfo;
            dispatch(
                updateHorario({
                    behavior: 'create',
                    horario: {
                        ...horario,
                        dias: [moment(start).day()],
                        inicio: start,
                        fim: end,
                    },
                })
            );
            setComponent('drawer', true)
         }}    
        localizer={localize}
        toolbar={false}
        formats={{
            dateFormat: 'dd',
            dayFormat:(date, culture, localize) => localize.format(date, 'dddd', culture),
        }}
        popup
        selectable
        events={[formatEvents]}
        date={diasSemanaData[moment('').day()]}
        view='week'         
        style={{ height: 600 }}
        />
          </div>  
        </div>
      </div>
    )
}
export default Horarios;