import React from 'react';
import './message.css';

class Message extends React.Component {

    getStringMarkUp = (data) => {
        return <div className="message">
            <span>{ data } </span>
        </div>
    }

    getOptionData = (data) => {
        return (
            <div className="message">
            <span>{ data.message.stringValue } </span>
            <div className="user-options">
                { 
                    data.options.listValue.values.map((option,index) =><div onClick={()=>{ this.props.onOptionSelected(option.structValue.fields.value.stringValue , true) }} className="option" key={index} > {option.structValue.fields.label.stringValue} </div>)
                }
            </div>
        </div>
        )
    }

    getTabularData = (data) => {

        const keys = Object.keys(data);

        return (
            <table className="inv-details">
                <thead>
                    <tr>
                        <th colSpan="2">Inventory Details</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        keys.map((key,index) =>(
                            <tr key={index}>
                                <td>{ key }</td>
                                <td>{ data[key] }</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        );
    }

    getOptionsMarkUp = (data , table) => {
        const markup = table ? this.getTabularData(data) : this.getOptionData(data);
        return markup;
    }

    render() {

        const { speaks , data , table } = this.props
        const className = `message-row ${table ? 'table' :''}`;
        const userClass = `speaker ${speaks}`

        return (
            <div className={className}>
                <div className={userClass}> <span>{ speaks }</span></div>
                {
                    typeof data === "string" ? this.getStringMarkUp(data) : this.getOptionsMarkUp(data , table)
                }
            </div>
        )
    }

}

export default Message;