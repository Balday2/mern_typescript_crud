import { createSessionSchema } from './schema/session.schema';
import { createUserSchema } from './schema/user.schema';
import {Express, Request, Response } from 'express'
import { createUserHandler } from './controllers/user.controller';
import {validateRessource} from "./middleware/validateRessource"
import { createUserSessionHandler } from './controllers/session.controller';

function routes(app: Express){
  app.get("/healthcheck", (req: Request, res: Response) =>  res.sendStatus(200));
  app.post('/api/users', validateRessource(createUserSchema), createUserHandler)
  app.post('/api/sessions', validateRessource(createSessionSchema), createUserSessionHandler)
}

export default routes;