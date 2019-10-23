import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import { Table, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

class FormProduct extends Component {

    state = {
        model: {
            code: 0,
            description: '',
            value: 0
        }
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

    componentWillMount() {
        PubSub.subscribe('edit-product', (topic, product) => {
            this.setState({ model: product });
        });
    };

    render() {
        return (
            <Form>
                <FormGroup>
                    <div className="form-row">
                        <div className="col-md-12">
                            <Label for="description">Description</Label>
                            <Input id="description" name="description" type="text" placeholder="Product description..." value={this.state.model.description}
                                onChange={e => this.setValues(e, 'description')} />
                        </div>
                    </div>
                </FormGroup>
                <FormGroup>
                    <div className="form-row">
                        <div className="col-md-6">
                            <Label for="value">Price</Label>
                            <Input id="value" name="value" type="number" min="0.1" step="0.1" placeholder="R$" value={this.state.model.value}
                                onChange={e => this.setValues(e, 'value')} />
                        </div>
                    </div>
                </FormGroup>
                <br />
                <Button color="info" block onClick={this.create}>Save</Button>
            </Form>
        );
    }
}

class ListProduct extends Component {

    delete = (code) => {
        this.props.deleteProduct(code);
    };

    onEdit = (product) => {
        PubSub.publish('edit-product', product);
    };

    render() {
        const { products } = this.props;

        return (
            <Table className="table-bordered text-center">
                <thead className="thead-dark">
                    <tr>
                        <th>Code</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map(product => (
                            <tr key={product.code}>
                                <td>{product.code}</td>
                                <td>{product.description}</td>
                                <td>R$ {product.value}</td>
                                <td>
                                    <div className="row">
                                        <div className="col-md-6 col-12 text-right">
                                            <Button color="info" size="sm" onClick={e => this.onEdit(product)}>Edit</Button>
                                        </div>
                                        <div className="col-md-6 col-12 text-left">
                                            <Button color="danger" size="sm" onClick={e => this.delete(product.code)}>Delete</Button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
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
        }
    };

    componentDidMount() {
        fetch(`${this.url}read/products`, this.config).then(response => {
            return response.json();
        }).then(products => {
            if (products.response) {
                this.setState({ products: products.info });
            }
        }).catch(error => {
            console.log("Product search error: ", error);
        });
    };

    save = (product) => {

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
                const position = products.findIndex(prod => prod.code == objResponse.info.code);
                products[position] = objResponse.info;
                this.setState({ products, message: { text: 'Successfully updated product.', alert: 'info' } });
            } else {
                const { products } = this.state;
                products.push(objResponse.info);
                this.setState({ products, message: { text: 'Successfully created product.', alert: 'success' } });
            }
        }).catch(error => {
            console.log("Product search error: ", error);
        });
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
            this.setState({ products });
        }).catch(error => {
            console.log("Product search error: ", error);
        });
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-6 offset-md-3 col-12">
                        {
                            this.state.message.text !== '' ? (
                                <Alert color={this.state.message.alert}> {this.state.message.text}</Alert>
                            ) : ''
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 offset-md-1 col-12">
                        <h2 className="font-weight-bold text-center">Product Registration</h2>
                        <br />
                        <FormProduct productCreate={this.save} />
                    </div>
                    <div className="col-md-6 offset-md-1 col-12">
                        <h2 className="font-weight-bold text-center">Product List</h2>
                        <br />
                        <ListProduct products={this.state.products} deleteProduct={this.delete} />
                    </div>
                </div>
            </div>
        );
    }
}