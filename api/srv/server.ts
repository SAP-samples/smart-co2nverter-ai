import cds from "@sap/cds";
import express, { NextFunction, Request, Response } from "express";

cds.on("bootstrap", (app: unknown) => {
    const envs = process.env as any;
    const API_KEY_CAP = envs["API_KEY"];
    (app as express.Application).get("/*", (req: Request, res: Response, next: NextFunction) => {
        const API_KEY_HEADER = req.headers["api-key"];
        if (!API_KEY_CAP) {
            return res.status(500).send("CAP is not properly configured. Please add API_KEY to environment variables.");
        }
        if (!API_KEY_HEADER) {
            return res.status(400).send("api-key header is missing.");
        }
        if (API_KEY_CAP === API_KEY_HEADER) {
            return next();
        } else {
            return res.status(400).send("Wrong api-key.");
        }
    });
});
