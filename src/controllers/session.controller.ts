import { Request, Response } from "express";
import { createSession } from "../services/session.service";
import { validatePassword } from "../services/user.service";
import { signJwt } from "../utils/jwt";
import config from "config"



export async function createUserSessionHandler(req: Request, res: Response) {
  
  // Validate the users's password 
  const user = await validatePassword(req.body)

  if(!user)
    return res.status(401).send("Invalid email or password")

  // create a session 
  const session = await createSession(user._id, req.get("user-agent") || "");

  // create an access token 
  const accessToken = signJwt(
    {...user, session: session._id},
    {expiresIn: config.get("accessTokenTtl")} // 15 minutes
  )

  // create an refresh token 
  const refreshToken = signJwt(
    {...user, session: session._id},
    {expiresIn: config.get("accessTokenTtl")} // 1 year
  )

  // return access & refresh tokens
  return res.send({accessToken, refreshToken})

}