import { verify  } from "https://deno.land/x/djwt@v2.4/mod.ts";
import { Context  } from "https://deno.land/x/oak/mod.ts";
import key from './key.ts';


const auth = async (ctx: Context, next: any) => {

    const headers: Headers = ctx.request.headers;
    // Taking JWT from Authorization header and comparing if it is valid JWT token, if YES - we continue, 
    // otherwise we return with status code 401
    const authorization = headers.get('x-access-token');
    if (!authorization) {
      ctx.response.status = 401;
      return;
    }
    const jwt = authorization;
    if (!jwt) {
      ctx.response.status = 401;
      return;
    }
    if (await verify(jwt, key)){
      await next();
      return;
    }
  
    ctx.response.status = 401;
    ctx.response.body = {message: 'Invalid jwt token'};
  }
  
  export default auth;