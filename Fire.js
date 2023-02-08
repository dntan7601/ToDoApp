import firebase from "firebase";
import '@firebase/firestore'
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { collection, onSnapshot, where, query } from "firebase/firestore"; 
import { enableIndexedDbPersistence } from "firebase/firestore"; 
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyDBFgK5OnSvPSES9MB_5fuDFFfLhC0xIYM",
    authDomain: "tododata-5ca3b.firebaseapp.com",
    projectId: "tododata-5ca3b",
    storageBucket: "tododata-5ca3b.appspot.com",
    messagingSenderId: "532453662954",
    appId: "1:532453662954:web:0c96058ce6aaab36e97793"
  };

 
class Fire {
    constructor(callback) {
        this.init(callback);
    }

    init(callback) {
        if (!firebase.apps.length) {
           firebase.initializeApp(firebaseConfig)
           
        }
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                callback(null,user)
            } else {
                firebase
                    .auth()
                    .signInAnonymously()
                    .catch((error) => {
                        callback(error);
                    })
            }
        })
    }

    
    
    getLists(callback) {
        let ref = this.ref.orderBy("name")
        this.unsubscribe = ref.onSnapshot(snapshot => {
            lists = []
    
            snapshot.forEach(doc => {
                lists.push({id: doc.id, ...doc.data()});
            })
            callback(lists);
        })
    }
    addList(list) {
        let ref = this.ref
        ref.add(list)
    }

    updateList(list) {
        let ref = this.ref
        ref.doc(list.id).update(list)
    }
    deleteList(id){
        let ref = this.ref
        console.log(ref.id)
        ref.doc(id).delete()
    }
    get userId() {
        return firebase.auth().currentUser.uid  
    }

    get ref () {
        return firebase
            .firestore()
            .collection('users')
            .doc(this.userId)
            .collection('lists');
    }
    detach () {
        this.unsubscribe();
    }
} 
export default Fire;