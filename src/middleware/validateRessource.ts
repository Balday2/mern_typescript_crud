import {NextFunction, Request, Response } from 'express'
import {AnyZodObject} from 'zod'

export const validateRessource = (schema: AnyZodObject) => (req:Request, res: Response, next: NextFunction) => {

  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    })
    next()
  } catch (er: any) {
    return res.status(400).send(er.errors)
  }
}