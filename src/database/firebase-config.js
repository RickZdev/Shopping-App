import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getFirestore, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where, getDoc, arrayRemove, arrayUnion, getDocs } from 'firebase/firestore'
import { getAuth, updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage'
import { ToastAndroid } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyCRrjMVXW0zRWWBxIM9NFrr-CjT5_Vgpcs",
  authDomain: "shopping-app-be469.firebaseapp.com",
  projectId: "shopping-app-be469",
  storageBucket: "shopping-app-be469.appspot.com",
  messagingSenderId: "780380821788",
  appId: "1:780380821788:web:a5bd10bb51ea131b8402d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);
const storage = getStorage(app)

// authentication
const addAuthenticatedUser = async (values, navigation) => {
  try {
    const { fullName, email, phoneNumber, password } = values;
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    navigation.goBack();
    await updateProfile(auth.currentUser, {
      displayName: fullName,
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/shopping-app-be469.appspot.com/o/images%2Favatar%2Favatar.jpg?alt=media&token=32022140-2a82-4c45-8a4b-9fe6f500eba4'
    })
    await addUserToDatabase(user, { phoneNumber })
  } catch (error) {
    console.log(error.message)
  }
}

const addUserToDatabase = async (user, additionalData) => {
  const { email, displayName, uid } = user;
  const { phoneNumber } = additionalData;

  // add user data to firestore with same authenticated id
  const userRef = query(doc(db, 'users', uid))
  try {
    await setDoc(userRef, {
      fullName: displayName,
      email,
      phoneNumber,
      cart: [],
      createdAt: serverTimestamp()
    })
  } catch (error) {
    console.log(error.message, "error creating user!")
  }
}

const addAuthProfile = async (imageUri) => {
  try {
    await updateProfile(auth.currentUser, {
      photoURL: imageUri,
    })
  } catch (error) {
    console.log(error.message)
  }
}

const loginUser = async (email, password, navigation) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    navigation.replace('HomeScreen');
  } catch (error) {
    console.log(error.message)
  }
}

const logoutUser = async (navigation) => {
  try {
    await signOut(auth)
    navigation.replace('LoginScreen');
  } catch (error) {
    console.log(error.message)
  }
}

// get database
const getPopular = (setPopularDb, popular, isMounted) => {
  if (isMounted) {
    const ref = query(collection(db, 'products'), where('popular', '==', popular))
    const ref2 = query(doc(db, 'popular', popular))
    onSnapshot(ref, async (snapshot) => {
      let tempDb = []
      snapshot.docs.forEach((doc) => {
        tempDb.push({ ...doc.data(), id: doc.id });
      })
      setPopularDb(tempDb)
      await updateDoc(ref2, {
        products: [...tempDb]
      })
    })
  }
}

const getCategories = (setCategories, categories, isMounted) => {
  const ref3 = query(collection(db, 'categories'))
  onSnapshot(ref3, snapshot => {
    let tempDb = []
    snapshot.docs.forEach((doc) => {
      tempDb.push({ ...doc.data(), id: doc.id })
    })
    setCategories(tempDb)
  })

  categories.map((item) => {
    const ref1 = query(doc(db, 'categories', item.id))
    const ref2 = query(collection(db, 'products'), where('categories', '==', item.id));
    onSnapshot(ref2, async (snapshot2) => {
      let tempDb = []
      snapshot2.docs.forEach((doc) => {
        tempDb.push({ ...doc.data(), id: doc.id })
      })
      await updateDoc(ref1, {
        products: [...tempDb]
      })
    })
  })

}

const getCart = (setCartDb, setTotal) => {
  const q = query(doc(db, 'users', auth.currentUser.uid));
  const unsubscribe = onSnapshot(q, snapshot => {
    let tempCartDb = []
    let tempTotalPrice = 0
    snapshot.data().cart.map((product) => {
      tempCartDb.push(product)
      tempTotalPrice += parseInt(product.totalPrice);
    })
    setTotal(tempTotalPrice)
    setCartDb(tempCartDb)

  })
  return unsubscribe;
}

const getNumberOfCart = (setNumberOfCart) => {
  const q = query(doc(db, 'users', auth.currentUser.uid));
  const unsubscribe = onSnapshot(q, snapshot => {
    let cartLength = snapshot.data()?.cart.length;
    setNumberOfCart(cartLength);
  })
  return unsubscribe;
}

const getLikes = (setIsLike, product, isMounted) => {
  if (isMounted) {
    const q = query(doc(db, 'products', product.id))
    const unsubscribe = onSnapshot(q, (docu) => {
      if (docu.data().likes.includes(auth.currentUser.uid)) {
        setIsLike(true)
      }
    });
    return unsubscribe;
  }
}

const getNumberOfLikes = (setNumberOfLikes, product, isMounted) => {
  if (isMounted) {
    const q = query(doc(db, 'products', product.id))
    const unsubscribe = onSnapshot(q, (product) => {
      setNumberOfLikes(product.data().likes.length)
    });

    return unsubscribe;
  }
}

// add to database
const addToCart = async (product, quantity, size) => {
  const q = query(doc(db, 'users', auth.currentUser.uid));
  const generatedId = Math.floor(Math.random() * 10000) + 1;
  const cartId = product.id + generatedId.toString();
  const totalPrice = quantity * product.price;
  await updateDoc(q, {
    cart: arrayUnion({ ...product, cartId, orderQuantity: quantity, orderSize: size, totalPrice, })
  })
}

const addToCategory = (categories) => {
  const q = query(collection(db, 'products'), where('categories', '==', categories))
  const unsubscribe = onSnapshot(q, async (snapshot) => {
    let categoryDb = []
    snapshot.docs.forEach((doc) => {
      categoryDb.push({ ...doc.data(), id: doc.id });
    })

    await updateDoc(doc(db, 'categories', categories), {
      products: [...categoryDb]
    })
  })

  return unsubscribe;
}

const addToPopular = (popular) => {
  const q = query(collection(db, 'products'), where('popular', '==', popular))
  const unsubscribe = onSnapshot(q, async (snapshot) => {
    let popularDb = []
    snapshot.docs.forEach((doc) => {
      popularDb.push({ ...doc.data(), id: doc.id });
    })

    await updateDoc(doc(db, 'popular', popular), {
      products: [...popularDb]
    })
  })

  return unsubscribe;
}

const addProducts = async (values, sizes, imageUri) => {
  const { categories, popular, description, quantity, productName, price } = values
  const createdAt = serverTimestamp()
  let imageURL = ''
  if (imageUri !== '') {
    const storageRef = ref(storage, `/images/products/${productName}`)

    const img = await fetch(imageUri);
    const bytes = await img.blob()

    await uploadBytes(storageRef, bytes, { contentType: 'image/jpg' })
    imageURL = await getDownloadURL(storageRef)
  }

  const productsCol = collection(db, 'products')
  await addDoc(productsCol, {
    categories, popular, description, quantity, productName, price, sizes, imageURL, createdAt, likes: []
  })

  addToCategory(categories)
  addToPopular(popular)
}

const addLike = async (isLike, setIsLike, product) => {
  const q = query(doc(db, 'products', product.id))
  if (isLike) {
    setIsLike(!isLike);
    await updateDoc(q, {
      likes: arrayRemove(auth.currentUser.uid)
    })
  } else {
    await updateDoc(q, {
      likes: arrayUnion(auth.currentUser.uid)
    })
  }
}

// delete to database
const deleteToCart = async (itemToDelete) => {
  const q = doc(db, 'users', auth.currentUser.uid)
  await updateDoc(q, {
    cart: arrayRemove(itemToDelete)
  });
  ToastAndroid.showWithGravityAndOffset(
    `${itemToDelete.productName} deleted successfully!`,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    0, 300)
}

export {
  auth, db, storage, addAuthenticatedUser, addAuthProfile, loginUser, logoutUser,
  getPopular, getCategories, getCart, getNumberOfCart, getLikes, getNumberOfLikes,
  addProducts, addToCart, addLike,
  deleteToCart
}