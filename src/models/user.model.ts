import mongoose from 'mongoose'
import {NextFunction} from 'express'
import bcrypt from 'bcrypt'
import config, { has } from 'config'

export interface IUser extends mongoose.Document{
  email: string,
  name: string,
  password: string,
  createdAt: Date,
  updatedAt: Date,
  comparePassword(candidatePassword: string) : Promise<boolean>
}

const userSchema  = new mongoose.Schema({
    email: {type: String, required:true},
    password: {
      type: String, 
      required:true,
    },
    name: {type: String, required:true},
  }, 
  {timestamps: true}
);

userSchema.pre("save", async function(next: any){
  let user = this as IUser;
  if(!user.isModified('password')){
    return next();
  }
  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'))
  const hash = await bcrypt.hashSync(user.password, salt);
  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function(candidatePassword:string): Promise<boolean> {
  const user = this as IUser;
  return bcrypt.compare(candidatePassword, user.password).catch((e:any) => false);
}

const UserModel = mongoose.model<IUser>('User', userSchema)
export default UserModel;