function promptEngine(db, phoneNumber, txtMessage){
  return userFindOrCreate(db, phoneNumber).then(function(user){
    if(user.pending_question >= 11) return "All Done!"
    return insertMessage(db, txtMessage).then(function(){
      //console.log(parseTxt(txtMessage))
      if(user.pending_onboarding == 0){
        // user has been inserted if pending_onboarding is 0 incrent it
        // return the onboarding string
        return incrementPending(db, phoneNumber, "pending_onboarding").then(function(){
          // ask first onboarding question
          return onboarding[0]
        })
      }else if(user.pending_onboarding == 1 && parseTxt(txtMessage)){
        // first question has been asked
        // we need the response to be "true" so we check the txtMessage
        return incrementPending(db, phoneNumber, "pending_onboarding").then(function(){
          // ask second onboarding question
          return onboarding[1]
        })
      }else if(user.pending_onboarding == 1 && !parseTxt(txtMessage)){
        return "Sorry, invalid answer!"
      }else if(user.pending_onboarding == 2 && parseTxt(txtMessage)){
        // first question has been asked
        // we need the response to be "true" so we check the txtMessage
        return incrementPending(db, phoneNumber, "pending_onboarding").then(function(){
          return false
        })
      }else if(user.pending_onboarding == 2 && !parseTxt(txtMessage)){
        return "Sorry, invalid answer!"
      }else{
        return false
      }
    }).then(function(response){
      // if false then we're done with oboarding
      //console.log(response)
      if(response) return response
      return Promise.all([
        incrementPending(db, phoneNumber, "pending_question"),
        pushNewPersonalityString(db, user, txtMessage),
      ]).then(function(){
        var nextObjStr = user.pending_question+".a"
        var questionExists = dotty.exists(questions, nextObjStr)
        var question = dotty.get(questions, nextObjStr)
        //console.log(questionExists)
        //console.log(question)
        if(questionExists) return question
        return false
      })
    }).then(function(response){
      if(response) return response
      return "Sorry, We're all done, for now!"
    })
  })
}