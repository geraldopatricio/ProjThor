declare module 'swagger-ui-express' {
    import { RequestHandler } from 'express';

    export function serve(
        req: Request,
        res: Response,
        next: NextFunction
    ): RequestHandler;

    export function setup(
        swaggerDoc: object,
        options?: object
    ): RequestHandler;
}
