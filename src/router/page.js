// Containers
import Full from '@/containers/common/Full';

// Views
import Index from '@/views/pages/index';

// for demo


const route = [
    {
        path: '/',
        redirect: '/login',
        name: '商家后台',
        component: Full,
        children: [
            {
                path: 'index',
                name: '用户管理',
                component: Index,
            },
        ],
    },
];

export default route;