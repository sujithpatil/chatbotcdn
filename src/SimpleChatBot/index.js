import React from 'react';
import './index.css';
import axios from 'axios';
import Message from './Message';

class SimpleChatBot extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messages : [],
            showBot : false,
        }
        this.myRef = React.createRef();
        this.scrolldiv = React.createRef();
        axios.defaults.headers.common['Authorization'] = 'Bearer unb7yzbfrr1wo2819ldzi1ocqb71u5o4';
        const userData = localStorage && localStorage.getItem('mega-storage-cache');
        this.userName = (userData && JSON.parse(userData) && JSON.parse(userData).customer.fullname) || "Guest";
    }

    renderMessages = () => {
        const { messages } = this.state;
        return messages.map((message,index) => <Message table={message.table} onOptionSelected = { this.df_event_query } key = { index } speaks = {message.speaks} data={message.data} />)
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const inputValue = event.currentTarget[0].value;
        event.currentTarget[0].value = '';
        this.getStatus(inputValue);
    }

    closeChatBox = () => {
        this.setState({
            showBot: false
        })
    }

    getOpenChatBox = () => {
        const markup = ( 
        
            <div className="open-chat-container">
                <h3 className="heading"> 
                    <span> Virtual Assistant </span>
                    <span class="close-icon" onClick={this.closeChatBox} title="Close Chat"> </span>
                </h3>
                <div className="chat-list" ref={this.scrolldiv}>
                    {this.renderMessages()}
                </div>    
                <form onSubmit={ this.handleSubmit }>                                           
                    <div className="input-container">
                        <input className="input" disabled ref={this.myRef} style={{paddingLeft:"10"}} type="text" placeholder="Enter Id here"/>
                    </div>
            </form>                            
            </div>
        )
        return markup;
    }

    df_event_query = (text , enable=false) => {
                        axios
                            .post('https://afternoon-sierra-79133.herokuapp.com/api/df_event_query' , {event : text})
                            .then(responses=>{
                                
        if ( responses && responses.data ) {
            let array = [];
            
            if( enable ) {
                let userSays = {
                    speaks : 'user',
                    data : text
                };
                array.push(userSays);
            }
            for ( let msg of responses.data.fulfillmentMessages ) {
                let data = msg.text ? msg.text.text[0].replace('{name}' , this.userName) : msg.payload.fields;
                let says = {
                    speaks : 'Jarvis',
                    data : data
                };
                array.push(says);
            }
            this.setState({
                messages : [...this.state.messages , ...array],
                showBot : true,
                type : enable && text
            })
        } 
        if( enable ) {
            this.myRef.current.removeAttribute('disabled');
            this.myRef.current.focus();
        }
        this.scrollToBottom();
        });

    }

    getStatus = (value) => {
        const { type } = this.state;
        let host = "https://ma2610ap.adobesandbox.com";
        let path;

        if( type === 'order') {

            path = host + "/rest/V1/orders/" + value;

            axios.get("https://afternoon-sierra-79133.herokuapp.com/api/getstatus/value")
            .then(response => response.data)
            .then(data=> {
                let says = [
                    {
                        speaks : 'user',
                        data : "You requested for order status " + value
                    },
                    {
                        speaks : 'Jarvis',
                        data : "Your order status is " + data.status
                    }
            ];
                this.setState({
                    messages : [...this.state.messages, ...says]
                },()=>{
                    this.scrollToBottom();
                })
            });

        } else if ( type === 'inventory' ) {
            
            path = host + "/rest/V1/stockStatuses/" + value;
            axios.get("https://afternoon-sierra-79133.herokuapp.com/api/getinventory/value")
            .then(response => response.data)
            .then(data=> {
                let says = [
                    {
                        speaks : 'user',
                        data : "You requested for inventory status " + value
                    },
                    {
                    speaks : 'Jarvis',
                    table : true,
                    data : {
                        "Quantity" : data.stock_item.qty,
                        "In Stock" : data.stock_item.is_in_stock ? "YES" : "NO"
                        }
                    }
            ];
                this.setState({
                    messages : [...this.state.messages, ...says]
                },()=>{
                    this.scrollToBottom();
                })
            });
        }
    }

    scrollToBottom = () => {
        this.scrolldiv.current.scrollTop = this.scrolldiv.current.scrollHeight;
    }

    openChat = () => {
       this.df_event_query('Welcome');       
    }

    getClosedChatBot = () => {
        const markup = <div className="closed-chat-container" onClick={this.openChat}>
            <span className="open-chat"> Virtual Assistant </span>
        </div>
        return markup;
    }

    render () {

        const markup = this.state.showBot ? this.getOpenChatBox() : this.getClosedChatBot();

        return <div className="simple-chat-container">
            { markup }
        </div>
    }
}

export default SimpleChatBot;