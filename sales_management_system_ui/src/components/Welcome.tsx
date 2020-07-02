import React,{Component} from 'react';



export default function Welcome(props:any) {

      let user:any = sessionStorage.getItem('user');
      //console.log(user);
      if(user===null){
          props.history.push('/');
      }
      else{
          user=JSON.parse(user);
      }
      return (
          
          <>
              <div className='welcome'>
                  <h1>Hello, {user.profile.name}. Welcome back to the system!</h1>
                  
              </div>
          </>
  
          
      );

  }