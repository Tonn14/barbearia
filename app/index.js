import  React from 'react'
import { AppRegistry} from 'react-native';
import Home from './src/pages/Home';
import {name as appName} from './app.json';
import {fonts } from './src/styles/theme.json'
import { Provider as StoreProvider} from 'react-redux'
import { DefaultTheme, configureFonts, Provider as PapelProvider } from 'react-native-paper';
import store from './src/store';

const theme = {
    ...DefaultTheme,
    fonts: configureFonts({
       ios: fonts,
       android: fonts,

    }),
    
}

const App = () => {
    return (
        <StoreProvider store={store}>
         <PapelProvider theme={theme}>
            <Home />          
         </PapelProvider>   
        </StoreProvider>
    );
};

AppRegistry.registerComponent(appName, () => App);
