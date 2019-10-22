import React, { Component } from 'react';
import {
    Table,
    Button,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';

class FormProduct extends Component {
    render() {
        return (
            <Form>
                <FormGroup>
                    <Label for="description">Description</Label>
                    <Input id="description" name="description" type="text" placeholder="Product description..." />
                </FormGroup>
                <FormGroup>
                    <div className="form-row">
                        <div className="col-md-6">
                            <Label for="price">Price</Label>
                            <Input id="price" name="price" type="number" min="0.1" step="0.1" placeholder="Product price..." />
                        </div>
                    </div>
                </FormGroup>
            </Form>
        );
    }
}

class ListProduct extends Component {

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
                                            <Button color="danger" size="sm">Delete</Button>
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

    url = 'http://localhost:1234/read/products';
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
        fetch(this.url, this.config).then(response => {
            return response.json();
        }).then(products => {
            if (products.response) {
                this.setState({ products: products.info });
            }
        }).catch(error => {
            console.log("Product search error: ", error);
        });
    };

    render() {
        return (
            <div className="row">
                <div className="col-md-6 col-12">
                    <h2 className="font-weight-bold text-center">Product Registration</h2>
                    <FormProduct />
                </div>
                <div className="col-md-6 col-12">
                    <h2 className="font-weight-bold text-center">Product List</h2>
                    <ListProduct products={this.state.products} />
                </div>
            </div>
        );
    }
}