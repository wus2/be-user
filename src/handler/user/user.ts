import { Request, Response, NextFunction } from "express";

import UserDB, { IUserDB } from "../../plugins/database/user/user";
import Cache, { ICache } from "../../plugins/cache";
import Mailer, { IMailer } from "../../plugins/mailer";
import { Register } from "./register";
import { Login } from "./login";
import { LoginViaFB, LoginViaGG } from "./social";
import {
  GetProfile,
  UpdateProfile,
  UpdatePassword,
  ForgotPassword,
  UpdateAvatar
} from "./profile";
import { ValidateUsername, ValidatePassword } from "./validate";
import { ActivateAccount, ConfirmChange, ReclaimPassword } from "./callback";

export interface IUserHandler {
  register(req: Request, res: Response): void;
  login(req: Request, res: Response, next: NextFunction): void;
  loginViaFB(req: Request, res: Response): void;
  loginViaGG(req: Request, res: Response): void;
  getProfile(req: Request, res: Response): void;
  updateProfile(req: Request, res: Response): void;
  updatePassword(req: Request, res: Response): void;
  forgotPassword(req: Request, res: Response): void;
  updateAvatar(req: Request, res: Response): void;
  validateUsername(req: Request, res: Response): void;
  validatePassword(req: Request, res: Response): void;
  activateAccount(req: Request, res: Response): void;
  confirmChange(req: Request, res: Response): void;
  reclaimPassword(req: Request, res: Response): void;
}

export class UserHandler implements IUserHandler {
  userDB: IUserDB;
  cache: ICache;
  mailer: IMailer;
  activePrefix: string;

  constructor() {
    this.userDB = new UserDB();
    this.cache = new Cache();
    this.mailer = new Mailer();
    this.activePrefix = "active_account";
  }

  public register = Register.bind(this);
  public login = Login.bind(this);
  public loginViaFB = LoginViaFB.bind(this);
  public loginViaGG = LoginViaGG.bind(this);
  public getProfile = GetProfile.bind(this);
  public updateProfile = UpdateProfile.bind(this);
  public updatePassword = UpdatePassword.bind(this);
  public forgotPassword = ForgotPassword.bind(this);
  public updateAvatar = UpdateAvatar.bind(this);
  public validateUsername = ValidateUsername.bind(this);
  public validatePassword = ValidatePassword.bind(this);
  public activateAccount = ActivateAccount.bind(this);
  public confirmChange = ConfirmChange.bind(this);
  public reclaimPassword = ReclaimPassword.bind(this);
}
