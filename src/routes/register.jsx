import React from 'react';
import 'antd/dist/antd.css';
import './auth.css';
import Header from '../components/header.jsx';
import {Form, Input, Button} from "antd";

class  Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            RegisterRef:[]
        }
    }
    RegisterRef = React.createRef();
    render() {
        const onFinish = (values) => {
            console.log('Success:', values);
        };

        const onFinishFailed = (errorInfo) => {
            console.log('Failed:', errorInfo);
        };
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const tailLayout = {
            wrapperCol: { offset: 8, span: 16 },
        };
        return(
            <div>
                <Header />
                <Form
                    {...layout}
                    name="loginEditor"
                    ref={this.RegisterRef}
                >
                    <Form.Item
                        {...tailLayout}
                        label = "账号"
                        key = "UserID"
                        name = "UserID"
                        rule = {[{required: true, message: "Please input book's id"}]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        {...tailLayout}
                        label = "密码"
                        name = "Password"
                        key = "Password"
                        rule = {[{required: true, message: "Please input student's name"}]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        {...tailLayout}
                    >
                        <Button type="primary" htmlType="submit" onClick={()=>{alert("Success!"); console.log(this.RegisterRef.current.getFieldValue())}}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
export default Register;
