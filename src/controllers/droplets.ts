import { Request, Response } from "express";
import service from "../services/droplets";

// eslint-disable-next-line @typescript-eslint/ban-types
const tryCatchHelper = (func: Function) => {
    return async (req: Request, res: Response) => {
        let result;
        try {
            result = await func();
        }
        catch (e) {
            console.log(e);
            return res.status(500).send();
        }
        return res.status(200).send(result);
    }
}

const onStatusRequest = tryCatchHelper(async () => {
    const id = await service.getDropletId();
    return await service.getDropletStatus(id.id);
});

const onStopRequest = tryCatchHelper(async () => {
    const id = await service.getDropletId();
    return await service.stopDroplet(id.id);
});

const onStartRequest = tryCatchHelper(async () => {
    return await service.startDroplet();
});

const onIPRequest = tryCatchHelper(async () => {
    const id = await service.getDropletId();
    return await service.getDropletIP(id.id);
})

export default {
    onStatusRequest,
    onStopRequest,
    onStartRequest,
    onIPRequest
}