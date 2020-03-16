import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import {
    Layout, 
    Text, 
    List, 
    ListItem, 
    Input,
    Card,
    CardHeader,
} from '@ui-kitten/components';
import { 
    Table, 
    TableWrapper, 
    Row, 
    Rows, 
    Col 
} from 'react-native-table-component';
import { axiosBase } from '../constants/Endpoint';
import { connect } from 'react-redux';
import { isTokenExp, isTokenRefreshExp, refreshToken, getNewToken } from '../redux/actions/tokenAction';
import { setToken, setTokenRefresh } from '../redux/actions';


const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        profile: state.auth.profile,
        username: state.auth.username,
        password: state.auth.password,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setToken: (args) => (
            dispatch(setToken(args))
        ),
        setTokenRefresh: (args) => (
            dispatch(setTokenRefresh(args))
        ),
    }
}

class connectJadwalScreen extends Component {
    static navigationOptions = {
        title: 'Jadwal Kuliah',
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            list_matkul: [],
            refreshing: false,
        }

        this.renderItem = this.renderItem.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        if (!isTokenExp(this.props.token)) {
            this._apiJadwal(this.props.token);
        } else {
            if (this.props.token_refresh && !isTokenRefreshExp(this.props.token_refresh)) {
                refreshToken(this.props.token_refresh)
                .then((response) => {
                    this.props.setToken(response.data.access);
                    this.props.setTokenRefresh(response.data.refresh);
                    this._apiJadwal(response.data.access);
                })
                .catch((error) => {
                    if (error) {
                        console.log(error.response)
                        alert(error)
                    }
                })
            } else {
                getNewToken({username: this.props.username, password: this.props.password})
                .then((response) => {
                    this.props.setToken(response.data.access);
                    this.props.setTokenRefresh(response.data.refresh);
                    this._apiJadwal(response.data.access);
                })
            }
        }
    };

    _apiJadwal = (token) => {
        const nim = this.props.profile.nim
        const data = { search: nim }
        const header = { Authorization: `Bearer ${token}` }
        this.setState({isLoading: true})
        return axiosBase.get('akademik/jadwal/', {
            params: data,
            headers: header
        })
        .then((response) => {
            this.setState({
                list_matkul: response.data.results,
                isLoading: false
            });
        })
        .catch((err) => {
            this.setState({isLoading: false});
            if (err) {
                console.log(err.response)
                alert(err.response);
            };
        });
    }

    wait = () => {
        return new Promise(resolve => {
            if (!isTokenExp(this.props.token)) {
                resolve(this._apiJadwal(this.props.token));
            } else {
                if (!isTokenRefreshExp(this.props.token_refresh)) {
                    refreshToken(this.props.token_refresh)
                    .then((response) => {
                        this.props.setToken(response.data.access);
                        this.props.setTokenRefresh(response.data.refresh);
                        resolve(this._apiJadwal(response.data.access));
                    })
                    .catch((error) => {
                        if (error) {
                            console.log(error.response)
                            alert(error.message);
                        };
                        resolve();
                    });
                } else {
                    getNewToken({username: this.props.username, password: this.props.password})
                    .then((response) => {
                        this.props.setToken(response.data.access);
                        this.props.setTokenRefresh(response.data.refresh);
                        resolve(this._apiJadwal(response.data.access));
                    })
                    .catch((err) => {
                        if (err) {
                            console.log(err.response)
                            alert(err.message);
                        };
                        resolve();
                    });
                }
            }
        });
    };

    onRefresh = () => {
        this.setState({refreshing: true});

        this.wait()
        .then(() => this.setState({refreshing: false}))
    }

    renderItem = ({item, index}) => {
        return (
            <ListItem
                title={`${item.jadwal.matakuliah.nama}`}
                description={
                    `Hari       : ${getHari(item.jadwal.hari)}` +
                    `\nJam      : ${item.jadwal.jam_mulai} - ${item.jadwal.jam_akhir}` +
                    `\nRuang    : ${item.jadwal.ruang_kuliah}` +
                    `\nDosen    : ${item.jadwal.dosen[0].nama_lengkap}`
                }
                titleStyle={{ fontSize: 16, borderTopColor: '#6690FF', borderTopWidth: 5, paddingTop: 10, borderTopStartRadius: 50 }}
                descriptionStyle={{ fontSize: 14 }}
            />
        )
    }

    render() {
        const itemSeparator = () => <Layout level='3' style={{ height: 5, width: '100%' }} />;
        if (this.state.isLoading) {
            return <ActivityIndicator style={{ justifyContent: 'center', marginTop: 20}} />
        }
        return (
            <Layout>
                <List
                    data={this.state.list_matkul}
                    ItemSeparatorComponent={itemSeparator}
                    enambleEmptySections={true}
                    style={{ marginTop: 10 }}
                    renderItem={CardStatus}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                />
            </Layout>
        )
    }

}

const JadwalScreen = connect(mapStateToProps, mapDispatchToProps) (connectJadwalScreen)
export default JadwalScreen;

const CardStatus = ({item, index}) => (
    <Card 
        style={{marginVertical: 8}} 
        header={() => (
                <CardHeader
                    title={`${item.matakuliah.nama}`}
                />
            )
        }
        status='success'>
        <Table>
            <Rows
                data={[
                    ['Matakuliah',`:  ${item && item.matakuliah.nama}`],
                    ['SKS', `:  ${item && item.matakuliah.sks}`],
                    ['Hari', `:  ${item && getHari(item.hari)}`],
                    ['Waktu', `:  ${item && item.jam_mulai +' - '+ item.jam_akhir}`],
                    [`Ruang`, `: ${item && item.ruang_kuliah}`],
                    [`Dosen`, `: ${item && item.dosen.map((d) => d.nama_lengkap).join(', ')}`]
                ]}
                widthArr={[100, 200]}
                style={{ height: 25 }}
            />
        </Table>
    </Card>
)

const getHari = (args) => {
    switch (args) {
        case 1:
            return 'Senin'
        case 2:
            return 'Selasa'
        case 3:
            return 'Rabu'
        case 4:
            return 'Kamis'
        case 5:
            return "Jum'at"
        case 6:
            return 'Sabtu'
        default:
            break;
    }
}
