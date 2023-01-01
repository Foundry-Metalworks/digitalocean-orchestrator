import {Request, Response} from "express";
import axios, { AxiosInstance } from "axios";

// eslint-disable-next-line @typescript-eslint/ban-types
export const digitalOceanHelper = (func: (axios: AxiosInstance, name: string) => unknown) => {
    return async (req: Request, res: Response) => {
        let result;
        try {
            const authHeader = req.headers.authorization;
            const domainName = req.params.domainName;
            if (!authHeader || authHeader.startsWith("Bearer ")) {
                return res.status(401).send();
            }
            if (!domainName) return res.status(400).send();
            const axiosInstance = axios.create({
                baseURL: 'https://api.digitalocean.com/v2/',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authHeader
                }
            });
            result = await func(axiosInstance, domainName);
        }
        catch (e) {
            console.log("Request failed");
            console.log(e);
            return res.status(500).send();
        }
        return res.status(200).send(result);
    }
}