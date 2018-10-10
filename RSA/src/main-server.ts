import * as Express from 'express';
import { Request, Response} from 'express'

let app = Express.default();
app.use(Express.json());

app.get('/firma',function(req:Request,res:Response):void{
})