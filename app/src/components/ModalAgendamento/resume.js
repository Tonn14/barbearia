import React from 'react';
import { Text, Title, Spacer, Box, Cover} from '../../styles'
import theme from '../../styles/theme.json'
import util from '../../util';

const Resume = () => {
    return (
        <Box align='center' hasPadding background={util.toAlpha(theme.colors.muted, 5)}>
            <Cover
                width="80px"
                height="80px"
                image="https://i0.wp.com/www.canalmasculino.com.br/wp-content/uploads/2017/03/corte-cabelo-masculino-curtos-06-570x570.jpg?resize=570%2C570"
            />
            <Box direction="column">
                <Title small>Corte de cabelo maquina</Title>
                <Spacer size="4px" />
                <Text small>Total: R$ 40.00</Text>

            </Box>
        </Box>
    )
}
export default Resume;