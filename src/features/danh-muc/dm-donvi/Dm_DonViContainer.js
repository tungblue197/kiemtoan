import { DataGrid, DateBox, DropDownBox, TextArea, TextBox, TreeList } from 'devextreme-react';
import { Column, RequiredRule } from 'devextreme-react/data-grid';
import Form, { Label, SimpleItem } from 'devextreme-react/form';
import NumberBox from 'devextreme-react/number-box';
import { Lookup, DropDownOptions } from 'devextreme-react/lookup';


import { Dialog, Heading } from 'evergreen-ui';
import React, { PureComponent } from 'react'
import HeaderPage from '../../../components/header-page/HeaderPage';
import SearchBar from '../../../components/search-bar/SearchBar';
import Dm_DonViService from './Dm_DonViService';
import MainGrid from './local-components/MainGrid';
import { ColumnLookup } from 'devextreme-react/tree-list';



export class Dm_DonViContainer extends PureComponent {
    constructor(props){
        super(props);
        this.mainGridRef = null;
        this.state = {
            dataSource: [],
            diaBanData: [],
            donViData: [],
            linhVuc: [],
            isLoading: false,
            selectedTemplateKey: {
                diaBan: []
            },
            selectedValue: null,
            mode: 'view',
            isShowModel: true,
        }
    }
    componentDidMount(){
        this.loadDonVi();
        this.loadLookupData();
    }

    handleSearch = (text) => {
        const { gridRef } = this.mainGridRef;
        gridRef.instance.searchByText(text);
    }
    handleAtions = (action) => {
        console.log('action : ', action);
        if(action === 'Sua') {
            this.setState((oldState) => {
                return { isShowModel: true }
            })
        }
    }
    loadDonVi = () => {
        Dm_DonViService.getAll().then(res => {
            this.setState({
                dataSource: res.data
            })
        });
    }



    loadLookupData = () => {
        this.setState({isLoading: false});
         Dm_DonViService.getAllDiaBan().then(res => {
             this.setState({
                diaBanData: res.data
             })
         })
         Dm_DonViService.getAllLinhLuc().then(res => {
            this.setState({
                linhVuc: res.data
             })
         })
    }
    selectedTemplateKeyChanged = (e, tree) => {
        const { selectedTemplateKey } = this.state;
        if(tree === 'dia-ban'){
            this.setState({
                selectedTemplateKey: {
                    ...selectedTemplateKey,
                    diaBan: e
                }
            })
        }
    }

    selectedRowChanged = (e) => {
        let data = e.selectedRowsData[0];
        this.setState({ selectedValue: data});
    }

    componentDidUpdate(){
        console.log('update')
    }

    diaBanDropDownTemplate = () => {
        return (
            <TreeList
                dataSource={this.state.diaBanData}
                keyExpr="Id"
                parentIdExpr="DBCha"
                searchPanel={{visible:true}}
                height={300}
                showBorders={true}
                showColumnHeaders={true}
                showRowLines={true}
                selection={{mode: 'single'}}
                selectedRowKeys={this.state.selectedTemplateKey.diaBan}
                onSelectedRowKeysChange={(e) => this.selectedTemplateKeyChanged(e, 'dia-ban')}
            >
                <Column dataField="MaDB" caption="M?? ?????a b??n"/>
                <Column dataField="TenDB" caption="T??n ?????a b??n"/>
            </TreeList>
        )
    }

    render() {
        return (
            <div className="page-contaienr">
               <HeaderPage  onAction={this.handleAtions} />
               <SearchBar title={'Danh m???c ????n v??? ki???m to??n'} onSearch={this.handleSearch}  />
               <div>
                   <MainGrid ref={ref => this.mainGridRef = ref} dataSource={this.state.dataSource} diaBanData={this.state.diaBanData} linhVucData={this.state.linhVuc} selectedRowChanged={this.selectedRowChanged}  />
                   <Dialog 
                        title="Th??m ????n v???"
                        confirmLabel="L??u"
                        cancelLabel="H???y"
                        isShown={this.state.isShowModel}
                        onCloseComplete={() => this.setState({isShowModel: false})}
                        width={'60%'}
                        header={() => <Heading >Th??m m???i ????n v???</Heading>}
                    >
                       <div>
                           <Form colCount={12}
                                formData={{  ...this.state.selectedValue }}
                            >
                               <SimpleItem colSpan={6}  editorType="dxTextBox" dataField="Ma" label={{text: 'M?? ????n v???'}}>
                                   <RequiredRule message="M?? ????n v??? l?? tr?????ng b???t bu???c"/>
                               </SimpleItem>
                               <SimpleItem colSpan={6} editorType="dxDropDownBox" dataField="IdCha"  label={{text: '????n v??? cha'}}>
                                   
                               </SimpleItem>
                               <SimpleItem colSpan={6} editorType="dxTextBox" dataField="Ten" label={{text: 'T??n ????n v???'}}>
                                    <RequiredRule message="????n v??? l?? tr?????ng b???t bu???c"/>
                               </SimpleItem>
                               <SimpleItem colSpan={6} editorType="dxDropDownBox" dataField="DiaBan"  label={{text: '?????a b??n'}} >
                                    <DropDownBox dataSource={this.state.diaBanData} value={this.state.selectedValue?.DiaBan}  valueExpr="Id" displayExpr="TenDB"  contentRender={this.diaBanDropDownTemplate}/>
                                    <RequiredRule message="?????a b??n l?? tr?????ng b???t bu???c"/>
                               </SimpleItem>
                               <SimpleItem colSpan={6} editorType="dxDateBox" dataField="NgayBatDau" editorOptions={{ displayFormat: 'dd/MM/yyyy'}} label={{text: 'Ng??y b???t ?????u'}}>
                                   <RequiredRule message="Ng??y b???t ?????u l?? tr?????ng b???t bu???c"/>
                               </SimpleItem>
                               
                               <SimpleItem colSpan={6} editorType="dxDropDownBox"  label={{text: 'L??nh v???c'}}>
                                    <RequiredRule message="L??nh v???c l?? tr?????ng b???t bu???c"/>
                               </SimpleItem>
                               <SimpleItem colSpan={6} editorType="dxDateBox" dataField="NgayKetThuc" editorOptions={{ displayFormat: 'dd/MM/yyyy'}} label={{text: 'Ng??y b???t ?????u'}}>
                                   <Label text="Ng??y k???t th??c"   />
                                   <RequiredRule message="Ng??y b???t ?????u l?? tr?????ng b???t bu???c"/>
                               </SimpleItem>
                               <SimpleItem colSpan={6} dataField="Sdt" editorType="dxTextBox" label={{text: 'S??? ??i???n tho???i'}}>
                               </SimpleItem>
                               <SimpleItem colSpan={12} editorType="dxTextArea" label={{text: 'Ghi ch??'}}>
                               </SimpleItem>
                           </Form>
                       </div>
                   </Dialog>
               </div>
            </div>
        )
    }
}

export default Dm_DonViContainer
