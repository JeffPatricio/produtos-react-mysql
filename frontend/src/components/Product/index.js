import React, { Component } from 'react';
import { Table, Button, Form, FormGroup, Label, Input } from 'reactstrap';

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
        console.log(this.state.model);
    };

    create = () => {
        const data = {
            description: this.state.model.description,
            value: parseFloat(this.state.model.value)
        };

        this.props.productCreate({ product: data });
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
    }

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
                                <td>{product.value}</td>
                                <td>
                                    <div className="row">
                                        <div className="col-md-6 col-12 text-right">
                                            <Button color="info" size="sm">Edit</Button>
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
    }
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
        products: []
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

    create = (product) => {

        const configRequest = {
            method: 'POST',
            body: JSON.stringify(product),
            mode: 'cors',
            cache: 'default',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        };

        fetch(`${this.url}new/product`, configRequest).then(response => {
            return response.json();
        }).then(newProduct => {
            const { products } = this.state;
            products.push(newProduct.info);
            this.setState({ products });

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
            const products = this.state.products.filter(product => product.code != code);
            this.setState({ products });
        }).catch(error => {
            console.log("Product search error: ", error);
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-4 offset-md-1 col-12">
                    <h2 className="font-weight-bold text-center">Product Registration</h2>
                    <br />
                    <FormProduct productCreate={this.create} />
                </div>
                <div className="col-md-6 offset-md-1 col-12">
                    <h2 className="font-weight-bold text-center">Product List</h2>
                    <ListProduct products={this.state.products} deleteProduct={this.delete} />
                </div>
            </div>
        );
    }
}