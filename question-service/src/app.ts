import { Application } from "express";
import { QuestionController } from "./controller/question.controller";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { QuestionService } from "./database/question.database";
import * as dotenv from "dotenv";

dotenv.config()

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setConfig();
    this.setMongoConfig();
    this.setControllers();
  }

  private setConfig() {
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(cors());
  }

  private setControllers() {
    // Creating a new instance of Question Controller
    const questionService = new QuestionService();
    const questionController = new QuestionController(questionService);

    // Telling express to use our Controller's routes
    this.app.use("/question", questionController.router);
  }

  private setMongoConfig() {
    mongoose.Promise = global.Promise;
    mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@mongo:27017/questions?authSource=admin`).
    catch(error => console.log(error));;
  }
}

export default new App().app;