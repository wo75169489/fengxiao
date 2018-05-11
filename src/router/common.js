// Views - Pages
import Page404 from '@/views/common/Page404';
import Page500 from '@/views/common/Page500';
import Login from '@/views/common/Login';
// import Register from '@/views/common/Register';
import ForgetPasswd from '../views/common/ForgetPasswd';

const route = [
    {
        path: '/pages',
        redirect: '/pages/404',
        name: 'Pages',
        component: {
            render(c) { return c('router-view') },
        },
        children: [
            {
                path: '404',
                name: 'Page404',
                component: Page404,
            },
            {
                path: '500',
                name: 'Page500',
                component: Page500,
            },
            {
                path: '/login',
                name: 'Login',
                component: Login,
            },
            {
                path: 'forgetpasswd',
                name: 'ForgetPasswd',
                component: ForgetPasswd,
            },
        
            // {
            //   path: 'register',
            //   name: 'Register',
            //   component: Register
            // }
        ],
    },
];

export default route;
