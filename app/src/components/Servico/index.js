import React from 'react'
import { Text, Box, Touchable, Cover, Title, Button } from '../../styles'

const servico = () => {
    return ( 
    <Touchable 
    height='100px'
    hasPadding
    align="center"
    background="light">
     <Cover image="https://ath2.unileverservices.com/wp-content/uploads/sites/2/2020/10/20152143/pente-de-maquina-de-cortar-cabelo-1.jpg" />
     <Box direction="column">
        <Text bold color="dark">
         Corte de cabelo Maquina
        </Text>
        <Text small>
         R$ 45 • 40 mins
        </Text>
     </Box>
     <Box>
        <Button icon="clock-check-outline" theme={{ colors: { primary: '#FCA311' } }} mode='contained'>
        AGENDAR
        </Button>
     </Box>  
    </Touchable>
    );
}

export default servico;