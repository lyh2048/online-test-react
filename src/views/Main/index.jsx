import React from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import {Route, Switch, Redirect} from 'react-router-dom'
import {isAuth} from "../../utils/AuthUtil"
import Problem from "../Problem"
import Group from "../Group"
import Manage from "../Manage"
import GroupDetail from "../GroupDetail"
import Contest from "../Contest"


export default function Main() {
    return (
        <div>
            <Header />
            <Switch>
                <Route path={"/main/problem"} render={(props) => {
                    return isAuth() ? <Problem {...props} /> : <Redirect to={"/login"} />
                }} />
                <Route path={"/main/group"} render={(props) => {
                    return isAuth() ? <Group {...props} /> : <Redirect to={"/login"} />
                }} />
                <Route path={"/main/groupDetail/:id"} render={(props) => {
                    return isAuth() ? <GroupDetail {...props} /> : <Redirect to={"/login"} />
                }} />
                <Route path={"/main/manage"} render={(props) => {
                    return isAuth() ? <Manage {...props} /> : <Redirect to={"/login"} />
                }} />
                <Route path={"/main/contest/:id"} render={(props) => {
                    return isAuth() ? <Contest {...props} /> : <Redirect to={"/login"} />
                }} />
                <Redirect to={"/main/problem"} from={"/main"} />
            </Switch>
            <Footer />
        </div>
    )
}