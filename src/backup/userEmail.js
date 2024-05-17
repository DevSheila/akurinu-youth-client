            // if(userEmail){
    
            //     //check if user email exists in database
            //     db.collection('users')
            //     .where('email', '==', userEmail)
            //     .limit(1)
            //     .get()
            //     .then(snapshot=>{
            //         if(!snapshot.docs.length){
            //             setError('User does not exist in firebase database')
            //             createUserByEmail(userEmail);
            //             console.error('User does not exist in firebase database')
            //     return
            //         } else {
            //             console.log('success 1')
    
            //             return {id: snapshot.docs[0].id, ...snapshot.docs[0].data()}
            //         }
            //     })
            //     .then(res=>{
            //         if(res){
            //             authsLocalStorage(res)

            //             console.log('success 2',res)
            //         }else {
            //             console.log('An error occured, please try again',res)
    
            //             setError('An error occured, please try again')
            //             setLoading(false)
            //         }
            //     })
            //     .catch(error=>{
            //             console.error('firebase error',error)
    
            //         setLoading(false)
            //         setError('An error occured, please try again')
            //         return
            //     }
            // )
            // }else{
            //     console.log('userEmail','no user email')
    
            // }
