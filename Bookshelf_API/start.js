'use strict';

const Hapi = require('@hapi/hapi');
const handlers = require('./src/handlers')
const init = async () => {

    const server = Hapi.server({
        port: 9000,
        host: 'localhost'
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);

    //get book */
    /* all book */
    server.route({
        method: "GET",
        path: "/books",
        handler: handlers.getBuku,
    });

    /* with id */
    server.route({
        method: "GET",
        path: "/books/{id}",
        handler: handlers.getBuku,
    });

    //add book
    server.route({
        method: "POST",
        path: "/books",
        handler: handlers.AddBuku
    })

    //update book
    server.route({
        method: "PUT",
        path: "/books/{id}",
        handler: handlers.updateBuku
    })

    //delete book
    server.route({
        method: "DELETE",
        path: "/books/{id}",
        handler: handlers.deleteBuku
    })
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();