import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect, Fragment, Component } from 'react';
import { connect } from 'react-redux';
import {
  Image,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  Layout,
  Button,
  Text,
  List,
  Card,
  CardHeader,
  Select,
} from '@ui-kitten/components';

// Component

import { BaseURL, axiosBase } from '../constants/Endpoint';
import Notice from '../components/Notice';

// Redux action
import { setUsername, setToken, setAccount, reset, userLogout, isOnline } from '../redux/actions';

import ModalConfirm from '../components/ModalConfirm';
import { SkypeLoad } from '../components/indicator';
import { Table, Rows } from 'react-native-table-component';
import { isTokenExp, isTokenRefreshExp, getNewToken, refreshToken } from '../redux/actions/tokenAction';


// Redux state to component
const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    token_refresh: state.auth.token_refresh,
    username: state.auth.username,
    account: state.auth.account,
    profile: state.auth.profile,
  };
};

// Redux dispatch action to props
const mapDispatchToProps = (dispatch) => {
  return {
    setToken: (args) => (
      dispatch(setToken(args))
    ),
    setUsername: (args) => (
      dispatch(setUsername(args))
    ),
    setAccount: (args) => (
      dispatch(setAccount(args))
    ),
    isOnline: (args) => (
      dispatch(isOnline(args))
    ),
    reset: () => (
      dispatch(reset())
    ),
  }
}


class connectHomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selectedOption: null,
      dataSource: [],
      list_select: [],
      refreshing: false,
      displayData: false,
    }

    this.listData = []
  };

  componentDidMount() {
    if (this.props.token && !isTokenExp(this.props.token)) {
      this._fetchPortal(this.props.token);
    } else {
        if (this.props.token_refresh && !isTokenRefreshExp(this.props.token_refresh)) {
            refreshToken(this.props.token_refresh)
            .then((response) => {
                this.props.setToken(response.data.access);
                this.props.setTokenRefresh(response.data.refresh);
                this._fetchPortal(response.data.access);
            })
            .catch((error) => alert('Error in while refresh token ', error))
        } else {
            getNewToken({username: this.props.username, password: this.props.password})
            .then((response) => {
                this.props.setToken(response.data.access);
                this.props.setTokenRefresh(response.data.refresh);
                this._fetchPortal(response.data.access);
            })
            .catch((err) => {
                alert('Error in while get new token ', err)
            })
        }
    }
  }
  
  _fetchPortal = (token) => {
      const params = { ordering: '-dibuat_pada' } ;
      const header = { Authorization: `Bearer ${token}` }
      this.setState({isLoading: true})
      axiosBase.get('portal/', {
          params: params,
          headers: header
      })
      .then((response) => {
          this.listSelectOption(response.data.results)
          this.setState({
              isLoading: false,
              dataSource: response.data.results
          }, () => {
              // do with new state
              this.listData = response.data.results;
          });
      })
      .catch((err) => {
          this.setState({isLoading: false})
          if (err) {
              alert(err.response);
          };
      });
  };

  listSelectOption = (arry) => {
      // for select option
      let temp = [];
      arry.map((item, index) => {
          console.log(item)
          let smt = item.kategori.nama;
          
          if (temp.indexOf(smt) === -1) {
              temp.push(smt);
          };
      });
      temp.sort();
      temp.length && temp.map((item, index) => {
          let data = { text: `${item}`, id: index };
          this.setState(prev => ({
            list_select: [...prev.list_select, data],
          }));
      });
  }

  onSelect = (data) => {
    const newData = this.listData.filter((item) => {
        const itemData = item.kategori.nama? item.kategori.nama.toUpperCase() : ''.toUpperCase();
        const intData = data.text.toUpperCase();
        return itemData.indexOf(intData) > -1;
    })

    this.setState({
      displayData: true,
      dataSource: newData,
      selectedOption: newData.id
    })
  }

  wait = () => {
      return new Promise((resolve) => {
          if (!isTokenExp(this.props.token)) {
              resolve(this._fetchPortal(this.props.token));
          } else {
              if (this.props.token_refresh && !isTokenRefreshExp(this.props.token_refresh)) {
                  refreshToken(this.props.token_refresh)
                  .then((response) => {
                      this.props.setToken(response.data.access);
                      this.props.setTokenRefresh(response.data.refresh);
                      resolve(this._fetchPortal(response.data.access));
                  })
                  .catch((error) => {
                      alert(error.message); 
                      resolve();
                  })
              } else {
                  getNewToken({username: this.props.username, password: this.props.password})
                  .then((response) => {
                      this.props.setToken(response.data.access);
                      this.props.setTokenRefresh(response.data.refresh);
                      resolve(this._fetchPortal(response.data.access));
                  })
              }
          }
      });
  };

  onRefresh = () => {
      this.setState({refreshing: true});

      this.wait().then(() => this.setState({refreshing:false}));
  }

  render() {
    return (
      <Layout style={{ flex: 1, padding: 5 }}>
        <Layout
            style={{ 
                padding: 10 
            }}>
            <Select
                data={this.state.list_select}
                selectedOption={this.state.selectedOption}
                onSelect={(data) => this.onSelect(data)}
                placeholder='Semua Artikel'
                disabled={this.state.isLoading}
            />
        </Layout>
        <List
          data={this.state.dataSource}
          renderItem={CardStatus}
          refreshControl={
              <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
              />
          }
        />
      </Layout>
    );
  }
};

const HomeScreen = connect(mapStateToProps, mapDispatchToProps)(connectHomeScreen);
export default HomeScreen;


HomeScreen.navigationOptions = {
  title: 'Portal Akademik',
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginLeft: 10,
    marginRight: 10,
  },
  center: {
    alignSelf: 'center',
  }
});


const CardStatus = ({item, index}) => (
  <Card 
      style={{marginVertical: 8}} 
      header={() => (
              <Fragment>
                <Image
                  style={{
                    flex: 1,
                    height: 192,
                  }}
                  source={item? { uri: item.foto } : 'null'}
                />
                <Text style={{ textAlign: 'center', margin: 10 }} category='h6'>{item && item.judul}</Text>
              </Fragment>
          )
      }
      status='success'>
      <Text> {item && item.isi} </Text>
  </Card>
)
