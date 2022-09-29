import { UnAuthenticatedError } from "../errors/index.js";

const checkPermissons=(requestUser,ressourceUserId)=>{
if(requestUser.userId === ressourceUserId.toString()) return
throw new UnAuthenticatedError('Not Authorized to access this route ')
}

export default checkPermissons
