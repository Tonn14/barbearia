import React from 'react';
import {Dimensions} from 'react-native'
import {Cover, GradientView, Title, Text, Badge, Box, Touchable , Button, TextInput} from '../../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import theme from '../../styles/theme.json'
const Header = () => {
    return ( 
        <>
    <Cover
    image="https://st3.depositphotos.com/10493024/16064/i/450/depositphotos_160643484-stock-photo-barber-shop-pole.jpg"
    width='100%'
    height="300px">
    <GradientView
     colors={['#21232F33', '#21232FE6']}
     hasPadding
     justify="flex-end">
    <Badge color="dark">ABERTO</Badge>
    <Title color="light">Xtudio Zero</Title>
    <Title color="primary">━━━━━━━━━━━</Title>
    <Title color="light">B A R B E A R I A</Title>
    <Text color='muted'>Salvador• 2.5kms</Text>   
     </GradientView>
    </Cover>
    <Box 
    background='light' 
    align='center'
    width={Dimensions.get('window').width}>
        <Box hasPadding justify="space-between">
            <Touchable width="30px" direction='column' align="center" spacing="0px 10px 0 0">
            <Icon name="phone" size={24} color={theme.colors.muted} /> 
            <Text small spacing='10px 0 0'>Ligar</Text> 
            </Touchable>

            <Touchable width="50px" direction='column' align="center">
            <Icon name="map-marker" size={24} color={theme.colors.muted} /> 
            <Text small spacing='10px 0 0'>
                Visitar
            </Text> 
            </Touchable>

            <Touchable width="50px" direction='column' align="center">
            <Icon name="share" size={24} color={theme.colors.muted} /> 
            <Text small spacing='10px 0 0'>
             Enviar
            </Text> 
            </Touchable>
        </Box>
        <Box
        hasPadding 
        direction="column" 
        align="center" 
        width="100px" 
        justify="center">
          <Button 
          icon="clock-check-outline"
          background="success"
          mode="contained"
          theme={{ colors: { primary: '#FCA311' } }}
          uppercase={false}>Agendar</Button>
          <Text small spacing="10px 0 0">
            Horarios disponiveis
        </Text>  
        </Box>
    </Box>
    <Box hasPadding direction='column' background="light" spacing="10px 0 0">
        <Title small>Serviços (5)</Title>
        <TextInput  placeholder='Digite o nome do serviço...' /> 
    </Box>
    </>
 );
}

export default Header;