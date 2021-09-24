import { Request, Response } from "express";

import { generateSignInUrl, getGoogleAccountFromCode } from "../../../utils/google/google-utils";

import UsersDao from "../Data/mongo/users.dao";
import { MongoUser } from "../Entities/mongoUser.model";

export class AuthService {
    /**
     * Generate a sign-in url for google access
     */
     public googleAuth(req: Request, resp: Response) {
        const url = generateSignInUrl();

        resp.status(201).json({ 
            error: "Usuário não logado, necessário fazer login para acessar",
            url
        });
    }

    /**
     * gets the google sign-in result and get the user data from google api's
     */
    public async googleAuthResult(req: Request, resp: Response) {
        let { code } = req.query;
        
        if ( !code ) {
            resp.status(401).json({ error: "User not authenticated "})
        } else {
            code = code ? code.toString() : "" ;
            
            getGoogleAccountFromCode(code).then(async (result) => {
                if ( result ) {
                    const userInfo = result;
                    const userData = userInfo.user;

                    const saveUser = new MongoUser();
                    saveUser.assignGoogleResultValues(userData);

                    if ( saveUser.email ) {
                        const usersDB = new UsersDao();
                        const dbResult = await usersDB.createUser(saveUser);

                        if (( dbResult as any).error) {
                            resp.status(206).json(dbResult);
                        } else {
                            resp.status(201).json({ 
                                msg: `Bem vind@ ao speech to libras, ${userData?.names?.givenName}`
                            });
                        }
                    } else {
                        resp.status(206).json({ error: "Usuário com dados inválidos"})
                    }


                    // TODO Salvar os dados do usuário no bd (userData)
                    // TODO Fazer a gestão de acesso através do token
                    
                } else {
                    throw("User not authenticated");
                }
            });
        }
    }
}