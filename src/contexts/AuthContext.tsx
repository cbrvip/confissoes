import { ReactNode, createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../services/firebaseConnection';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface AuthProviderProps {
  children: ReactNode;
}

type AuthContextData = {
  signed: boolean;
  loadingAuth: boolean;
  handleInfoUser: ({ name, email, uid, username, photo }: UserProps) => void;
  user: UserProps | null;
};

interface UserProps {
  uid: string;
  name: string | null;
  email: string | null;
  username: string | null;
  photo: string | null;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const q = query(collection(db, 'users'), where('uid', '==', userAuth.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUser({
            uid: userAuth.uid,
            name: userData.name,
            email: userAuth.email,
            username: userData.username,
            photo: userData.photo
          });
        } else {
          // Handle the case when user data is not found in Firestore
        }
      } else {
        setUser(null);
      }

      setLoadingAuth(false);
    });

    return () => {
      unsub();
    };
  }, []);

  function handleInfoUser({ name, email, uid, username, photo }: UserProps) {
    setUser({
      name,
      email,
      uid,
      username,
      photo
    });
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loadingAuth,
        handleInfoUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;