import {
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
} from "react-native";

import { useState } from "react";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import { gql, useLazyQuery } from "@apollo/client";
import BookItem from "../components/BookItem";

const query = gql`
  query SearchBooks($q: String) {
    googleBooksSearch(q: $q, country: "US") {
      items {
        id
        volumeInfo {
          authors
          averageRating
          description
          imageLinks {
            thumbnail
          }
          title
          subtitle
          industryIdentifiers {
            identifier
            type
          }
        }
      }
    }
    openLibrarySearch(q: $q) {
      docs {
        author_name
        title
        cover_edition_key
        isbn
      }
    }
  }
`;
export default function TabOneScreen() {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState<'googleBooksSearch' | 'openLibrarySearch'>("googleBooksSearch");
  const [runQuery, { data, loading, error }] = useLazyQuery(query);

  const parsedBook = (item: any) : Book => {
    if(provider == 'googleBooksSearch'){
      return {
        image: item?.volumeInfo?.imageLinks?.thumbnail,
        title: item?.volumeInfo?.title,
        authors: [item?.volumeInfo?.authors],
        isbn: item?.volumeInfo?.industryIdentifiers?.[0]?.identifier,
      }}
      return {
        image: `https://covers.openlibrary.org/b/olid/${item?.cover_edition_key}-M.jpg`,
        title: item?.title,
        authors: [item?.author_name],
        isbn: item?.isbn?.[0],
      }
      }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          value={search}
          placeholder="Search..."
          style={styles.input}
          onChangeText={setSearch}
        />
        <Button
          title="Search"
          onPress={() => runQuery({ variables: { q: search } })}
        />
      </View>

      <View style={styles.tabs}>
        <Text style={provider == 'googleBooksSearch' ? {fontWeight: 'bold', color: 'royalblue'} : {}} onPress={()=> setProvider('googleBooksSearch')} >Google Books</Text>
        <Text style={provider == 'openLibrarySearch' ? {fontWeight: 'bold', color: 'royalblue'} : {}}  onPress={()=> setProvider('openLibrarySearch')}>Open Library</Text>
      </View>
      {loading && <ActivityIndicator />}
      {error && (
        <View style={styles.container}>
          <Text style={styles.title}>Error fetching books</Text>
          <Text>{error.message}</Text>
        </View>
      )}
      <FlatList
        data={(provider == 'googleBooksSearch' ? data?.googleBooksSearch?.items : data?.openLibrarySearch?.docs) || []}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BookItem
          book={parsedBook(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gainsboro",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 50,
  },
});
