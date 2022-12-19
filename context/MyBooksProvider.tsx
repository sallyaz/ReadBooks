import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// defining the type of our context with it's functions and properties
type MyBooksContextType = {
  onToggleSave: (book: Book) => void;
  isBookSaved: (book: Book) => boolean;
  savedBooks: Book[];
};

// initilize the context
const MyBooksContext = createContext<MyBooksContextType>({
  onToggleSave: () => {},
  isBookSaved: () => false,
  savedBooks: [],
});

// define the type of our children (the data that got pass into the context) and set it to ReactNode which is all the types like string, boolean etc..
type Props = {
  children: ReactNode;
};

const MyBooksProvider = ({ children }: Props) => {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]); // useState with Book type (ts definition)
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, [isLoaded]);

  // Load the data when the component is mount
  useEffect(() => {
    persistData();
  }, [savedBooks]);

  //   save data to local storeage
  const persistData = async () => {
    await AsyncStorage.setItem("booksData", JSON.stringify(savedBooks));
  };
  // read data from local storage
  const loadData = async () => {
    const dataString = await AsyncStorage.getItem("booksData");

    dataString && dataString
      ? setSavedBooks(JSON.parse(dataString))
      : setIsLoaded(true);
  };

  //checking the book by it's value and not referanse.
  const isBookEqual = (a: Book, b: Book) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };
  // if a book is saved or not.
  const isBookSaved = (book: Book) => {
    return savedBooks.some((savedBook) => isBookEqual(savedBook, book));
  };

  //   toggle save or unsave a book and save it to the state
  const onToggleSave = (book: Book) => {
    isBookSaved(book)
      ? setSavedBooks((books) =>
          books.filter((savedBook) => !isBookEqual(savedBook, book))
        )
      : setSavedBooks((books) => [book, ...books]); //adding the book into the rray of allready saved books using destructuring
  };
  return (
    <MyBooksContext.Provider value={{ onToggleSave, isBookSaved, savedBooks }}>
      {children}
    </MyBooksContext.Provider>
  );
};

// custom hook
export const useBooks = () => useContext(MyBooksContext);

export default MyBooksProvider;
