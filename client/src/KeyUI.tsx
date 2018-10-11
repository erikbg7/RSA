import * as React from "react";
import {generateKeys, PrivateKey} from './RsaLib'
import KeyInfo from './KeyInfo'
import * as bigInt from 'big-integer'

export class KeyUI extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modLength:1024,
            keys:null,
            showInfo:false
        };
        this.newKey = this.newKey.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onClickShowInfo = this.onClickShowInfo.bind(this);
        this.loadKey = this.loadKey.bind(this);
        this.saveKey = this.saveKey.bind(this);
    }

    state:{
        keys:PrivateKey|null,
        modLength:number,
        usedLength?:number,
        showInfo:boolean
    };

    newKey(e){
        e.preventDefault();
        let tempKey = generateKeys(this.state.modLength);
        this.setState({keys:tempKey,
            usedLength:this.state.modLength});
        console.log(tempKey.publicKey.encrypt(bigInt('54321678555555555555555555555555555555555555555555555555555555555555555')))
    }
    saveKey(event){
       window.localStorage.setItem('Key',JSON.stringify(this.state.keys));
       window.localStorage.setItem('usedLength',this.state.usedLength.toString());
       this.setState({});
    }
    loadKey(event){
        this.setState({keys:JSON.parse(window.localStorage.getItem('Key'))})
        this.setState({usedLength:parseInt(window.localStorage.getItem('usedLength'))})
    }

    onChangeInput(event){
        event.preventDefault()
        this.setState({modLength:event.target.value})
    }

    onClickShowInfo(event){
        //event.preventDefault();
        this.setState({showInfo:!this.state.showInfo})
    }

    render(){
        return (
            <div>
                {this.state.showInfo&&
                <KeyInfo keys={this.state.keys} bitLength={this.state.usedLength}/>}
                
                <table>
                    <tbody>
                        <tr>
                            <td>
                                {window.localStorage.getItem('Key')!=undefined&&
                                <button type="button" onClick={this.loadKey}>
                                   Load RSA keys
                                </button>}
                            </td>
                            <td>
                                {this.state.keys!=null&&
                                <button type="button" onClick={this.saveKey}>
                                    Save Keys
                                </button>}
                            </td>
                            <td>
                                {this.state.showInfo&&(
                                <button type="button" onClick={this.onClickShowInfo}>
                                    Close
                                </button>)}

                                {(!this.state.showInfo&&this.state.keys!=null)&&
                                (<button type="button" onClick={this.onClickShowInfo}>
                                    Show
                                </button>)}
                            </td>
                        </tr>
                    </tbody>
                </table>
                

                <form onSubmit={this.newKey}>
                    <input type="input" onChange={this.onChangeInput}/>                    
                    <input type="submit" value="Create" />
                </form>
            </div>
        )
     }

}