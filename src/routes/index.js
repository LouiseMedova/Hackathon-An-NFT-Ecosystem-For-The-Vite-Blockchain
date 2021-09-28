import MyTokens from "../pages/MyTokens";
import AllTokens from "../pages/AllTokens";
import TokenIdPage from "../pages/TokenIdPage"
import Login from "../pages/Login";

export const privateRoutes = [
    {path: '/mytokens', component: MyTokens, exact: true},
    {path: '/alltokens', component: AllTokens, exact: true},
    {path: '/mytokens/:id', component: TokenIdPage, exact: true, props: true}
]

export const publicRoutes = [
    {path: '/login', component: Login, exact: true},
]