import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { userService } from '../firebase/firestore';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password?: string) => Promise<void>;
  sendEmailLink: (email: string) => Promise<void>;
  completeEmailLinkSignIn: (email: string, link: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  ensureDemoUsersInFirestore: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: 'teacher001',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@dypsn.edu',
    role: 'teacher',
    department: 'Computer Science',
    accessLevel: 'basic',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+91 98765 43210',
    employeeId: 'CS001',
    joiningDate: '2020-01-15',
    designation: 'Assistant Professor'
  },
  {
    id: 'hod001',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@dypsn.edu',
    role: 'hod',
    department: 'Computer Science',
    accessLevel: 'approver',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+91 98765 43211',
    employeeId: 'CS002',
    joiningDate: '2018-06-01',
    designation: 'Head of Department'
  },
  {
    id: 'principal001',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@dypsn.edu',
    role: 'principal',
    department: 'Administration',
    accessLevel: 'full',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+91 98765 43212',
    employeeId: 'ADM001',
    joiningDate: '2015-03-10',
    designation: 'Principal'
  },
  {
    id: 'director001',
    name: 'Dr. Rajesh Patel',
    email: 'rajesh.patel@dypsn.edu',
    role: 'director',
    department: 'Administration',
    accessLevel: 'full',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+91 98765 43213',
    employeeId: 'ADM002',
    joiningDate: '2012-08-20',
    designation: 'Director'
  },
  {
    id: 'registrar001',
    name: 'Ms. Anjali Desai',
    email: 'anjali.desai@dypsn.edu',
    role: 'registrar',
    department: 'Administration',
    accessLevel: 'full',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+91 98765 43214',
    employeeId: 'ADM003',
    joiningDate: '2019-11-05',
    designation: 'Registrar'
  },
  {
    id: 'hr001',
    name: 'Mr. Arjun Kumar',
    email: 'arjun.kumar@dypsn.edu',
    role: 'hr',
    department: 'Human Resources',
    accessLevel: 'full',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+91 98765 43215',
    employeeId: 'HR001',
    joiningDate: '2021-02-28',
    designation: 'HR Manager'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure all demo users are in Firestore on app start
    const ensureDemoUsers = async () => {
      try {
        for (const demoUser of mockUsers) {
          const existingUser = await userService.getUser(demoUser.id);
          if (!existingUser) {
            console.log('[AuthContext] Creating demo user in Firestore on app start:', demoUser.email);
            await userService.createUser({
              ...demoUser,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              loginCount: 0
            });
          }
        }
      } catch (error) {
        console.error('[AuthContext] Error ensuring demo users on app start:', error);
      }
    };
    
    ensureDemoUsers();

    // Handle email link sign-in on app load
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');
      if (email) {
        completeEmailLinkSignIn(email, window.location.href);
      }
    }
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // User is signed in with Firebase
        try {
          // Try to get user data from Firestore
          const userData = await userService.getUser(firebaseUser.uid);
          
          if (userData) {
            setUser(userData);
            localStorage.setItem('dypsn_user', JSON.stringify(userData));
          } else {
            // Create basic user data for Firebase user
            const basicUserData: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              role: 'teacher', // Default role
              department: 'General',
              accessLevel: 'basic',
              isActive: true,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              loginCount: 1
            };
            
            // Save to Firestore
            await userService.createUser(basicUserData);
            setUser(basicUserData);
            localStorage.setItem('dypsn_user', JSON.stringify(basicUserData));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // Check for stored demo user
        const storedUser = localStorage.getItem('dypsn_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      // If password is provided, try Firebase Authentication (for demo fallback or legacy accounts)
      if (password) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // User data will be handled by the auth state listener
      } else {
        throw new Error('Passwordless sign-in requires email link. Use sendEmailLink.');
      }
    } catch (firebaseError: any) {
      // If Firebase auth fails, try demo accounts
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser) {
        // Save user data to Firestore
        try {
          console.log('[AuthContext] Demo user login:', foundUser.email);
          
          // Check if user already exists in Firestore
          const existingUser = await userService.getUser(foundUser.id);
          
          if (existingUser) {
            console.log('[AuthContext] Updating existing user:', foundUser.id);
            // Update existing user with new login info
            await userService.updateUser(foundUser.id, {
              lastLogin: new Date().toISOString(),
              loginCount: (existingUser.loginCount || 0) + 1
            });
          } else {
            console.log('[AuthContext] Creating new user in Firestore:', foundUser.id);
            // Create new user in Firestore
            await userService.createUser({
              ...foundUser,
              lastLogin: new Date().toISOString(),
              loginCount: 1,
              createdAt: new Date().toISOString()
            });
          }
          console.log('[AuthContext] User data saved to Firestore successfully');
        } catch (error) {
          console.error('Error saving user data to Firestore:', error);
          // Continue with login even if Firestore save fails
        }
        setUser(foundUser);
        localStorage.setItem('dypsn_user', JSON.stringify(foundUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailLink = async (email: string) => {
    setIsLoading(true);
    try {
      const actionCodeSettings = {
        url: window.location.origin,
        handleCodeInApp: true
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
    } finally {
      setIsLoading(false);
    }
  };

  const completeEmailLinkSignIn = async (email: string, link: string) => {
    setIsLoading(true);
    try {
      const result = await signInWithEmailLink(auth, email, link);
      window.localStorage.removeItem('emailForSignIn');
      // User data will be handled by the auth state listener
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      // Create complete user data
      const completeUserData: User = {
        id: firebaseUser.uid,
        name: userData.name || firebaseUser.displayName || email.split('@')[0],
        email: email,
        role: userData.role || 'teacher',
        department: userData.department || 'General',
        accessLevel: userData.accessLevel || 'basic',
        isActive: true,
        phone: userData.phone,
        employeeId: userData.employeeId,
        joiningDate: userData.joiningDate,
        designation: userData.designation,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        loginCount: 1
      };
      // Save to Firestore
      await userService.createUser(completeUserData);
      setUser(completeUserData);
      localStorage.setItem('dypsn_user', JSON.stringify(completeUserData));
    } catch (error: any) {
      console.error('Error creating user account:', error);
      throw new Error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out from Firebase:', error);
    }
    
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem('dypsn_user');
  };

  const ensureDemoUsersInFirestore = async () => {
    console.log('[AuthContext] Ensuring all demo users are in Firestore...');
    try {
      for (const demoUser of mockUsers) {
        const existingUser = await userService.getUser(demoUser.id);
        if (!existingUser) {
          console.log('[AuthContext] Creating demo user in Firestore:', demoUser.email);
          await userService.createUser({
            ...demoUser,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            loginCount: 0
          });
        } else {
          console.log('[AuthContext] Demo user already exists in Firestore:', demoUser.email);
        }
      }
      console.log('[AuthContext] All demo users ensured in Firestore');
    } catch (error) {
      console.error('[AuthContext] Error ensuring demo users in Firestore:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, login, sendEmailLink, completeEmailLinkSignIn, signUp, logout, isLoading, ensureDemoUsersInFirestore }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};