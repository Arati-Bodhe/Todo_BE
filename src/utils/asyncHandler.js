
// const asyncHandler=(requestHandler)=>{
//      return (err,req,res,next)=>{
//         Promise.resolve(requestHandler(req,res,next)).catch((err)=> next(err))
//      }
// };


const asynHandler=(requestHandler)=>{  
   return (req,res,next)=>{
     Promise.resolve(requestHandler(req,res,next))
     .catch((err)=> {
       next(err)})
    }
 };
 export{asynHandler};