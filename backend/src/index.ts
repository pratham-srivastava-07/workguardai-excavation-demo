import express from "express"
import { PORT } from "./constants"
import cors from "cors"
import { router } from "./routes"
import { authRouter } from "./routes/auth"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/v1", router);
app.use("/api/auth", authRouter);

app.get("/", async (req: any, res: any) => {
    res.send("Hello")
})

app.listen(PORT, ()=> {
    console.log(`Server started at port ${PORT}`);
})