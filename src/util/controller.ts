import {Request, Response} from "express";

// eslint-disable-next-line @typescript-eslint/ban-types
export const tryCatchHelper = (func: Function) => {
    return async (req: Request, res: Response) => {
        let result;
        try {
            result = await func();
        }
        catch (e) {
            console.log("Request failed");
            console.log(e);
            return res.status(500).send();
        }
        return res.status(200).send(result);
    }
}