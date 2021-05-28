import React from 'react';
import 'antd/dist/antd.css';
import { PageHeader,  Menu, message, Button } from 'antd';
import { HomeOutlined, BarsOutlined, DeleteRowOutlined } from '@ant-design/icons';
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
      if(item.key === "del_token"){
        message.success('token has been removed')
      }
      else if(token === null){
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
          title="图书管理系统"
          subTitle = "A Simple DBMS built by React & NodeJS"
        />
        <Router>
          <Menu onClick={this.handleClick}  mode="horizontal">
            <Menu.Item key = "book" icon={<HomeOutlined />}>Book List</Menu.Item>
            <Menu.Item key = "record" icon={<BarsOutlined />}>Record List</Menu.Item>
            <Menu.Item key = "del_token" icon={<DeleteRowOutlined />}>
              <Button type="link" size='large' onClick={ ()=> localStorage.removeItem('token') }>
                Delete token
              </Button>
            </Menu.Item>
          </Menu>
        </Router>
      </div>
    )
  }
}
export default Header;
