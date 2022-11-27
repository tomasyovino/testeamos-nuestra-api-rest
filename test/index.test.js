import mongoose from "mongoose";
import supertest from "supertest";
import { expect } from "chai";
import { generateProduct } from "./generator/products.generator.js";
import app from "../server.js";

let request;
let server;

describe("Test API REST FULL", () => {
    before(async function() {
        await connectDB();
        server = await startServer();
        request = supertest(
            `http://localhost:${server.address().port}/api/products`
        );
    });

    after(function() {
        mongoose.disconnect();
        server.close();
    });

    describe("GET", () => {
        it("Debería retornar un status 200", async () => {
            const response = await request.get("/");
            expect(response.status).to.eql(200);
        });
    });

    describe("POST", () => {
        it("Debería agregar un producto", async () => {
            const product = generateProduct();

            const response = await request.post("/").send(product);
            expect(response.status).to.eql(200);

            const productBody = response._body;
            expect(productBody).to.include.keys("title", "price", "thumbnail", "quantity", "_id", "__v");
            expect(productBody.title).to.eql(product.title);
            expect(productBody.price).to.eql(product.price);
            expect(productBody.thumbnail).to.eql(product.thumbnail);
            expect(productBody.quantity).to.eql(product.quantity);
        });
    });

    describe("PUT", () => {
        it("Debería actualizar el primer producto existente", async () => {
            const getAllProducts = await request.get("/");
            let productUpdate = generateProduct();
            const product = getAllProducts._body[0];
            productUpdate._id = product._id;
            productUpdate.__v = product.__v;

            const response = await request.put("/").send(productUpdate);
            expect(response.status).to.eql(200);

            const productUpdated = response._body;
            expect(productUpdated).to.include.keys("title", "price", "thumbnail", "quantity", "_id", "__v");
            expect(productUpdated.title).to.eql(productUpdate.title);
            expect(productUpdated.price).to.eql(productUpdate.price);
            expect(productUpdated.thumbnail).to.eql(productUpdate.thumbnail);
            expect(productUpdated.quantity).to.eql(productUpdate.quantity);
        });
    });

    describe("DELETE", () => {
        it("Debería eliminar el primer producto existente", async () => {
            const getAllProducts = await request.get("/");
            const product = getAllProducts._body[0];
            const response = await request.delete("/").send(product);
            expect(response.status).to.eql(200);
        });
    });
});


async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://tomyov24:Alessandro.24@cluster0.zft9dcg.mongodb.net/?retryWrites=true&w=majority");
        console.log("Base de datos conectada!");
    } catch (err) {
        throw new Error(`Error de conexión en la base de datos: ${err}`);
    };
};

async function startServer() {
    return new Promise((resolve, reject) => {
        const PORT = 0;
        const server = app.listen(PORT, () => {
            console.log(
                `Servidor express escuchando en el puerto ${server.address().port}`
            );
            resolve(server);
        });
        server.on("error", (err) => {
            console.log(`Error en el servidor ${err}`);
            reject(err);
        });
    });
};