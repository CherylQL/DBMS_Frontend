import React from 'react';
import { Input, Modal, Form, message } from 'antd';
import 'antd/dist/antd.css';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      loginModal:  localStorage.getItem('token') === null ? true : false,
      loginData: [],
      token: localStorage.getItem('token'),
    }
  }

  loginRef = React.createRef();
  handleLogin = ()=>{
    this.setState({
      loginData: this.loginRef.current.getFieldValue(),
      loginModal: false,
    },()=>{
      const url = "http://localhost:7001/login"
      fetch(url,{
        method: 'POST',
        body: JSON.stringify(this.state.loginData),
        mode:'cors',
        headers: new Headers({
          'Content-Type': 'application/json',
          // eslint-disable-next-line
          'Authorization': 'Bearer ${token}',
        })
      }).then(res=>{
        return res.json();
      }).then(res=>{
        if(res.res.status === 200) {
          message.success("欢迎登录！管理员！")
          this.setState({token: res.res.token},()=>{
            localStorage.setItem('token', res.res.token);
          })
        }else if(res.res.status === 300) {
          message.error("找不到这一号人~")
        }else if (res.res.status === 301) {
          message.success("欢迎回来！"+res.res.name )
        }

      })
    })
  }
  render () {
    return (
      <div>
        <Modal
          title="登录 Login"
          centered
          visible={this.state.loginModal}
          onOk={this.handleLogin}
          onCancel={() => this.setState({loginModal:false})}
          width={700}
        >
          <Form
            name="loginEditor"
            ref={this.loginRef}
          >
            <Form.Item
              label = "账号"
              key = "UserID"
              name = "UserID"
              rule = {[{required: true, message: "Please input book's id"}]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label = "密码"
              name = "Password"
              key = "Password"
              rule = {[{required: true, message: "Please input student's name"}]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Login;
