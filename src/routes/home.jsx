import React from 'react';
import { Table, Input, Button, Space, Modal, Form, message } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './home.css';
import Login from './login.jsx';
import Header from '../components/header.jsx';

class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchText:'',
      searchedColumn:'',
      show_add_modal: false,
      db_data: [],
      modal_data: [],
      add_update: null //both use the same modal, while `add_update`=false means add, else it means update
    }
    console.log("ppp",this.props)
    fetch("http://localhost:7001/find",{method:"post"}).then(res => {
      return res.json();
    }).then(res => {
      this.setState({db_data:res.res.map(i=>{return {...i,opt:this.Opt(i.BookNo),key:i.BookNo}})})
    })
  }
  onDelete = (b_id, that) => {
    const token = localStorage.getItem('token');
    if(token === null) 
      return message.error("宁不是管理员噢~")
    let url = "http://localhost:7001/sql/deleteBook"
    fetch(url, {
      method: "POST",
      body:JSON.stringify({b_id}),
      mode:'cors',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      })
    }).then(response => {
      return response.json();
    }).then(function (result) {
      if(result.status === 200) {
        message.success("Delete item success!")
        that.setState({db_data:result.res.map(i=>{return {...i,opt:that.Opt(i.BookNo),key:i.BookNo}})},()=>{
          that.forceUpdate()
        })
      } else if(result.status === 500){
        message.error(result.errMsg.sqlMessage)
      }
    }).catch(function (err) {
      console.log("Request failed", err)
      message.error("Request failed due to some problems")
    })
  }
  handleUpdate = (that) => {
    const token = localStorage.getItem('token');
    if(token === null)
      return message.error("宁不是管理员噢~")
    this.setState({
      modal_data:this.formRef.current.getFieldValue(),
      show_add_modal:false
    },()=> {
      fetch("http://localhost:7001/sql/updateBook",{
        method: "POST",
        body:JSON.stringify({...this.state.modal_data, oldid:this.state.add_update}),
        mode:'cors',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if(result.status === 200) {
          message.success("update item success!")
          that.setState({db_data:result.res.map(i=>{return {...i,opt:that.Opt(i.BookNo),key:i.BookNo}})},()=>{
            that.forceUpdate()
          })
        } else if(result.status === 500){
          message.error(result.errMsg.sqlMessage)
        }
      })
      .catch(function (err) {
        console.log("Request failed", err)
      })
    })
  }
  Opt = (b_id)=>(
    <div>
      <Space size = "middle">
        <Button 
          type="link" 
          onClick = {()=>this.onDelete(b_id, this)}
        >
          delete
        </Button>
      </Space>
      <Space marginleft = "10px">
        <Button 
          type="link"
          onClick = {()=>
            this.setState({
              add_update : b_id,
              show_add_modal : true
            })
          }
        >
          edit
        </Button>
      </Space>
    </div>
  )
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };
  handleOK = () => {
    if(this.state.add_update == null) {
      this.handleAdd(this);
    } else {
      this.handleUpdate(this);
    }
  };
  handleAdd = (that) => {
    const token = localStorage.getItem('token');
    this.setState({
      modal_data:this.formRef.current.getFieldValue(),
      show_add_modal:false
    },()=> {
      fetch("http://localhost:7001/add",{
        method: "POST",
        body:JSON.stringify(this.state.modal_data),
        mode:'cors',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if(result.status === 200) {
          message.success("Add item success!")
          that.setState({db_data:result.res.map(i=>{return {...i,opt:that.Opt(i.BookNo),key:i.BookNo}})},()=>{
            that.forceUpdate()
          })
        } else if(result.status === 500){
          message.error(result.errMsg.sqlMessage)
        }
      })
      .catch(function (err) {
        console.log("Request failed", err)
        message.error("Request failed due to some problems")
      })
    })
  }
  handleAddCancel = ()=>{
    this.setState({
      show_add_modal:false
    })
  }
  handleMenuChange = (e)=>{
    this.setState({ currentPage : e.key })
  }
  
  formRef = React.createRef();
  render(){
    const db_structure = [
      {
        title:'图书编号 BookNo',
        dataIndex:'BookNo',
        key:'BookNo',
        width:'15%',
        ...this.getColumnSearchProps('BookNo')
      },
      {
        title:'图书类别 BookType',
        dataIndex:'BookType',
        key:'type',
        width:'12%',
        ...this.getColumnSearchProps('type')
      },
      {
        title:'图书名称 BookName',
        dataIndex:'BookName',
        key:'name',
        width:'12%',
        ...this.getColumnSearchProps('name')
      },
      {
        title:'出版社 Publisher',
        dataIndex:'Publisher',
        key:'publisher',
        width:'12%',
        ...this.getColumnSearchProps('grade')
      },
      {
        title:'出版时间 PublishTime',
        dataIndex:'Year',
        key:'time',
        width:'12%',
        ...this.getColumnSearchProps('time')
      },
      {
        title:'作者 Author',
        dataIndex:'Author',
        key:'author',
        width:'12%',
        ...this.getColumnSearchProps('author')
      },
      {
        title:'价格 Price',
        dataIndex:'Price',
        key:'price',
        width:'12%',
        ...this.getColumnSearchProps('price')
      },
      {
        title:'总藏书 Total',
        dataIndex:'Total',
        key:'Total',
        width:'12%',
        ...this.getColumnSearchProps('Total')
      },
      {
        title:'库存 Storage',
        dataIndex:'Storage',
        key:'storage',
        width:'12%',
        ...this.getColumnSearchProps('storage')
      },
      {
        title:'时间 UpdateTime',
        dataIndex:'UpdateTime',
        key:'upd_time',
        width:'10%',
        ...this.getColumnSearchProps('upd_time')
      },
      {
        title:'operation',
        dataIndex:'opt',
        key:'opt',
        width:'10%'
      }
    ];
    return(
      <div id = "home">
        <Header props={this.props}/>
        <Table style = {{padding : '1%'}} columns = {db_structure} dataSource={this.state.db_data}/>
        <div  className="Add_Button">
          <Button type="primary" onClick={() => this.setState({show_add_modal:true, add_update: null})}>Add New Item</Button>
        </div>
        <Modal title="加入一个新数据吧~" visible={this.state.show_add_modal} destroyOnClose={true} maskStyle  onOk={this.handleOK} onCancel={this.handleAddCancel}>
          <Form
            name="recordEditor"
            ref={this.formRef}
          >
            <Form.Item
              label = "书籍编号"
              key = "BookNo"
              name = "BookNo"
              rule = {[{required: true, message: "Please input book's id"}]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label = "书籍种类"
              name = "BookType"
              key = "BookType"
              rule = {[{required: true, message: "Please input student's name"}]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label = "书籍名称"
              name = "BookName"
              key = "BookName"
              rule = {[{required: true, message: "Please input student's GPA"}]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label = "出版社"
              name = "Publisher"
              key = "Publisher"
              rule = {[{required: true, message: "Please input student's id"}]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label = "出版时间"
              name = "Year"
              key = "Year"
              rule = {[{required: true, message: "Please input student's name"}]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label = "作者"
              name = "Author"
              key = "Author"
              rule = {[{required: true, message: "Please input student's GPA"}]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label = "售价"
              name = "Price"
              key = "Price"
              rule = {[{required: true, message: "Please input student's id"}]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        <Login />
      </div>
    );
  }
}
export default Home;