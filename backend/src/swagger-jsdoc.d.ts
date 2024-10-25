declare module 'swagger-jsdoc' {
    import { SwaggerDefinition, Options } from 'swagger-schema-official';

    function swaggerJsDoc(options: Options): SwaggerDefinition;

    export = swaggerJsDoc;
}
