import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import { Table, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

class FormProduct extends Component {

    state = {
        model: this.props.productEdit != null ? (this.props.productEdit) : ({
            code: 0,
            description: '',
            value: 0
        }),
    };

    setValues = (event, field) => {
        const { model } = this.state;
        model[field] = event.target.value;
        this.setState({ model });
    };

    create = () => {
        this.props.productCreate(this.state.model);
        this.setState({ model: { code: 0, description: '', value: 0 } });
    };

    list = () => {
        this.props.list();
    };

    componentWillMount() {
        PubSub.subscribe('edit-product', (topic, product) => {
            this.setState({ model: product });
        });
    };

    cancelUpdate = () => {
        this.setState({ model: { code: 0, description: '', value: 0 } });
        this.props.cleanUpdate();
    };

    keypress = (e) => {
        console.log("CHAMOU", e);
        if (e.which == 13) {
            this.create();
        }
    };

    render() {
        return (
            <Form>
                <FormGroup>
                    <div className="form-row">
                        <div className="col-md-12">
                            <Label for="description">Description</Label>
                            <Input id="description" name="description" type="text" placeholder="Product description..."
                                value={
                                    this.state.model.description
                                }
                                onChange={e => this.setValues(e, 'description')} onKeyPress={e => this.keypress(e)} />
                        </div>
                    </div>
                </FormGroup>
                <FormGroup>
                    <div className="form-row">
                        <div className="col-md-6">
                            <Label for="value">Price R$</Label>
                            <Input id="value" name="value" type="number" min="0.1" step="0.1" placeholder="R$"
                                value={
                                    this.state.model.value
                                }
                                onChange={e => this.setValues(e, 'value')} onKeyPress={e => this.keypress(e)} />
                        </div>
                    </div>
                </FormGroup>
                <br />
                <Button color="info" block onClick={this.create}>Save</Button>
                <div className="form-row">
                    <div className="col-md-6 offset-md-3">
                        {
                            this.state.model.code == 0 ? (
                                <Button color="success" block onClick={this.list} className="btnList">List of Products &gt;&gt;</Button>
                            ) : (
                                    <Button color="danger" block onClick={this.cancelUpdate} className="btnCancel">Cancel</Button>
                                )
                        }
                    </div>
                </div>
            </Form >
        );
    };
}

class ListProduct extends Component {

    delete = (code) => {
        this.props.deleteProduct(code);
    };

    onEdit = (product) => {
        this.props.editProduct(product)
    };

    newProduct = () => {
        this.props.newProduct();
    };

    render() {
        const { products } = this.props;

        return (
            <div>
                <div className="supTable col-md-12 col-12">
                    <Table className="text-center" hover>
                        <thead className="theadProducts">
                            <tr>
                                <th className="col1">Code</th>
                                <th className="col2 colDescription">Description</th>
                                <th className="col3">Price</th>
                                <th className="col4">Options</th>
                            </tr>
                        </thead>
                        <tbody className="bodyTable">
                            {
                                products.map(product => (
                                    <tr key={product.code}>
                                        <td className="col1">{product.code}</td>
                                        <td className="col2">{product.description}</td>
                                        <td className="col3">R$ {product.value}</td>
                                        <td className="col4">

                                            <img src={require('../../images/pencil.png')} className="iconEdit" onClick={e => this.onEdit(product)} title="Edit product"></img>

                                            <img src={require('../../images/delete.png')} className="iconDelete" onClick={e => this.delete(product.code)} title="Delete product"></img>

                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
                <div className="form-row">
                    <div className="col-md-6 offset-md-3">
                        <Button color="success" block onClick={this.newProduct} className="btnList">&lt;&lt; New Product</Button>
                    </div>
                </div>
            </div >
        );
    };
}

export default class ProductBox extends Component {

    url = 'http://localhost:1234/';
    header = new Headers();

    config = {
        method: 'GET',
        headers: this.header,
        mode: 'cors',
        cache: 'default'
    };

    state = {
        products: [],
        message: {
            text: '',
            alert: ''
        },
        errorSearch: '',
        list: false,
        productEdit: null
    };

    componentDidMount() {
        fetch(`${this.url}read/products`, this.config).then(response => {
            return response.json();
        }).then(products => {
            if (products.response) {
                this.setState({ products: products.info });
            }
        }).catch(error => {
            this.setState({ errorSearch: 'show' });
            console.log("Product search error: ", error);
        });
    };

    save = (product) => {

        if (product.description == '' || product.value == 0) {
            this.setState({
                message: { text: 'Need to fill in all fields.', alert: 'warning' }
            });
            this.timerMessage(1000);
        } else {

            const data = {
                description: product.description,
                value: parseFloat(product.value)
            };

            const configRequest = {
                method: 'POST',
                body: JSON.stringify({ product: data }),
                mode: 'cors',
                cache: 'default',
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            };

            let urlApi = `${this.url}new/product`;

            if (product.code !== 0) {
                configRequest.method = 'PUT';
                configRequest.body = JSON.stringify({ dataProduct: data });
                urlApi = `${this.url}update/product/${product.code}`;
            }

            fetch(urlApi, configRequest).then(response => {
                return response.json();
            }).then(objResponse => {
                if (product.code !== 0) {
                    const { products } = this.state;
                    const position = products.findIndex(prod => prod.code === objResponse.info.code);
                    products[position] = objResponse.info;
                    this.setState({ list: false, productEdit: null });
                    this.setState({ products, message: { text: 'Successfully updated product.', alert: 'info' } });
                    this.timerMessage(1000);
                } else {
                    const { products } = this.state;
                    products.push(objResponse.info);
                    this.setState({ products, message: { text: 'Successfully created product.', alert: 'success' } });
                    this.timerMessage(1000);
                }
            }).catch(error => {
                this.setState({
                    message: { text: 'Error adding or updating product.', alert: 'danger' }
                });
                this.timerMessage(2000);
                console.log("Product save error: ", error);
            });
        }
    };

    delete = (code) => {

        const configRequest = {
            method: 'DELETE',
            mode: 'cors',
            cache: 'default',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        };

        fetch(`${this.url}delete/product/${code}`, configRequest).then(response => {
            return response.json();
        }).then(deleted => {
            const products = this.state.products.filter(product => product.code !== code);
            this.setState({ products, message: { text: 'Successfully deleted product.', alert: 'info' } });
            this.timerMessage(1000);
        }).catch(error => {
            this.setState({
                message: { text: 'Error deleting product.', alert: 'danger' }
            });
            console.log("Product delete error: ", error);
        });
    }

    timerMessage = (time) => {
        setTimeout(() => {
            this.setState({ message: { text: '', alert: '' } });
        }, time);
    };

    showList = () => {
        const { list } = this.state;
        if (list) {
            this.componentDidMount();
        }
        this.setState({ list: !list });
    };

    showEditProduct = (product) => {
        this.setState({ list: false, productEdit: product });
    };

    cleanEditProduct = () => {
        this.componentDidMount();
        this.setState({ list: false, productEdit: null });
    };

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-8 offset-md-2 col-12 text-center">
                        {
                            this.state.message.text !== '' ? (
                                <Alert color={this.state.message.alert}> {this.state.message.text}</Alert>
                            ) : ''
                        }
                    </div>
                </div>
                <div className="row">
                    {
                        !this.state.list ? (
                            <div className="col-md-4 offset-md-4 col-12 formRegistration">
                                <h2 className="font-weight-bold text-center">
                                    {
                                        this.state.productEdit == null ? (
                                            'Product Registration'
                                        ) : (
                                                'Product Update'
                                            )
                                    }
                                </h2>
                                <br />
                                <FormProduct productCreate={this.save} list={this.showList} productEdit={this.state.productEdit} cleanUpdate={this.cleanEditProduct} />
                            </div>
                        ) :
                            <div className="col-md-8 offset-md-2 col-12">
                                <h2 className="font-weight-bold text-center">Product List</h2>
                                <br />
                                <div className="text-center">
                                    {
                                        this.state.errorSearch !== '' ? (
                                            <div className="text-center">
                                                <Alert color="danger"> Error finding registered products.</Alert>
                                                <div className="row">
                                                    <div className="col-md-4 offset-md-4 col-12">
                                                        <Button color="success" block onClick={this.showList} className="btnError">&lt;&lt; Return</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                                <ListProduct products={this.state.products} deleteProduct={this.delete} newProduct={this.showList} editProduct={this.showEditProduct} />
                                            )
                                    }
                                </div>
                            </div>
                    }
                </div>
            </div>
        );
    };
}