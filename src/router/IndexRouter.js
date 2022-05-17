import React, {Component} from 'react'
import { HashRouter, Route, Redirect, Switch } from "react-router-dom"
import Login from '../views/Login'
import Main from '../views/Main'
import {isAuth} from '../utils/AuthUtil'


class IndexRouter extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path={"/login"} component={Login} />
                    <Route path={"/main"} render={(props) => {
                        return isAuth() ? <Main {...props} /> : <Redirect to={"/login"} />
                    }} />
                    <Redirect to={"/main"} from={"/"} />
                </Switch>
            </HashRouter>
        )
    }
}

export default IndexRouter