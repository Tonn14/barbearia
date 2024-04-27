import React from 'react';
import {FlatList} from 'react-native';
import Header from '../../components/Header/index';
import Servico from '../../components/Servico/index'
import util from '../../util';
import theme from '../../styles/theme.json'
import ModalAgendamento from '../../components/ModalAgendamento';



const Home = () => {
    return (
        <>
        <FlatList 
        style={{
            backgroundColor: util.toAlpha(theme.colors.muted, 10)
        }}
        ListHeaderComponent={Header}
        data={['a', 'b' , 'c' , 'd', 'e']}
        renderItem={({item}) => (<Servico key={item}/>)}
       keyExtractor={(item) => item}
        />
      <ModalAgendamento/>
     </>
    );
};
export default Home;