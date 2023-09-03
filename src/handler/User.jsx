import React from 'react'
import {db} from '../firebase'
import {doc,getDoc,setDoc} from 'firebase/firestore'
class User{
  isLoggedIn = false;
  displayName = null;
  email = null;
  photoURL = null;
  #uid = null;
  #timer = {'worktime' : null,'breaktime' : null};
    
    async #initUser(){
            const docRef = doc(db, "timers",this.#uid);
            const res = await getDoc(docRef);
            if(res.exists()){
                return res.data();
            }
            else{
                const addDoc = await setDoc(doc(db, "timers", this.#uid), {
                    worktime: 25 * 60,
                    breaktime: 5 * 60,
                });
                return addDoc;
            }
    }

    constructor(){
        this.sync(true);
    }
    
    
    async sync(init = false){
      const user = JSON.parse(localStorage.getItem('user'));
      if(!user)
      {
        this.isLoggedIn = false;
        return;
      }
      this.displayName = user.displayName;
      this.email = user.email;
      this.photoURL = user.photoURL;
      this.#uid = user.uid;
      this.isLoggedIn = true;      
      await this.#initUser();
      if(!init){
        const timer = await this.getTimer();
        localStorage.setItem('worktime',timer.worktime)
        localStorage.setItem('breaktime',timer.breaktime)
      }else{
        const newWorkTime = localStorage.getItem('worktime');
        const newBreakTime = localStorage.getItem('breaktime');
        const timer = await this.updateTimer(newWorkTime,newBreakTime);
        this.#timer = timer;
      }
    }

    getUID(){
      return this.#uid;
    }
    async getTimer(){
      if(!this.isLoggedIn) return false;
      const docRef = doc(db,'timers',this.#uid);
      const getCurrTimer = await getDoc(docRef);
      console.log(getCurrTimer);
      this.#timer = getCurrTimer.data();
      return this.#timer;
    }
    async updateTimer(worktime, breaktime){
      if(!this.isLoggedIn) return false;
      const docRef = doc(db,'timers',this.#uid);
      this.#timer.worktime = worktime;
      this.#timer.breaktime = breaktime;
      const setTimer = await setDoc(docRef,this.#timer);
      return setTimer; 
    }
    logout(){
      localStorage.removeItem('user');
      localStorage.removeItem('worktime');
      localStorage.removeItem('breaktime');
      this.isLoggedIn = false;
      this.displayName = null;
      this.email = null;
      this.photoURL = null;
      this.#uid = null;
    }
}

const user = new User();

export default user