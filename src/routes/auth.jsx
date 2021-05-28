import React from 'react';
import 'antd/dist/antd.css';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import './auth.css';
import Header from '../components/header.jsx';

import { Layout, Table, Space, Input, Button, Form, Modal ,message, Result } from 'antd';

const { Footer, Content } = Layout;
class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      db_data:[],
      record_status:"borrow",
      record_modal:false,
      record_data:[]
    }
    const token = localStorage.getItem('token');
    const url = "http://localhost:7001/sql/findRecord";
    fetch(url,{
      method:"POST",
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
      })
    }).then(res=>{
      return res.json();
    }).then(res=>{
      this.setState({db_data:res.res.map(i=>{return {...i, key:i.FID}})})
    }).catch(err=>{
      message.error("发生错误！可能是宁没有权限")
    })
  }
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
  handleAddRecord = () => {
    this.setState({record_modal:true})
  }
  handleRecordOK = () => {
    const token = localStorage.getItem('token');
    this.setState({
      record_data:this.formRef.current.getFieldValue(),
      record_modal:false
    },()=>{
      if(this.state.record_status === "borrow"){
        const url_bor = "http://localhost:7001/sql/borrowBook";
        fetch(url_bor,{
          method:"POST",
          body:JSON.stringify(this.state.record_data),
          mode:'cors',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          })
        }).then(res=>{
          return res.json();
        }).then(res=>{
          if(res.status === 200){
            message.success("Borrow item success!")
          } else if(res.status === 300) {
            message.error(res.errMsg)
          } else if(res.status === 301) {
            message.error(res.errMsg)
          } else {
            message.error(res.errMsg.sqlMessage)
          }
          const url = "http://localhost:7001/sql/findRecord";
          fetch(url,{
            method:"POST",
            headers: new Headers({
              'Authorization': `Bearer ${token}`,
            })
          }).then(res=>{
            return res.json();
          }).then(res=>{
            this.setState({db_data:res.res.map(i=>{return {...i, key:i.FID}})},()=>{
              console.log("new data",this.state.db_data)
              this.forceUpdate()
            })
          })
        })
      } else {
        const url_bor = "http://localhost:7001/sql/returnBook";
        fetch(url_bor,{
          method:"POST",
          body:JSON.stringify(this.state.record_data),
          mode:'cors',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          })
        }).then(res=>{
          return res.json();
        }).then(res=>{
          if(res.status === 200){
            message.success("Return item success!")
          } else if(res.status === 300) {
            message.error(res.errMsg)
          } else if(res.status === 301) {
            message.error(res.errMsg)
          } else {
            message.error(res.errMsg.sqlMessage)
          }
          const url = "http://localhost:7001/sql/findRecord";
          fetch(url,{
            method:"POST",
            headers: new Headers({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            })
          }).then(res=>{
            return res.json();
          }).then(res=>{
            this.setState({db_data:res.res.map(i=>{return {...i, key:i.FID}})},()=>{
              console.log("new data",this.state.db_data)
              this.forceUpdate()
            })
          })
        })
      }
    })

  }
  handleRecordCancel = () => {
    this.setState({record_modal:false})
  }
  formRef = React.createRef();
  render() {

    const db_structure = [
      {
        title:'记录ID FID',
        dataIndex:'FID',
        key:'fid',
        width:'10%',
        ...this.getColumnSearchProps('fid')
      },
      {
        title:'卡片号 CardNo',
        dataIndex:'CardNo',
        key:'cardno',
        width:'10%',
        ...this.getColumnSearchProps('cardno')
      },
      {
        title:'书籍号 BookNo',
        dataIndex:'BookNo',
        key:'bookno',
        width:'10%',
        ...this.getColumnSearchProps('bookno')
      },
      {
        title:'借阅时间 LendTime',
        dataIndex:'LentDate',
        key:'lenttime',
        width:'10%',
        ...this.getColumnSearchProps('lenttime')
      },
      {
        title:'归还日期 ReturnTime',
        dataIndex:'ReturnDate',
        key:'returntime',
        width:'10%',
        ...this.getColumnSearchProps('returntime')
      },
      {
        title:'操作 Operator',
        dataIndex:'Operator',
        key:'operator',
        width:'10%',
        ...this.getColumnSearchProps('operation')
      }
    ]
    if(this.token === null){
      return (
        <div>
          <Result
            status="error"
            title="Submission Failed"
            subTitle="You have no access to this page because of the authorization problems.Try login again."
          >
          </Result>
        </div>
      )
    }
    else {
      return (
        <div>
          <Layout>
            <Header props={this.props}></Header>
            <Content>
              <Table style = {{padding : '1%'}} columns = {db_structure} dataSource={this.state.db_data}/>
            </Content>
            <Footer>
              <div className="btn">
                <Button
                  type="primary"
                  style={{ margin : '3%'}}
                  onClick={() => {
                    this.setState({record_status:"borrow",record_data:[]},() => {
                      this.handleAddRecord()
                    })
                  }}
                >
                  借书 Borrow
                </Button>
                <Button
                  type="primary"
                  style={{ margin : '3%'}}
                  onClick={() => {
                    this.setState({record_status:"return",record_data:[]},() => {
                      this.handleAddRecord()
                    })
                  }}
                >
                  还书 Return
                </Button>
                </div>
            </Footer>
          </Layout>
          <Modal title={this.state.record_status === "borrow" ? "借书 Borrow" : "还书 Return"} visible={this.state.record_modal} destroyOnClose={true}  onOk={this.handleRecordOK} onCancel={this.handleRecordCancel}>
            <Form
              name="recordEditor"
              ref={this.formRef}
            >
              <Form.Item
                label = "卡号"
                key = "CardNo"
                name = "CardNo"
                rule = {[{required: true, message: "Please input card's id"}]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label = "书籍编号"
                name = "BookNo"
                key = "BookNo"
                rule = {[{required: true, message: "Please input book's id"}]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      )
    }
  }
}
export default Auth;
