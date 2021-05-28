import React from 'react';
import 'antd/dist/antd.css';
import { PageHeader,  Menu, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { BrowserRouter as   Router } from 'react-router-dom';
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage:"book"
    }
  }

  handleClick = (item) => {
    this.setState({
      currentPage:item.key
    },()=>{
      const token = localStorage.getItem('token');
      if(token === null){
        message.error("没有权限~")
      }else{
        if(item.key === "book")
          this.props.props.history.push('/')
        else if(item.key === "record")
          this.props.props.history.push('/auth')
      }
    })
  }
  render() {
    return (
      <div>
        <PageHeader
          className = "home_header"
          title="简易数据库系统"
          subTitle = "A Simple DBMS built by React & NodeJS"
        />
        <Router>
          <Menu onClick={this.handleClick}  mode="horizontal">
            <Menu.Item key = "book" icon={<MailOutlined />}>Book List</Menu.Item>
            <Menu.Item key = "record" icon={<MailOutlined />}>Send Record List</Menu.Item>
          </Menu>
        </Router>
      </div>
    )
  }
}
export default Header;
