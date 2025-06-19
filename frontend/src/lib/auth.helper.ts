import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const getCurrentUser = async () => {
  return new Promise((resolve) => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export const isAuthenticated = async() => {
  const user = await getCurrentUser();  
  console.log('User:', user);
  
  return user ? true : false;
}