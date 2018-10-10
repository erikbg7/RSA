import * as React from "react";
import {generateKeys} from './RsaLib'

export class KeyUI extends React.Component{
    render(){
        return (<button onClick={this.generateKey}>
            GO!
          </button>)
    }

    async generateKey(){
        console.log(await generateKeys(1024));
    }
}