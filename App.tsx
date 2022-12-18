import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";


const API_KEY = "mounteliza::stepzen.net+1000::46da93dc5972b3c5f265ba6b206c4d481c41e0a25bee9ee06a4582780a955968";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "https://mounteliza.stepzen.net/api/newbie-quoll/__graphql",
  headers: {
    Authorization: `Apikey ${API_KEY}`,
  },
  cache: new InMemoryCache(),
});

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </ApolloProvider>
      </SafeAreaProvider>
    );
  }
}
