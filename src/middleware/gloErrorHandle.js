import { resfrmt } from "../utils/resfrmt.js";

export function globalErrorHandle(err, req, res, next){
    res.status(500).send(resfrmt(true, 500, err.message, {}));
}