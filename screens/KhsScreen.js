import React, { useState, useCallback } from 'react';
import { Layout, Text, List, ListItem, Select, Input } from '@ui-kitten/components'
import { StyleSheet, FlatList, Alert, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { axiosBase } from '../constants/Endpoint';
import { connect } from 'react-redux';
import { isTokenExp, isTokenRefreshExp, refreshToken, getNewToken } from '../redux/actions/tokenAction';
import { setToken, setTokenRefresh } from '../redux/actions';


const SelectSemester = (props) => {
    return (
        <Layout>
            <Select
                {...props}
            />
        </Layout>
    )
}

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


class connectKhsScreen extends React.Component {
    static navigationOptions = {
        title: 'KHS',
    }
    constructor(props) {
        super(props);
        this.state = {
            list_semester: [],
            selectedOption: null,
            isLoading: false,
            semester: 0,
            refreshing: false,
            tableHead: ['No', 'Kode', 'Matakuliah', 'SKS', 'Huruf Mutu', 'Angka Mutu', 'Nilai Mutu'],
            widthArrHead: [50, 100, 200, 80, 80, 80, 80],
            tableData: [],
            tableRowsDataMhs: [],
            tableRowJumlah: [],
            tableRowIPS: [],
            displayData: false,
        }

        this.listTable = [];
        this.onRefresh = this.onRefresh.bind(this);
        this.listSelectOption = this.listSelectOption.bind(this);
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
                .catch((error) => {
                    if (error) {
                        console.log(error.response)
                        alert('Error in while refresh token ', error)
                    }
                })
            } else {
                getNewToken({username: this.props.username, password: this.props.password})
                .then((response) => {
                    this.props.setToken(response.data.access);
                    this.props.setTokenRefresh(response.data.refresh);
                    this._apiKhs(response.data.access);
                })
                .catch((err) => {
                    console.log(err.response)
                    alert('Error in while get new token ', err)
                })
            }
        }
    };

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
            // console.log(response.data.results)
            this.listSelectOption(response.data.results)
            this.setState({
                isLoading: false,
            }, () => {
                // do with new state
                this.listTable = response.data.results;
            });

            // table
            this.handleTableData(response.data.results)

        })
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            this.setState({isLoading: false})
            if (err) {
                console.log(err.response)
                // alert(err.response);
            };
        });
    };

    listSelectOption = (arry) => {
        // for select option
        let temp = [];
        arry.map((item, index) => {
            console.log(item)
            let smt = item.krs.jadwal.matakuliah.semester;
            
            if (temp.indexOf(smt) === -1) {
                temp.push(smt);
            };
        });
        temp.sort();
        temp.length && temp.map((item, index) => {
            let data = { text: `Semester ${item}`, id: index + 1 };
            this.setState(prev => ({
                list_semester: [...prev.list_semester, data],
            }));
        });
    }

    handleTableData = (arry) => {
        let DATA = [];
        let countSKS = 0;
        let countNilaiMutu = 0;
        arry.map((item, index) => {
            const { matakuliah } = item.krs.jadwal;
            let nilaiMutu = item.total? (matakuliah.sks * item.total) : 0
            countSKS = countSKS + matakuliah.sks;
            countNilaiMutu = countNilaiMutu + nilaiMutu;
            DATA.push([
                (index + 1).toString(),
                matakuliah.kode, 
                matakuliah.nama, 
                matakuliah.sks.toString(), 
                item.nilai? getGrade(item.total) : 'E',
                item.nilai? item.total : '0',
                nilaiMutu.toString()
            ])
        });
        const semester = arry[0].krs.jadwal.matakuliah.semester % 2? 'Ganjil': 'Genap';
        const dataMhs = [
            ['NIM', ':  ' + this.props.profile.nim, 'Semester', `:  ${semester}`],
            ['Nama', `:  ${this.props.profile.nama_lengkap}`, 'Program Studi', `:  ${this.props.profile.program_studi? 'Keperawatan': '-none-'}`]
        ]
        const dividedNilaiMutuSKS = countNilaiMutu / countSKS;
        if (DATA.length > 0) {
            this.setState({
                tableData: DATA,
                tableRowJumlah: ['Jumlah', countSKS.toString(), '', countNilaiMutu.toString()],
                tableRowIPS: ['Indeks Prestasi Semester', dividedNilaiMutuSKS.toString()],
                tableRowsDataMhs: dataMhs,
            })
        }
    }

    onSelect = (data) => {
        const newData = this.listTable.filter((item) => {
            const itemData = item.krs.jadwal.matakuliah.semester? item.krs.jadwal.matakuliah.semester.toString() : '';
            const intData = data.id.toString();
            return itemData.indexOf(intData) > -1;
        })

        this.handleTableData(newData);
        this.setState({displayData: true})
        console.log(this.state.tableData);
    }

    wait = () => {
        return new Promise(resolve => {
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
                        if (error) {
                            console.log(error.response)
                            alert(error.message); 
                        }
                        resolve();
                    })
                } else {
                    getNewToken({username: this.props.username, password: this.props.password})
                    .then((response) => {
                        this.props.setToken(response.data.access);
                        this.props.setTokenRefresh(response.data.refresh);
                        resolve(this._apiKhs(response.data.access));
                    })
                    .catch((err) => {
                        if (err) {
                            console.log(err);
                        }
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
            return <ActivityIndicator style={{ marginTop: 30, alignSelf: 'center' }} />
        }

        return (
            <Layout level='1' 
                style={{
                    flex: 1
                }}>
                <Layout
                    style={{ 
                        padding: 10 
                    }}>
                    <SelectSemester
                        data={this.state.list_semester}
                        selectedOption={this.state.selectedOption}
                        onSelect={(data) => this.onSelect(data)}
                        placeholder='Pilih Semester'
                        disabled={this.state.isLoading}
                    />
                </Layout>
                
                <Layout style={{flex: 1}}>
                    <ScrollView horizontal={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />
                        }
                    >
                        <Layout style={{padding:5}}>
                            <Table>
                                <Rows
                                    data={this.state.tableRowsDataMhs}
                                    widthArr={[150, 200, 160, 160]}
                                    style={{ height: 25 }}
                                />
                            </Table>
                            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                                <Row 
                                    data={this.state.tableHead} 
                                    widthArr={[50, 100, 200, 80, 80, 80, 80]} 
                                    style={{ 
                                        height: 50, 
                                        backgroundColor: '#537791' 
                                    }}
                                    textStyle={{ textAlign: 'center' }}
                                />
                            </Table>
                            <ScrollView 
                                style={{ marginTop: -1 }}
                            >
                            {
                                this.state.displayData?
                                <TableWrapper borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                                    <Rows
                                        data={this.state.tableData} 
                                        widthArr={this.state.widthArrHead} 
                                        style={[{ height: 40, backgroundColor: '#E7E6E1' }]} 
                                        textStyle={{ textAlign: 'center' }}
                                    />
                                    <Row
                                        data={this.state.tableRowJumlah} 
                                        widthArr={[350, 80, 160, 80]}
                                        flexArr={[350, 80, 160, 80]}
                                        style={{ height: 40, backgroundColor: '#E7E6E1'}}
                                        textStyle={{ textAlign: 'center' }}
                                    />
                                    <Row
                                        data={this.state.tableRowIPS} 
                                        widthArr={[350, 320]}
                                        flexArr={[350, 320]}
                                        style={{ height: 40, backgroundColor: '#E7E6E1'}}
                                        textStyle={{ textAlign: 'center' }}
                                    />
                                </TableWrapper>
                                    : null
                            }
                            </ScrollView>
                        </Layout>
                    </ScrollView>
                </Layout>
            </Layout>
        )
    }
}

const KhsScreen = connect(mapStateToProps, mapDispacthToProps) (connectKhsScreen);
export default KhsScreen;

const getGrade = (args) => {
    switch (args) {
        case 4:
            return 'A';
        case 3.5:
            return 'B+';
        case 3:
            return 'B';
        case 2.5:
            return 'C+';
        case 2:
            return 'C';
        case 1: 
            return 'E';
        default:
            return 'E';
    }
}