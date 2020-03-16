import React, { Component } from 'react';
import { ActivityIndicator, RefreshControl } from 'react-native';
import {
    Layout, 
    Text, 
    Input, 
    List, 
    ListItem,
    Card,
    CardHeader,
} from '@ui-kitten/components';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { connect } from 'react-redux';
import { axiosBase } from '../constants/Endpoint';
import { isTokenExp, isTokenRefreshExp, refreshToken, getNewToken } from '../redux/actions/tokenAction';
import { setToken, setTokenRefresh } from '../redux/actions';

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        token_refresh: state.auth.token_refresh,
        account: state.auth.account,
        profile: state.auth.profile,
        username: state.auth.username,
        password: state.auth.password,
    }
}

const mapDispacthToProps = (dispatch) => {
    return {
        setToken: (args) => (
            dispatch(setToken(args))
        ),
        setTokenRefresh: (args) => (
            dispatch(setTokenRefresh(args))
        )
    }
}

class connectNilaiScreen extends Component {
    static navigationOptions = {
        title: 'Nilai',
    }
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            dataSource: [],
            refreshing: false,
            displayData: false,
            text: '',
        }

        this.listNilai = [];
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        if (!isTokenExp(this.props.token)) {
            this._apiKhs(this.props.token);
        } else {
            if (this.props.token_refresh && !isTokenRefreshExp(this.props.token_refresh)) {
                refreshToken(this.props.token_refresh)
                .then((response) => {
                    this.props.setToken(response.data.access);
                    this.props.setTokenRefresh(response.data.refresh);
                    this._apiKhs(response.data.access);
                })
                .catch((error) => alert('Error in while refresh token ', error))
            } else {
                getNewToken({username: this.props.username, password: this.props.password})
                .then((response) => {
                    this.props.setToken(response.data.access);
                    this.props.setTokenRefresh(response.data.refresh);
                    this._apiKhs(response.data.access);
                })
                .catch((err) => {
                    alert('Error in while get new token ', err)
                })
            }
        }
    }

    _apiKhs = (token) => {
        const nim = this.props.profile.nim;
        const data = { search: nim }
        const header = { Authorization: `Bearer ${token}` }
        this.setState({isLoading: true})
        axiosBase.get('akademik/nilai/', {
            params: data,
            headers: header
        })
        .then((response) => {
            this.setState({
                isLoading: false,
                dataSource: response.data.results
            }, () => {
                // do with new state
                this.listNilai = response.data.results;
            });
        })
        .catch((err) => {
            this.setState({isLoading: false})
            if (err) {
                alert(err.response);
            };
        });
    };

    handleFilter = (text) => {
        const newData = this.listNilai.filter((item) => {
            const itemData = item? item.krs.jadwal.matakuliah.nama.toUpperCase() : ''.toUpperCase();
            const textFilter = text.toUpperCase();

            const hasil = itemData.indexOf(textFilter) > -1;
            return hasil;
        });

        this.setState({
            dataSource: newData,
            text: text,
        });
    }

    wait = () => {
        return new Promise((resolve) => {
            if (!isTokenExp(this.props.token)) {
                resolve(this._apiKhs(this.props.token));
            } else {
                if (this.props.token_refresh && !isTokenRefreshExp(this.props.token_refresh)) {
                    refreshToken(this.props.token_refresh)
                    .then((response) => {
                        this.props.setToken(response.data.access);
                        this.props.setTokenRefresh(response.data.refresh);
                        resolve(this._apiKhs(response.data.access));
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
                        resolve(this._apiKhs(response.data.access));
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
        if (this.state.isLoading) {
            return <ActivityIndicator style={{ marginTop: 20, alignSelf: 'center' }} />
        }
        return (
            <Layout style={{margin: 5, flex: 1}}>
                <Input
                    style={{ margin: 20 }}
                    value={this.state.text}
                    onChangeText={(text) => this.handleFilter(text)}
                    placeholder='Cari matakuliah'
                />  
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
    };
}

const NilaiScreen = connect(mapStateToProps, mapDispacthToProps)(connectNilaiScreen);
export default NilaiScreen;

const CardStatus = ({item, index}) => (
    <Card 
        style={{marginVertical: 8}} 
        header={() => (
                <CardHeader
                    title={`${item.krs.jadwal.matakuliah.nama}`}
                />
            )
        }
        status='success'>
        <Table>
            <Rows
                data={[
                    ['Tugas',`:  ${item && item.tugas? item.tugas: '0'}`],
                    ['UTS', `:  ${item && item.uts? item.uts: '0'}`],
                    ['UAS', `:  ${item && item.uas? item.uas: '0'}`],
                    ['Dosen', `:  ${item.krs.jadwal.dosen[0].nama_lengkap}`],
                    [`${item? 'Dinilai pada': 'Belum ada nilai'}`, `:  ${item && item.dinilai_pada? item.dinilai_pada: '-'}`]
                ]}
                widthArr={[100, 200]}
                style={{ height: 25 }}
            />
        </Table>
    </Card>
)