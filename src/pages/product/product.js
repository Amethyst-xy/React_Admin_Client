import React, { Component } from "react";
import {Switch,Route, Redirect } from "react-router-dom";
import ProductAddition from './add_update';
import ProductHome from './product_home';
import ProductDetail from './product_detail';

class Product extends Component{
    render(){
        return (
            <Switch>
                <Route path='/product' exact component={ProductHome}></Route>
                <Route path='/product/detail' component={ProductDetail}></Route>
                <Route path='/product/add_update' component={ProductAddition}></Route>
                <Redirect to='/product'/>
            </Switch>
        )
    }
}

export default Product;